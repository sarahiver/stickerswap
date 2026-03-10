// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// i18n wird in App.js via I18nextProvider geladen
// CRA Service Worker NICHT registrieren — usePWA.js registriert unseren Custom SW

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
