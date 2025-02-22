import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // New Category State
  const [categories, setCategories] = useState([]); // Store categories from API
  const [variants, setVariants] = useState([
    { ram: "", price: "", quantity: "" },
  ]);
  const [images, setImages] = useState([null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/category/GetAll"
        );
        setCategories(response.data.categories); // Assuming response.data is an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (variants.some((v) => !v.ram || !v.price || !v.quantity)) {
      toast.error("Please fill out all variant fields.");
      return;
    }

    if (images.some((img) => img === null)) {
      toast.error("Please upload all three images.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("variants", JSON.stringify(variants));

    images.forEach((image, index) => {
      formData.append(`image${index + 1}`, image);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/product/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Product added successfully!");
        onClose();
      }
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold text-center">Add Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4 flex flex-col">
            <label htmlFor="title" className="text-lg font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full p-2 border rounded-md"
              placeholder="Enter product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="mb-4 flex flex-col">
            <label htmlFor="category" className="text-lg font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              className="w-full p-2 border rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.categoryName} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Variants */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium mb-2">Variants</h3>
              <button
                type="button"
                onClick={() =>
                  setVariants([
                    ...variants,
                    { ram: "", price: "", quantity: "" },
                  ])
                }
                className="bg-[#3c3c3c] text-white p-2 rounded mb-2 mt-2"
              >
                Add Variant
              </button>
            </div>
            {variants.map((variant, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 items-center mb-4"
              >
                <input
                  type="text"
                  placeholder="RAM"
                  value={variant.ram}
                  onChange={(e) => {
                    const newVariants = [...variants];
                    newVariants[index].ram = e.target.value;
                    setVariants(newVariants);
                  }}
                  className="w-full sm:w-1/3 p-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => {
                    const newVariants = [...variants];
                    newVariants[index].price = e.target.value;
                    setVariants(newVariants);
                  }}
                  className="w-full sm:w-1/3 p-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={variant.quantity}
                  onChange={(e) => {
                    const newVariants = [...variants];
                    newVariants[index].quantity = e.target.value;
                    setVariants(newVariants);
                  }}
                  className="w-full sm:w-1/3 p-2 border rounded-md"
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setVariants(variants.filter((_, i) => i !== index))
                    }
                    className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="description"
              className="block text-lg font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-2 border rounded-md"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Images */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
              Upload Images (3 images)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const newImages = [...images];
                      newImages[index] = e.target.files[0];
                      setImages(newImages);
                    }}
                    className="block w-full text-sm text-gray-500"
                  />
                  {image && (
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`image-preview-${index}`}
                      className="h-20 object-cover rounded-md mt-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="hover:bg-[#eda415] hover:text-white p-2 text-black rounded bg-[#eeeeee]"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`hover:bg-[#eda415] hover:text-white p-2 text-black rounded ${
                isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-[#eeeeee]"
              }`}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
