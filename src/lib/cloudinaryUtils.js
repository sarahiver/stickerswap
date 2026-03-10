// src/lib/cloudinaryUtils.js
// Kapitel 7 — Cloudinary URL-Helper
// Alle Bilder bekommen automatisch f_auto,q_auto + responsive width

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME ?? '';
const BASE_URL   = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Erzeugt eine optimierte Cloudinary URL
 * @param {string} publicId  - z.B. 'stickerswap/swaps/abc123/proof'
 * @param {object} opts
 * @param {number} opts.width     - Zielbreite in px (für responsive)
 * @param {number} opts.height    - Zielhöhe in px
 * @param {string} opts.crop      - 'fill' | 'fit' | 'limit' | 'thumb'
 * @param {string} opts.gravity   - 'auto' | 'face' | 'center'
 * @param {string} opts.format    - überschreibt f_auto
 * @param {number} opts.quality   - überschreibt q_auto (1-100)
 */
export const cloudinaryUrl = (publicId, opts = {}) => {
  if (!publicId || !CLOUD_NAME) return '';

  const {
    width,
    height,
    crop    = 'limit',
    gravity = 'auto',
    format  = 'auto',
    quality = 'auto',
  } = opts;

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    width   ? `w_${width}`   : null,
    height  ? `h_${height}`  : null,
    width || height ? `c_${crop}` : null,
    width || height ? `g_${gravity}` : null,
    'dpr_auto',   // Retina-Support
  ].filter(Boolean).join(',');

  return `${BASE_URL}/${transforms}/${publicId}`;
};

/**
 * Sticker-Bild URL (klein, quadratisch)
 */
export const stickerImageUrl = (publicId, size = 120) =>
  cloudinaryUrl(publicId, { width: size, height: size, crop: 'fill', gravity: 'auto' });

/**
 * Profilbild URL
 */
export const avatarUrl = (publicId, size = 96) =>
  cloudinaryUrl(publicId, { width: size, height: size, crop: 'fill', gravity: 'face' });

/**
 * Versand-Beweis Foto (groß)
 */
export const proofImageUrl = (publicId) =>
  cloudinaryUrl(publicId, { width: 800, crop: 'limit' });

/**
 * Erzeugt srcSet für responsive Bilder
 * Nutzung: <img src={src} srcSet={srcSet} sizes="(max-width: 390px) 100vw, 390px" />
 */
export const cloudinarySrcSet = (publicId, widths = [320, 480, 640, 960]) => {
  return widths
    .map(w => `${cloudinaryUrl(publicId, { width: w })} ${w}w`)
    .join(', ');
};

/**
 * Inline-Bild aus URL mit f_auto,q_auto injizieren
 * Für bestehende Cloudinary URLs die schon gespeichert sind
 */
export const optimizeCloudinaryUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  // Bestehende Transformations ersetzen oder hinzufügen
  if (url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto,dpr_auto/');
  }
  return url;
};
