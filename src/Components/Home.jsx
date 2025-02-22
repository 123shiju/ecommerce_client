import { useEffect, useState } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/product/displayAll"
        );
        setProducts(response.data.products);
      } catch (error) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/category/GetAll"
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user?._id) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/wishlist/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedWishlist = response.data.wishlist?.products || [];
        setWishlist(fetchedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(fetchedWishlist));
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
    fetchWishlist();
  }, []);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user?._id) {
      toast.error("Please log in to add to wishlist");
      return;
    }

    try {
      const isInWishlist = wishlist.some(
        (item) => item.productId === productId
      );
      const apiUrl = isInWishlist
        ? "http://localhost:5000/api/wishlist/remove"
        : "http://localhost:5000/api/wishlist/add";

      await axios.post(
        apiUrl,
        { userId: user._id, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedWishlist = isInWishlist
        ? wishlist.filter((item) => item.productId !== productId)
        : [...wishlist, { productId }];

      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      toast.success(
        isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        { toastId: productId }
      );
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user?._id) {
      toast.error("Please log in to add to cart");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { userId: user._id, productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Added to cart", { toastId: `cart-${product._id}` });

      setCart([...cart, { ...product, quantity: 1 }]);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading)
    return <p className="text-center text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Home</h1>

        {/* Search and Category Filter */}
        <div className="mb-6 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search for a product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/2 text-gray-700 hover:outline-[#d58b0e] outline:none"
          />
          <select
            className="border p-2 rounded w-full sm:w-1/4 bg-white text-gray-700 hover:outline-[#d58b0e] focus:ring-0 focus:outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option
                key={category._id}
                value={category.categoryName}
                className="bg-[#eda415] text-white"
              >
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="border p-4 rounded relative">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleWishlist(product._id);
                  }}
                  className={`absolute top-2 right-2 text-2xl transition-colors duration-300 ${
                    wishlist.some((item) => item.productId === product._id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  ♥
                </button>
                <Link to={`/productDetails/${product._id}`}>
                  <img
                    src={`http://localhost:5000/${product.images[0]}`}
                    alt={product.title}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold text-[#205776]">
                    {product.title}
                  </h3>
                  <p className="text-[#4a4a4a] font-semibold">
                    ${product.variants[0].price}
                  </p>
                  <div className="flex items-center">
                    <span className="text-gray-400">★ ★ ★ ★ ★</span>
                    <span className="ml-2 text-gray-700">5.0</span>
                  </div>
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 w-full bg-[#eda415] text-white py-2 rounded hover:bg-[#d58b0e]  transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
