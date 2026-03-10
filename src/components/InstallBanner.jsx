// src/components/InstallBanner.jsx
// Kapitel 7 — Add to Homescreen Banner (Android + iOS)

import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import usePWA from '../hooks/usePWA';

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const Banner = styled.div`
  position: fixed;
  bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  left: 16px; right: 16px;
  background: rgba(30, 28, 50, 0.97);
  border: 1px solid rgba(124, 111, 205, 0.3);
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 900;
  animation: ${slideUp} 300ms ease;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
`;

const AppIcon = styled.img`
  width: 44px; height: 44px;
  border-radius: 10px;
  flex-shrink: 0;
`;

const TextBlock = styled.div`flex: 1; min-width: 0;`;

const BannerTitle = styled.p`
  font-size: 14px; font-weight: 800; color: #fff; margin: 0 0 2px;
`;

const BannerSub = styled.p`
  font-size: 11px; color: rgba(255,255,255,0.4); margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const InstallBtn = styled.button`
  background: #7c6fcd;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 9px 16px;
  font-size: 13px; font-weight: 800;
  cursor: pointer;
  touch-action: manipulation;
  flex-shrink: 0;
  white-space: nowrap;
`;

const CloseBtn = styled.button`
  background: none; border: none;
  color: rgba(255,255,255,0.3);
  font-size: 18px; cursor: pointer;
  padding: 4px; flex-shrink: 0;
  touch-action: manipulation;
`;

// iOS-Anleitung
const IOSSheet = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 901;
  display: flex; align-items: flex-end;
`;

const IOSCard = styled.div`
  width: 100%;
  background: #1a1a2e;
  border-radius: 20px 20px 0 0;
  padding: 20px 20px calc(20px + env(safe-area-inset-bottom, 0px));
  animation: ${slideUp} 250ms ease;
`;

const IOSTitle = styled.h2`
  font-size: 17px; font-weight: 800; color: #fff; margin: 0 0 16px;
  text-align: center;
`;

const IOSStep = styled.div`
  display: flex; align-items: flex-start; gap: 12px;
  margin-bottom: 14px;
`;

const IOSNum = styled.div`
  width: 28px; height: 28px;
  background: #7c6fcd; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; color: #fff;
  flex-shrink: 0;
`;

const IOSText = styled.p`
  font-size: 14px; color: rgba(255,255,255,0.7); margin: 4px 0 0; line-height: 1.5;
`;

const IOSClose = styled.button`
  width: 100%; margin-top: 16px;
  padding: 14px; background: rgba(255,255,255,0.07);
  border: none; border-radius: 12px;
  color: rgba(255,255,255,0.6); font-size: 15px; font-weight: 700;
  cursor: pointer; touch-action: manipulation;
`;

const InstallBanner = () => {
  const { canInstall, isIOS, isInstalled, promptInstall } = usePWA();
  const [dismissed,   setDismissed]   = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  // Bereits installiert oder dismissed → nichts zeigen
  if (isInstalled || dismissed) return null;
  if (!canInstall && !isIOS)    return null;

  return (
    <>
      <Banner role="complementary" aria-label="App installieren">
        <AppIcon src="/icons/icon-192x192.png" alt="StickerSwap" />
        <TextBlock>
          <BannerTitle>Zum Homescreen hinzufügen</BannerTitle>
          <BannerSub>Schneller Zugriff — auch offline</BannerSub>
        </TextBlock>
        <InstallBtn
          onClick={isIOS ? () => setShowIOSHelp(true) : promptInstall}
          aria-label="App installieren"
        >
          Installieren
        </InstallBtn>
        <CloseBtn
          onClick={() => setDismissed(true)}
          aria-label="Schließen"
        >
          ×
        </CloseBtn>
      </Banner>

      {/* iOS Schritt-für-Schritt Anleitung */}
      {showIOSHelp && (
        <IOSSheet
          onClick={(e) => e.target === e.currentTarget && setShowIOSHelp(false)}
        >
          <IOSCard>
            <IOSTitle>📱 Zum Homescreen hinzufügen</IOSTitle>
            <IOSStep>
              <IOSNum>1</IOSNum>
              <IOSText>Tippe unten auf das <strong>Teilen-Symbol</strong> <span aria-hidden="true">⬆️</span> in der Safari-Leiste</IOSText>
            </IOSStep>
            <IOSStep>
              <IOSNum>2</IOSNum>
              <IOSText>Scrolle nach unten und wähle <strong>„Zum Home-Bildschirm"</strong></IOSText>
            </IOSStep>
            <IOSStep>
              <IOSNum>3</IOSNum>
              <IOSText>Tippe oben rechts auf <strong>„Hinzufügen"</strong></IOSText>
            </IOSStep>
            <IOSClose onClick={() => { setShowIOSHelp(false); setDismissed(true); }}>
              Verstanden
            </IOSClose>
          </IOSCard>
        </IOSSheet>
      )}
    </>
  );
};

export default InstallBanner;
