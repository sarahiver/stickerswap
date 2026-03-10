// src/pages/WalletPage.jsx
// Platzhalter — WalletPage aus Kapitel 5 hier einfügen (bereits im Kapitel-5-ZIP)
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Page = styled.div`
  height: 100%; overflow-y: auto; background: var(--color-bg); padding: 20px 16px;
`;
const Title = styled.h1`font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 8px;`;
const Sub   = styled.p`font-size: 13px; color: var(--color-text-mute); margin: 0;`;

const WalletPage = () => {
  const { t } = useTranslation();
  return (
    <Page>
      <Title>{t('wallet.title')}</Title>
      <Sub>WalletPage aus Kapitel 5 — src/pages/WalletPage.jsx aus Kapitel-5-ZIP einfügen</Sub>
    </Page>
  );
};

export default WalletPage;
