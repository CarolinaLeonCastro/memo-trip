import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { initDebugTools } from './utils/debug';

// Initialiser les outils de debug en mode développement
if (import.meta.env.DEV) {
  initDebugTools();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
