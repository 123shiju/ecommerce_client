import React from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const OrderSuccessModal = ({ show, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="flex items-center justify-center fixed inset-0 z-50 bg-gray-900 bg-opacity-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto w-full sm:w-auto">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Order Placed Successfully!
        </h2>
        <p className="mt-2 text-gray-600 text-center">
          Your order has been placed successfully. You can now:
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-[#eda415] text-white rounded hover:bg-[#d58b0e] transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate(`/order/tracking/${user._id}`)}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Check Order Status
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderSuccessModal;
