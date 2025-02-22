import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Retrieve user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/order/history/${userId}`)
        .then((response) => {
          console.log("Fetched orders:", response.data);
          setOrders(response.data.orders || response.data); // Ensure correct structure
        })
        .catch((error) =>
          console.error("Error fetching order history:", error)
        );
    }
  }, [userId]);

  console.log("orders", orders);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      {orders.length > 0 ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow-md">
              <h3 className="font-semibold">Order ID: {order._id}</h3>
              <p>Total: ${order.totalAmount}</p>
              <p>
                Status:{" "}
                <span className="font-bold text-gray-600">
                  {order.status ? order.status : "Pending"}
                </span>
              </p>

              <button
                onClick={() => navigate(`/order/${order._id}`)}
                className="mt-2 px-4 py-2 bg-[#eda415] hover:bg-[#d58b0e] text-white rounded "
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No order history available.</p>
      )}
    </div>
  );
};

export default OrderHistory;
