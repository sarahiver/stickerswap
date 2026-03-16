import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n/i18n';      // App-Übersetzungen (auth, nav, dashboard etc.)
import './locales/i18n';   // Landing-Page-Übersetzungen (15 Sprachen)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
