
import React from 'react';
import { createRoot } from 'react-dom';
import App from './App.tsx';

// Buscamos el elemento raíz en el HTML
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se pudo encontrar el elemento con id "root". Asegúrate de que index.html tenga un <div id="root"></div>');
}

// Inicializamos React 18+ usando createRoot
const root = createRoot(rootElement);

// Renderizamos la aplicación principal
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
