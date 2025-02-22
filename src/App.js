import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./Components/AuthPage";
import Home from "./Components/Home";
import AdminPage from "./Components/AdminPage";
import ProductDetailsPage from "./Components/ProductDetail";
import CartPage from "./Components/CartPage";
import CheckoutPage from "./Components/CheckoutPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/NavBar";
import OrderDetails from "./Components/OrderDetails";
import OrderHistory from "./Components/OrderHistory";
import OrderTracking from "./Components/OrderTracking";

function App() {
  return (
    <Router>
      <ToastContainer autoClose={2000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/Admin" element={<AdminPage />} />
        <Route path="/productDetails/:id" element={<ProductDetailsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        <Route path="/order/tracking/:userId" element={<OrderTracking />} />
      </Routes>
    </Router>
  );
}

export default App;
