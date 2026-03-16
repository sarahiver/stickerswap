import React from 'react';
import ReactDOM from 'react-dom/client';
import './locales/i18n'; // Eine einzige i18n-Datei mit allem
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
