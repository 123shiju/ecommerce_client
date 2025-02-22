import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const OrderTrackingPage = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-server-0slo.onrender.com/api/order/history/${userId}`
        );
        setOrders(response.data.orders || []); 
      } catch (err) {
        setError("Failed to load orders.");
      }
      setLoading(false);
    };

    fetchOrders();
  }, [userId]);

  console.log("Live track response", orders);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Live Order Tracking</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="border p-4 mb-4 rounded-lg">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Placed At:</strong>{" "}
                {new Date(order.placedAt).toLocaleString()}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(order.updatedAt).toLocaleString()}
              </p>

             
              <div className="relative w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className={`h-2 rounded ${
                    order.status === "Pending"
                      ? "w-1/4 bg-yellow-500"
                      : order.status === "Processing"
                      ? "w-1/2 bg-blue-500"
                      : order.status === "Shipped"
                      ? "w-3/4 bg-orange-500"
                      : order.status === "Delivered"
                      ? "w-full bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderTrackingPage;
