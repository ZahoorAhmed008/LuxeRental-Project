import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Providers
import { WishlistProvider } from "./context/WishlistContext";
import { ProductProvider } from "./context/ProductContext"; // 👈 Add this

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WishlistProvider>
      <ProductProvider> {/* 👈 Wrap App with ProductProvider */}
        <App />
      </ProductProvider>
    </WishlistProvider>
  </StrictMode>
);
