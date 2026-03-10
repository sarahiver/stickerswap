# StickerSwap 🏆

> Die clevere Panini-Tauschbörse. Mobile-First. Token-Ökonomie. Automatisches Matching.

## Kapitel-Übersicht

| Kapitel | Inhalt | Status |
|---------|--------|--------|
| **Kapitel 0** | Design-Philosophie & Mobile-First Foundation | ✅ Dieses ZIP |
| Kapitel 1 | Auth (Supabase) + Onboarding | 🔜 |
| Kapitel 2 | Album-Verwaltung + CSV-Import (Admin) | 🔜 |
| Kapitel 3 | Sticker-Collection + Status-Management | 🔜 |
| Kapitel 4 | Matching-Algorithmus (Pro Feature) | 🔜 |
| Kapitel 5 | Tausch-Lifecycle + Token-Kaution | 🔜 |
| Kapitel 6 | Token-System + Stripe | 🔜 |
| Kapitel 7 | Rarity-Score + Händler-Modul | 🔜 |
| Kapitel 8 | Admin-Panel + CSV-Upload | 🔜 |
| Kapitel 9 | Mehrsprachigkeit (i18next) | 🔜 |

---

## Schnellstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen konfigurieren
cp .env.example .env
# .env öffnen und Supabase-Keys eintragen

# 3. Entwicklungsserver starten
npm start
```

Die App läuft auf [http://localhost:3000](http://localhost:3000).

---

## Kapitel 0 — Was ist drin?

### Mobile-First Prinzipien (alle 5 implementiert)

| # | Prinzip | Wo implementiert |
|---|---------|-----------------|
| 1 | Layouts für iPhone SE (320px) bis 15 Pro Max | `StickerGrid`, alle Layouts |
| 2 | Bottom Sheets statt Modals | `BottomSheet.jsx` |
| 3 | Touch-Targets ≥ 44×44px | `GlobalStyles`, `Button`, `StickerCell`, `BottomNav` |
| 4 | Kein horizontales Scrollen | `GlobalStyles` (`overflow-x: hidden` auf html + body) |
| 5 | `touch-action: manipulation` | `GlobalStyles` (global auf `*`) |

### Projektstruktur

```
src/
  theme/
    theme.js          Design Tokens (Farben, Spacing, Breakpoints)
    GlobalStyles.js   Reset + alle 5 Mobile-First Prinzipien
  components/
    BottomSheet.jsx   Drag-to-dismiss Bottom Sheet
    Button.jsx        5 Varianten, min 44px
    BottomNav.jsx     Mobile Bottom Navigation
    Card.jsx          Content-Container
    StickerCell.jsx   Sticker + StickerGrid
    Tag.jsx           Status-Badges
    ProgressBar.jsx   Album-Fortschritt
    Toast.jsx         Feedback-Meldungen
  hooks/
    useToast.js       Toast-State-Management
    useBottomSheet.js Sheet-State + Payload
  pages/
    DashboardPage.jsx Haupt-Demo aller Komponenten
  lib/
    supabase.js       Supabase Client (konfigurierbar)
  App.js              Root: ThemeProvider + Navigation
```

### Tech Stack

- **React** 18 (CRA — kein Vite/Next.js)
- **Styled Components** 6
- **Supabase** JS Client (bereit, noch nicht verbunden)
- Fonts: Bebas Neue + DM Sans + Space Mono

---

## Supabase Setup

1. Projekt auf [supabase.com](https://supabase.com) anlegen
2. Unter **Settings → API** die URL und den `anon` Key kopieren
3. In `.env` eintragen:

```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...
```

Das Datenbankschema (alle Tabellen, RLS-Policies, Edge Functions) folgt in den nächsten Kapiteln.

---

## Git Push

```bash
git init
git add .
git commit -m "Kapitel 0: Mobile-First Foundation"
git remote add origin https://github.com/DEIN-USER/stickerswap.git
git push -u origin main
```

---

*StickerSwap · Vertraulich · 2026*
