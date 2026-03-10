import styled, { css } from 'styled-components';

// ============================================================
// Card — Semantik-Refactor Kapitel 3
//
// Card ist jetzt <article> wenn sie einen eigenständigen
// Inhaltsblock repräsentiert (z.B. Sticker-Karte, Match-Karte).
// Generische Container die keinen eigenständigen Kontext haben
// (z.B. Album-Progress, KPI-Wrapper) bleiben <div>.
//
// Verwendung:
//   <Card>              → <article> (Standard: eigenständiger Block)
//   <Card as="div">     → <div>     (Container ohne eigene Bedeutung)
//   <Card as="section"> → <section> (Abschnitt mit Überschrift)
//   <Card as="li">      → <li>      (in <ul>/<ol> Listen)
// ============================================================

const Card = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ $borderColor, theme }) => $borderColor || theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ $p, theme }) => $p || theme.spacing.md};
  overflow: hidden;
  /* PRINZIP 4: kein horizontaler Overflow */
  max-width: 100%;

  ${({ $glow }) => $glow && css`
    box-shadow: 0 0 20px rgba(245,200,66,0.12);
  `}
`;

export default Card;
