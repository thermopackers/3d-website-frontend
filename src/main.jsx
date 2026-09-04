import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext.jsx";
import './index.css'; // ← Import your global CSS here

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // from .env

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
            <CartProvider>
      <App />
            </CartProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
