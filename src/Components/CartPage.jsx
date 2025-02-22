import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [cart, setCart] = useState({ products: [], cartTotal: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckoutClick = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(res.data.cart);
    } catch (err) {
      setError("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = useCallback(
    async (productId, action) => {
      try {
        const updatedCart = { ...cart };
        const productIndex = updatedCart.products.findIndex(
          (product) => product.productId === productId
        );
        if (productIndex > -1) {
          const updatedProduct = { ...updatedCart.products[productIndex] };
          if (action === "increase") {
            updatedProduct.quantity += 1;
            updatedProduct.total =
              updatedProduct.price * updatedProduct.quantity;
          } else if (action === "decrease" && updatedProduct.quantity > 1) {
            updatedProduct.quantity -= 1;
            updatedProduct.total =
              updatedProduct.price * updatedProduct.quantity;
          }
          updatedCart.products[productIndex] = updatedProduct;
          updatedCart.cartTotal = updatedCart.products.reduce(
            (acc, product) => acc + product.total,
            0
          );
          setCart(updatedCart); // Update the cart state locally
        }

        await axios.post(`http://localhost:5000/api/cart/update`, {
          userId,
          productId,
          action,
        });
      } catch (err) {
        toast.error("Could not update quantity. Try again.");
      }
    },
    [cart, userId]
  );

  const removeItem = useCallback(
    async (productId) => {
      try {
        const updatedCart = { ...cart };
        updatedCart.products = updatedCart.products.filter(
          (product) => product.productId !== productId
        );
        updatedCart.cartTotal = updatedCart.products.reduce(
          (acc, product) => acc + product.total,
          0
        );
        setCart(updatedCart); // Update the cart state locally

        await axios.post(`http://localhost:5000/api/cart/remove`, {
          userId,
          productId,
        });

        toast.success("Item removed from cart.");
      } catch (err) {
        toast.error("Failed to remove item. Try again.");
      }
    },
    [cart, userId]
  );

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Shopping Cart
        </h2>
        {loading && <p className="text-blue-500 text-center">Loading...</p>}

        {cart.products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">Image</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Total</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map((product) => (
                  <tr key={product.productId} className="border-b">
                    <td className="p-3 text-center">{product.name}</td>
                    <td className="p-3 text-center">
                      <img
                        src={`/uploads/${product.image.split("\\").pop()}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded mx-auto"
                        loading="lazy"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        className="px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        onClick={() =>
                          updateQuantity(product.productId, "decrease")
                        }
                        disabled={loading}
                      >
                        -
                      </button>
                      <span className="mx-3 text-lg">{product.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        onClick={() =>
                          updateQuantity(product.productId, "increase")
                        }
                        disabled={loading}
                      >
                        +
                      </button>
                    </td>
                    <td className="p-3 text-center">${product.price}</td>
                    <td className="p-3 text-center">${product.total}</td>
                    <td className="p-3 text-center">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => removeItem(product.productId)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <p className="text-gray-600 text-center">Your cart is empty.</p>
          )
        )}

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <h3 className="text-xl font-semibold">
            Total: ${cart.cartTotal || 0}
          </h3>
          <button
            className={`w-full sm:w-auto px-6 py-2 mt-4 sm:mt-0 rounded ${
              cart.products.length > 0
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            onClick={handleCheckoutClick} // Handle button click
            disabled={!cart.products.length} // Disable if cart is empty
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartPage;
