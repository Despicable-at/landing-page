import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter as Router } from 'react-router-dom';
import { NotificationProvider } from './NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </Router>
  </React.StrictMode>
);
