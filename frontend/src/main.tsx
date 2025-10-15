import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento com ID "root" não encontrado no DOM');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App/>
  </StrictMode>
);
