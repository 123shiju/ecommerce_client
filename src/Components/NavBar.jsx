import React, { useState, useContext } from "react";
import { FaHeart, FaShoppingCart, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CartWishlistContext } from "./Context/CartWishlistContext";
import axios from "axios";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const { cartCount, wishlist, fetchWishlist } =
    useContext(CartWishlistContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const handleWishlistClick = async () => {
    setWishlistOpen(true);
    await fetchWishlist();
  };

  const handleCloseWishlist = () => {
    setWishlistOpen(false);
  };

  const handleRemoveWishlistItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token || !user?._id) return;

    try {
      await axios.post(
        `https://ecommerce-server-0slo.onrender.com/api/wishlist/remove`,
        { userId: user._id, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWishlist();
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/signin");
  };

  return (
    <nav className="bg-[#003f62] p-4 flex justify-between items-center">
      <div className="text-white text-2xl"></div>

      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="text-white px-4 py-2 rounded hover:bg-[#d58b0e] transition"
        >
          Home
        </Link>

        {isLoggedIn && (
          <>
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={handleWishlistClick}
            >
              <FaHeart className="text-white" />
              <span className="bg-[#eda415] text-white text-md rounded-full h-5 w-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            </div>

            <div
              className="flex items-center space-x-8 cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <div className="relative">
                <FaShoppingCart className="text-white" />
                <span className="absolute top-0 left-6 text-xs text-white bg-[#eda415] rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="text-white">Cart</span>
            </div>
          </>
        )}

        {isLoggedIn ? (
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span className="text-white px-4 py-2 rounded cursor-pointer">
              {user.name}
            </span>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
                <button
                  onClick={() => navigate("/order-history")}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-[#d58b0e]  hover:text-white transition duration-200"
                >
                  Order History
                </button>
                <button
                  onClick={() => navigate(`/order/tracking/${user._id}`)}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-[#d58b0e]  hover:text-white transition duration-200"
                >
                  Track Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-[#d58b0e]  hover:text-white transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/signin"
            className="text-white px-4 py-2 rounded hover:bg-[#d58b0e] transition"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Wishlist Sliding Page */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform transition-transform ${
          wishlistOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Wishlist</h2>
          <FaTimes
            className="cursor-pointer text-xl"
            onClick={handleCloseWishlist}
          />
        </div>

        <div className="p-4 space-y-4">
          {wishlist.length === 0 ? (
            <p className="text-gray-500">No products in wishlist</p>
          ) : (
            wishlist.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border p-2 rounded-md"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <p className="text-sm">{item.title}</p>
                </div>
                <FaTimes
                  className="cursor-pointer text-red-500"
                  onClick={() => handleRemoveWishlistItem(item._id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
