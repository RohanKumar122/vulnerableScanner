import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client'
import "./index.css";
import App from "./App";

// Get the root element
const rootElement = document.getElementById("root");

// Check if the element exists
if (rootElement) {
  // Use the new createRoot method for React 18
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
