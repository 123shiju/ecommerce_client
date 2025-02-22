import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import OrderSuccessModal from "./OrderSuccessModal";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const [cart, setCart] = useState({ products: [], cartTotal: 0 });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false); // Track the modal state
  const [orderId, setOrderId] = useState(null); // Store the order ID for modal

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(res.data.cart);
    } catch (err) {
      toast.error("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/order/placeOrder`,
        {
          userId,
          cart,
          paymentMethod: "Cash on Delivery", // Hardcoded to COD
        }
      );
      setOrderId(res.data.orderId); // Set the order ID
      setOrderPlaced(true); // Show the success modal
      setCart({ products: [], cartTotal: 0 });
    } catch (err) {
      toast.error("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeOrderSuccessModal = () => {
    setOrderPlaced(false); // Close the modal
    navigate(`/order/${orderId}`); // Navigate to the order status page
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Checkout</h2>
      {loading && <p className="text-blue-500 text-center">Loading...</p>}

      <div>
        <h3 className="text-xl font-semibold">Order Summary</h3>
        <table className="w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Product</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {cart.products.map((product) => (
              <tr key={product.productId} className="border-b">
                <td className="p-3 text-center">{product.name}</td>
                <td className="p-3 text-center">${product.price}</td>
                <td className="p-3 text-center">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
        <h3 className="text-xl font-semibold">Total: ${cart.cartTotal || 0}</h3>
        <button
          className={`px-6 py-2 mt-4 sm:mt-0 rounded ${
            cart.products.length > 0
              ? "bg-[#eda415] text-white hover:bg-[#d58b0e]"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
          onClick={placeOrder}
          disabled={loading || !cart.products.length}
        >
          Place Order (Cash on Delivery)
        </button>
      </div>

      {/* Modal */}
      {orderPlaced && (
        <OrderSuccessModal
          show={orderPlaced}
          onClose={closeOrderSuccessModal}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
