import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Polyfill Buffer for Midnight SDK browser compatibility
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;
globalThis.Buffer = Buffer;

// Global polyfill for BigInt JSON serialization to support JSON.stringify inside Midnight SDK
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
