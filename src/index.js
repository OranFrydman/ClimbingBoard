import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/main.css';

// Add error boundary and logging
try {
  console.log('React app starting...');
  console.log('Document ready state:', document.readyState);
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found!</div>';
  } else {
    console.log('Root element found, creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    console.log('React app rendered!');
  }
} catch (error) {
  console.error('Error rendering React app:', error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">Error: ${error.message}<br><pre>${error.stack}</pre></div>`;
}
