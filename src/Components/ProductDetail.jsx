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
          `http://localhost:5000/api/product/productDetails/${id}`
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

      const productId = product._id; // The product ID being purchased
      const price = Number(product.variants?.[0]?.price) || 0;

      if (!price || price <= 0) {
        return alert("Invalid product price");
      }

      // Make the API call to add the product to the cart
      const response = await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        productId,
      });

      // Redirect to the checkout page after adding the product to the cart
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
        {/* Left Section: Images */}
        <div className="flex flex-col space-y-4 w-full lg:w-1/2">
          {/* Main Image */}
          <div
            className={`relative border border-gray-300 rounded-lg ${
              zoomed ? "scale-150 transition-all" : "scale-100"
            }`}
            onMouseEnter={handleZoom}
            onMouseLeave={handleZoom}
          >
            <img
              src={`http://localhost:5000/${product?.images[0]}`}
              alt="Main Product"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-4 justify-start lg:justify-center">
            {product?.images?.map((image, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-1 cursor-pointer hover:shadow-md"
              >
                <img
                  src={`http://localhost:5000/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="flex flex-col space-y-4 w-full lg:w-1/2 p-6 border rounded-md shadow-md">
          {/* Product Title */}
          <h2 className="text-3xl font-semibold text-center">
            {product?.title || "Product Title"}
          </h2>

          {/* Product Price */}
          <div className="text-2xl font-medium text-gray-800 text-center">
            ${finalPrice.toFixed(2)}
          </div>

          {/* Availability */}
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

          {/* Product Variants */}
          {product?.variants?.length > 0 && (
            <div>
              <div className="flex space-x-4 mt-2 justify-center">
                <h3 className="text-xl font-medium">Ram:</h3>
                {product.variants.map((variant, index) => (
                  <div
                    key={index}
                    className={`w-10 h-6 flex items-center justify-center border cursor-pointer ${
                      selectedRam === variant.ram
                        ? "bg-[#eeeeee] text-black border-gray-600"
                        : "bg-gray-200 text-black-800 border-gray-300"
                    } hover:bg-gray-300`}
                    onClick={() => handleRamSelect(variant.ram)}
                  >
                    {variant.ram}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Description */}
          <div>
            <h3 className="text-xl font-medium">Description:</h3>
            <p className="text-gray-700">
              {product?.description || "No description available."}
            </p>
          </div>

          {/* Quantity Control */}
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
