import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartWishlistContext = createContext();

export const CartWishlistProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user?._id) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/wishlist/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedWishlist = response.data.wishlist?.products || [];
      setWishlist(fetchedWishlist);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user?._id) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/cart/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const totalQuantity = response.data.cart?.products?.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
    fetchCart();
  }, []);

  return (
    <CartWishlistContext.Provider
      value={{
        cartCount,
        setCartCount,
        wishlist,
        setWishlist,
        fetchCart,
        fetchWishlist,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};
