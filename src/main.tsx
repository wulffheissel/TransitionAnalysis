import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// This is where our root component in react renders in
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
