import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { msalInstance } from "./lib/msal";
import React from "react";

// Check if this is a popup window returning from Microsoft auth
const isPopup = !!window.opener && window.opener !== window;
const hasAuthHash = window.location.hash.includes('code=') || 
                    window.location.hash.includes('id_token=') ||
                    window.location.hash.includes('access_token=');

if (isPopup && hasAuthHash) {
  // This is the popup returning from auth - show message and let MSAL handle it
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:white;text-align:center;font-family:system-ui;">
      <div>
        <div style="font-size:48px;margin-bottom:16px;">✓</div>
        <h2 style="margin:0 0 8px;">Sign-in complete!</h2>
        <p style="opacity:0.8;font-size:14px;">Closing...</p>
      </div>
    </div>
  `;
  // Initialize MSAL to process the auth response, then close
  msalInstance.initialize().then(() => {
    return msalInstance.handleRedirectPromise();
  }).finally(() => {
    setTimeout(() => window.close(), 500);
  });
} else {
  // Normal app load
  msalInstance.initialize().then(() => {
    createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }).catch(console.error);
}
