import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-server-0slo.onrender.com/api/product/productDetails/${id}`
        );
        setProduct(response.data.product);
      } catch (err) {
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleZoom = () => {
    setZoomed(!zoomed);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleRamSelect = (ram) => {
    setSelectedRam(ram);
  };

  const handleBuyNow = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      const productId = product._id;
      const price = Number(product.variants?.[0]?.price) || 0;

      if (!price || price <= 0) {
        return alert("Invalid product price");
      }

      const response = await axios.post(
        "https://ecommerce-server-0slo.onrender.com/api/cart/add",
        {
          userId,
          productId,
        }
      );

      if (response.data) {
        navigate("/checkout", { state: { cart: response.data } });
      }
    } catch (err) {
      console.error("Error buying product:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const finalPrice = product?.variants?.[0]?.price * quantity || 0;

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center p-8 space-y-8 lg:space-x-12 lg:space-y-0">
        <div className="flex flex-col space-y-4 w-full lg:w-1/2">
          <div
            className={`relative border border-gray-300 rounded-lg ${
              zoomed ? "scale-150 transition-all" : "scale-100"
            }`}
            onMouseEnter={handleZoom}
            onMouseLeave={handleZoom}
          >
            <img
              src={`https://ecommerce-server-0slo.onrender.com/${product.images[0]}`}
              alt="Main Product"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          <div className="flex space-x-4 justify-start lg:justify-center">
            {product?.images?.map((image, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-1 cursor-pointer hover:shadow-md"
              >
                <img
                  src={`https://ecommerce-server-0slo.onrender.com/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-4 w-full lg:w-1/2 p-6 border rounded-md shadow-md">
          <h2 className="text-3xl font-semibold text-center">
            {product?.title || "Product Title"}
          </h2>

          <div className="text-2xl font-medium text-gray-800 text-center">
            ${finalPrice.toFixed(2)}
          </div>

          <div
            className={`text-xl ${
              product?.variants?.reduce(
                (total, variant) => total + variant.quantity,
                0
              ) > 0
                ? "text-green-600"
                : "text-red-600"
            } text-center`}
          >
            {product?.variants?.reduce(
              (total, variant) => total + variant.quantity,
              0
            ) > 0
              ? "In Stock"
              : "Out of Stock"}
          </div>

          <div>
            <h3 className="text-xl font-medium">Description:</h3>
            <p className="text-gray-700">
              {product?.description || "No description available."}
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={decreaseQuantity}
              className="bg-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-400"
            >
              -
            </button>
            <span className="text-xl">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="bg-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-400"
            >
              +
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-center space-x-4">
            <button
              className={`px-6 py-2 rounded-lg ${
                product?.variants?.reduce(
                  (total, variant) => total + variant.quantity,
                  0
                ) > 0
                  ? "bg-[#eda415] text-white hover:bg-[#d58b0e]"
                  : "bg-[#eda415] text-white"
              }`}
              onClick={handleBuyNow}
            >
              Buy It Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
