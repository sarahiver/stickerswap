import React from 'react';
import ReactDOM from 'react-dom/client';
import './locales/i18n'; // i18n vor allem anderen initialisieren
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
