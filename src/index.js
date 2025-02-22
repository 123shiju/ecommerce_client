import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { CartWishlistProvider } from "./Components/Context/CartWishlistContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CartWishlistProvider>
    <App />
  </CartWishlistProvider>
);
