import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * Entry point of the React application.
 * 
 * This script initializes the root of the React component tree and renders the
 * App component wrapped in React.StrictMode to the DOM element with id 'root'.
 * 
 * React.StrictMode is a tool for highlighting potential problems in an application.
 * It activates additional checks and warnings for its descendants.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

