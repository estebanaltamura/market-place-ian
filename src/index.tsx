import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { initFireBase } from './firebaseConfig';
import './global.css';

initFireBase();

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
