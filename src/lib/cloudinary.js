// ============================================================
// cloudinary.js — Sichere Upload-Funktion
// Kapitel 1: Cloudinary-Schutz
//
// Ablauf:
//   1. Temporäres Signatur-Token von Edge Function holen
//   2. Upload direkt zu Cloudinary mit diesem Token
//   3. API Secret verlässt NIEMALS den Server
// ============================================================

import { supabase } from './supabase'

/**
 * Lädt eine Datei sicher zu Cloudinary hoch.
 * Das Frontend hat KEINE permanenten Schreibrechte —
 * jeder Upload benötigt ein frisches Token von der Edge Function.
 *
 * @param {File}   file           - Die hochzuladende Datei
 * @param {string} folder         - Zielordner ('avatars')
 * @param {Function} onProgress   - Callback für Upload-Fortschritt (0-100)
 * @returns {{ url: string, publicId: string }}
 */
export const uploadToCloudinary = async (file, folder = 'avatars', onProgress = null) => {
  // ── 1. Token von Edge Function holen ─────────────────────
  const { data: tokenData, error: tokenError } = await supabase.functions.invoke(
    'get-cloudinary-token',
    { body: { folder } }
  )

  if (tokenError || !tokenData) {
    throw new Error('Could not get upload token: ' + (tokenError?.message || 'Unknown error'))
  }

  const {
    signature,
    timestamp,
    cloudName,
    apiKey,
    folder: targetFolder,
    uploadPreset,
    maxFileSize,
    expiresAt,
  } = tokenData

  // Token abgelaufen?
  if (Date.now() / 1000 > expiresAt) {
    throw new Error('Upload token expired. Please try again.')
  }

  // Dateigröße prüfen
  if (file.size > maxFileSize) {
    throw new Error(`File too large. Maximum: ${Math.round(maxFileSize / 1_000_000)}MB`)
  }

  // Nur Bilder erlauben
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed')
  }

  // ── 2. FormData für Cloudinary aufbauen ──────────────────
  const formData = new FormData()
  formData.append('file',           file)
  formData.append('api_key',        apiKey)
  formData.append('timestamp',      timestamp.toString())
  formData.append('signature',      signature)
  formData.append('folder',         targetFolder)
  formData.append('upload_preset',  uploadPreset)

  // ── 3. Upload zu Cloudinary ───────────────────────────────
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Progress-Tracking
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      })
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        resolve({
          url:       response.secure_url,
          publicId:  response.public_id,
          width:     response.width,
          height:    response.height,
          format:    response.format,
        })
      } else {
        const err = JSON.parse(xhr.responseText)
        reject(new Error(err.error?.message || 'Upload failed'))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.open('POST', uploadUrl)
    xhr.send(formData)
  })
}
