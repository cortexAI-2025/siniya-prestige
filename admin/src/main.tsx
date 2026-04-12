import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-left"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#022C22',
            color: '#FDFaf6',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            direction: 'rtl',
          },
          success: {
            iconTheme: { primary: '#F59E0B', secondary: '#022C22' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#FDFaf6' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
