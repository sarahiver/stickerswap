// src/components/SwapDetailView.jsx
// Platzhalter — SwapDetailView aus Kapitel 5 hier einfügen
import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  height: 100%; overflow-y: auto; background: var(--color-bg); padding: 20px 16px;
`;
const BackBtn = styled.button`
  background: none; border: none; color: var(--color-text-dim);
  font-size: 15px; font-weight: 700; cursor: pointer; padding: 0 0 16px;
`;
const Title = styled.h1`font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 8px;`;
const Sub   = styled.p`font-size: 13px; color: var(--color-text-mute); margin: 0;`;

const SwapDetailView = ({ swapId, onBack }) => (
  <Page>
    <BackBtn onClick={onBack}>← Zurück</BackBtn>
    <Title>Swap #{swapId}</Title>
    <Sub>SwapDetailView aus Kapitel 5 — src/components/SwapDetailView.jsx einfügen</Sub>
  </Page>
);

export default SwapDetailView;
