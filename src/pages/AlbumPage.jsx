// src/pages/AlbumPage.jsx
// Platzhalter — wird in Kapitel 9 mit StickerGrid aus Kapitel 3 verbunden
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Page = styled.div`
  height: 100%; overflow-y: auto; background: var(--color-bg); padding: 20px 16px;
`;
const BackBtn = styled.button`
  background: none; border: none; color: var(--color-text-dim);
  font-size: 15px; font-weight: 700; cursor: pointer; padding: 0 0 16px;
  display: flex; align-items: center; gap: 6px;
`;
const Title = styled.h1`font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 8px;`;
const Sub   = styled.p`font-size: 13px; color: var(--color-text-mute); margin: 0;`;

const AlbumPage = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  return (
    <Page>
      <BackBtn onClick={() => navigate('/albums')}>← Zurück</BackBtn>
      <Title>Album</Title>
      <Sub>ID: {id} — Sticker-Grid folgt in Kapitel 9</Sub>
    </Page>
  );
};

export default AlbumPage;
