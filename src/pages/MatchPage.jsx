// src/pages/MatchPage.jsx
// Platzhalter — Smart Match aus Kapitel 4 hier einbinden
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Page = styled.div`
  height: 100%; overflow-y: auto; background: var(--color-bg); padding: 20px 16px;
`;
const Title = styled.h1`font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 8px;`;
const Sub   = styled.p`font-size: 13px; color: var(--color-text-mute); margin: 0;`;

const MatchPage = () => {
  const { t } = useTranslation();
  return (
    <Page>
      <Title>{t('match.title')}</Title>
      <Sub>Smart-Match aus Kapitel 4 — folgt in Kapitel 9</Sub>
    </Page>
  );
};

export default MatchPage;
