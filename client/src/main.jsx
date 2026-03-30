// ========================================
// REACT APP ENTRY POINT
// ========================================
// This file is the first to execute when the React app loads.
// It mounts the React app to the DOM element with id 'root'.

// Import React and ReactDOM libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the main App component (contains routing and app logic)
import App from './App.jsx';

// Import global styles for the entire app
import './index.css';

// Step 1: Get the root HTML element from index.html
// This is where React will render the application
const rootElement = document.getElementById('root');

// Step 2: Create React root and render the App component
// React.StrictMode helps identify potential problems in the app (development only)
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
