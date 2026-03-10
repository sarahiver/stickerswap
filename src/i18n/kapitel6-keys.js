// src/i18n/kapitel6-keys.js
// Neue i18n-Keys für Kapitel 6 — in translation.json einfügen

export const de = {
  // Chat
  "chat.label":           "Nachrichten",
  "chat.title":           "Nachrichten",
  "chat.reportProblem":   "Problem melden",
  "chat.disputed":        "In Prüfung",
  "chat.messageList":     "Nachrichtenverlauf",
  "chat.inputForm":       "Nachricht schreiben",
  "chat.inputLabel":      "Nachricht eingeben",
  "chat.inputPlaceholder":"Nachricht…",
  "chat.send":            "Senden",
  "chat.empty":           "Noch keine Nachrichten — schreib als Erster!",
  "chat.closed":          "Chat ist geschlossen",
  "chat.ownMessage":      "Deine Nachricht",
  "chat.partnerMessage":  "Nachricht des Partners",

  // System-Nachrichten (i18n_key aus DB)
  "chat.system.swap_accepted":  "{{user}} hat den Tausch angenommen ✅",
  "chat.system.shipped":        "{{user}} hat versendet 📦",
  "chat.system.both_shipped":   "Beide haben versendet! Auf Lieferung warten ✉️",
  "chat.system.completed":      "Tausch erfolgreich abgeschlossen 🎉",
  "chat.system.dispute_opened": "Problem gemeldet — unser Team prüft den Fall ⚠️",
  "chat.system.cancelled":      "Tausch wurde abgebrochen",

  // Dispute
  "dispute.title":        "Problem melden",
  "dispute.hint":         "Beschreibe das Problem. Die Token bleiben gesperrt, bis unser Team den Fall geprüft hat.",
  "dispute.placeholder":  "Was ist das Problem? (mind. 10 Zeichen)",
  "dispute.reasonLabel":  "Problembeschreibung",
  "dispute.submit":       "Einreichen",

  // Notifications
  "notif.swapAccepted":   "{{name}} hat deinen Tausch angenommen!",
  "notif.partnerShipped": "{{name}} hat versendet 📦",
  "notif.bothShipped":    "Beide haben versendet! Auf Lieferung warten ✉️",
  "notif.swapCompleted":  "Tausch abgeschlossen! +5 Reputation 🎉",
  "notif.disputeOpened":  "Problem gemeldet — unser Team prüft den Fall ⚠️",
  "notif.swapCancelled":  "Tausch wurde abgebrochen",

  // Common
  "common.loading":       "Lädt…",
  "common.cancel":        "Abbrechen",
  "common.back":          "Zurück",
};

export const en = {
  "chat.label":           "Messages",
  "chat.title":           "Messages",
  "chat.reportProblem":   "Report problem",
  "chat.disputed":        "Under review",
  "chat.messageList":     "Message history",
  "chat.inputForm":       "Write message",
  "chat.inputLabel":      "Enter message",
  "chat.inputPlaceholder":"Message…",
  "chat.send":            "Send",
  "chat.empty":           "No messages yet — be the first!",
  "chat.closed":          "Chat is closed",
  "chat.ownMessage":      "Your message",
  "chat.partnerMessage":  "Partner's message",

  "chat.system.swap_accepted":  "{{user}} accepted the swap ✅",
  "chat.system.shipped":        "{{user}} has shipped 📦",
  "chat.system.both_shipped":   "Both shipped! Waiting for delivery ✉️",
  "chat.system.completed":      "Swap completed successfully 🎉",
  "chat.system.dispute_opened": "Problem reported — our team is reviewing ⚠️",
  "chat.system.cancelled":      "Swap was cancelled",

  "dispute.title":        "Report problem",
  "dispute.hint":         "Describe the problem. Tokens stay locked until our team reviews the case.",
  "dispute.placeholder":  "What's the problem? (min 10 characters)",
  "dispute.reasonLabel":  "Problem description",
  "dispute.submit":       "Submit",

  "notif.swapAccepted":   "{{name}} accepted your swap!",
  "notif.partnerShipped": "{{name}} has shipped 📦",
  "notif.bothShipped":    "Both shipped! Waiting for delivery ✉️",
  "notif.swapCompleted":  "Swap completed! +5 reputation 🎉",
  "notif.disputeOpened":  "Problem reported — our team is reviewing ⚠️",
  "notif.swapCancelled":  "Swap was cancelled",

  "common.loading":       "Loading…",
  "common.cancel":        "Cancel",
  "common.back":          "Back",
};
