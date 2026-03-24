import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { msalInstance } from "./lib/msal";
import React from "react";

msalInstance.initialize().then(() => {
  console.log("[MSAL] Initialized. Calling handleRedirectPromise...");
  return msalInstance.handleRedirectPromise().catch((err) => {
    console.warn("[MSAL] handleRedirectPromise error (non-fatal):", err);
    return null;
  });
}).then(async (response) => {
  console.log("[MSAL] handleRedirectPromise result:", response);

  // If returning from a Microsoft redirect, process the auth
  if (response && response.accessToken) {
    console.log("[MSAL] Got access token, calling backend...");
    try {
      const res = await fetch("http://localhost:5000/api/auth/microsoft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: response.accessToken }),
      });
      const data = await res.json();
      console.log("[MSAL] Backend response:", data);
      if (data.success && data.user) {
        localStorage.setItem("student_user", JSON.stringify(data.user));
        console.log("[MSAL] User saved. Redirecting to dashboard...");
        // Navigate to dashboard with a clean URL
        window.location.replace("/");
        return;
      } else {
        console.error("[MSAL] Backend rejected login:", data);
      }
    } catch (e) {
      console.error("[MSAL] Backend call failed:", e);
    }
  }

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(console.error);
