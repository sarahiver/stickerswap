// src/components/ReputationBadge.jsx
// Kapitel 5 — Wiederverwendbares Reputation-Badge für MatchCard + Profile

import React from 'react';
import styled, { css } from 'styled-components';

const getReputationTier = (score) => {
  if (score >= 50)  return { tier: 'top',     label: 'Top-Tauscher', icon: '🏆', color: '#5de8a0', bg: 'rgba(50,200,120,0.15)'  };
  if (score >= 20)  return { tier: 'verified', label: 'Erfahren',    icon: '✅', color: '#8a9bff', bg: 'rgba(100,120,255,0.15)' };
  if (score >= 5)   return { tier: 'normal',  label: 'Aktiv',        icon: '🌱', color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.07)' };
  if (score >= 0)   return { tier: 'newbie',  label: 'Neuling',      icon: '👶', color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.05)' };
  return              { tier: 'warning', label: 'Warnung',     icon: '⚠️', color: '#ff7070', bg: 'rgba(255,80,80,0.15)'  };
};

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ $size }) => $size === 'sm' ? '10px' : '12px'};
  font-weight: 700;
  padding: ${({ $size }) => $size === 'sm' ? '2px 6px' : '4px 9px'};
  border-radius: 20px;
  white-space: nowrap;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const ReputationBadge = ({ score = 0, size = 'md', showScore = false }) => {
  const info = getReputationTier(score);
  return (
    <Badge $bg={info.bg} $color={info.color} $size={size}>
      <span aria-hidden="true">{info.icon}</span>
      {info.label}
      {showScore && <span style={{ opacity: 0.7 }}>({score})</span>}
    </Badge>
  );
};

export { getReputationTier };
export default ReputationBadge;


// ─────────────────────────────────────────────────────────────────────────────
// src/i18n/kapitel5-keys.js
// Neue i18n-Keys für Kapitel 5 — in translation.json einfügen
// ─────────────────────────────────────────────────────────────────────────────

export const de = {
  // WalletPage
  "wallet.title":           "Mein Wallet",
  "wallet.subtitle":        "Token-Guthaben und Transaktionen",
  "wallet.balance":         "Guthaben",
  "wallet.yourBalance":     "Dein Guthaben",
  "wallet.available":       "Verfügbar",
  "wallet.locked":          "Gesperrt",
  "wallet.buyTokens":       "Token kaufen",
  "wallet.popular":         "Beliebt",
  "wallet.history":         "Transaktionen",
  "wallet.loadingHistory":  "Lädt…",
  "wallet.noHistory":       "Noch keine Transaktionen",
  "wallet.transactionList": "Transaktionsliste",
  "wallet.txType.purchase":          "Token-Kauf",
  "wallet.txType.swap_lock":         "Kaution gesperrt",
  "wallet.txType.swap_refund":       "Kaution zurück",
  "wallet.txType.reputation_change": "Reputation-Änderung",
  "wallet.txType.bonus":             "Bonus",

  // SwapDetailView
  "swap.detail.title":           "Tausch-Details",
  "swap.detail.partner":         "Tauschpartner",
  "swap.detail.timeline":        "Status-Verlauf",
  "swap.detail.currentStep":     "Aktueller Schritt",
  "swap.detail.exchange":        "Tausch-Inhalt",
  "swap.detail.exchangeTitle":   "Tausch-Inhalt",
  "swap.detail.proofUpload":     "Versand-Nachweis",
  "swap.detail.proofTitle":      "Foto des Briefes hochladen",
  "swap.detail.proofHint":       "Lade ein Foto des frankierten Umschlags hoch. Erst dann kannst du den Status auf „Versendet" setzen.",
  "swap.detail.uploadZone":      "Foto auswählen",
  "swap.detail.uploading":       "Wird hochgeladen…",
  "swap.detail.uploadCta":       "Tippe um Foto aufzunehmen oder auszuwählen",
  "swap.detail.trackingPlaceholder": "Sendungsnummer (optional)",
  "swap.detail.trackingLabel":   "Sendungsnummer",
  "swap.detail.markShipped":     "Als versendet markieren",
  "swap.detail.confirmReceived": "Empfang bestätigen",
  "swap.detail.completed":       "Tausch erfolgreich abgeschlossen!",
  "swap.detail.reputationGained": "+5 Reputation für beide Seiten",

  // Reputation
  "reputation.top":     "Top-Tauscher",
  "reputation.verified":"Erfahren",
  "reputation.normal":  "Aktiv",
  "reputation.newbie":  "Neuling",
  "reputation.warning": "Warnung",
};

export const en = {
  "wallet.title":           "My Wallet",
  "wallet.subtitle":        "Token balance and transactions",
  "wallet.balance":         "Balance",
  "wallet.yourBalance":     "Your balance",
  "wallet.available":       "Available",
  "wallet.locked":          "Locked",
  "wallet.buyTokens":       "Buy tokens",
  "wallet.popular":         "Popular",
  "wallet.history":         "Transactions",
  "wallet.loadingHistory":  "Loading…",
  "wallet.noHistory":       "No transactions yet",
  "wallet.transactionList": "Transaction list",
  "wallet.txType.purchase":          "Token purchase",
  "wallet.txType.swap_lock":         "Deposit locked",
  "wallet.txType.swap_refund":       "Deposit returned",
  "wallet.txType.reputation_change": "Reputation change",
  "wallet.txType.bonus":             "Bonus",

  "swap.detail.title":           "Swap Details",
  "swap.detail.partner":         "Trading partner",
  "swap.detail.timeline":        "Status timeline",
  "swap.detail.currentStep":     "Current step",
  "swap.detail.exchange":        "Swap contents",
  "swap.detail.exchangeTitle":   "Swap contents",
  "swap.detail.proofUpload":     "Shipping proof",
  "swap.detail.proofTitle":      "Upload photo of envelope",
  "swap.detail.proofHint":       "Upload a photo of the stamped envelope. Only then can you set the status to shipped.",
  "swap.detail.uploadZone":      "Select photo",
  "swap.detail.uploading":       "Uploading…",
  "swap.detail.uploadCta":       "Tap to take photo or select from gallery",
  "swap.detail.trackingPlaceholder": "Tracking number (optional)",
  "swap.detail.trackingLabel":   "Tracking number",
  "swap.detail.markShipped":     "Mark as shipped",
  "swap.detail.confirmReceived": "Confirm receipt",
  "swap.detail.completed":       "Swap completed successfully!",
  "swap.detail.reputationGained": "+5 reputation for both sides",

  "reputation.top":     "Top Trader",
  "reputation.verified":"Experienced",
  "reputation.normal":  "Active",
  "reputation.newbie":  "Newbie",
  "reputation.warning": "Warning",
};
