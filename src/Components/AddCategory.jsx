import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategory = ({ show, onClose }) => {
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async () => {
    if (!categoryName) {
      toast.error("Category name is required!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://ecommerce-server-0slo.onrender.com/api/category/Addcategories",
        { categoryName: categoryName }
      );

      if (response.status === 201) {
        toast.success("Category added successfully!");
        setCategoryName(""); 
        onClose(); 
      }
    } catch (error) {
      toast.error("Failed to add category. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setCategoryName(""); 
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full sm:w-1/3 md:w-1/4 lg:w-1/4 xl:w-1/4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Category</h2>
          <button
            onClick={onClose}
            className="text-gray-500 font-semibold text-xl"
          >
            X
          </button>
        </div>
        <div className="mt-4">
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={handleAddCategory}
            disabled={isSubmitting}
            className="bg-[#eda415] text-white px-4 py-2 rounded-[14px] hover:bg-[#e88a10] disabled:bg-gray-400"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
          <button
            onClick={handleDiscard}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-[14px] hover:bg-gray-400"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
