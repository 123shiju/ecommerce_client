import React, { useState, useEffect } from "react";

import AddCategory from "./AddCategory.jsx";
import AddProduct from "./AddProduct.jsx";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showproductModal, setShowproductModal] = useState(false);
  const [categories, setCategories] = useState([]);

  const openModal = () => setShowModal(true);
  const openproductModal = () => setShowproductModal(true);
  const closeModal = () => setShowModal(false);
  const closeProductModal = () => setShowproductModal(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/product/displayAll"
        );
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        setError(err);
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

  return (
    <div>
      <div className="flex flex-col p-4">
        <div className="flex flex-col sm:flex-row justify-between mb-4 items-center">
          <div className="flex space-x-4 ml-4">
            <button
              onClick={openModal}
              className="bg-[#eda415] p-2 rounded-[14px] text-[#fff] text-sm sm:text-base"
            >
              Add Category
            </button>
            <button
              onClick={openproductModal}
              className="bg-[#eda415] p-2 rounded-[14px] text-[#fff] text-sm sm:text-base"
            >
              Add Product
            </button>
          </div>
        </div>
        <AddCategory show={showModal} onClose={closeModal} />
        <AddProduct isOpen={showproductModal} onClose={closeProductModal} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-10 w-full">
          {loading ? (
            <p>Loading products...</p>
          ) : Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-lg hover:shadow-md transition duration-300"
              >
                <img
                  src={`http://localhost:5000/${product.images[0]}`}
                  alt={product.title}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <h3 className="text-lg font-semibold text-[#205776] truncate">
                  {product.title}
                </h3>
                <p className="text-[#4a4a4a] font-semibold">
                  ${product.variants[0].price}
                </p>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
