import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`https://ecommerce-server-0slo.onrender.com/api/order/${orderId}`)
      .then((response) => {
        console.log("Fetched Order:", response.data);
        setOrder(response.data.order); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setError("Failed to load order details.");
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <p>
        <strong>Order ID:</strong> {order._id}
      </p>
      <p>
        <strong>Total Amount:</strong> ${order.totalAmount}
      </p>
      <p>
        <strong>Payment Method:</strong> {order.paymentMethod}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>

      <h3 className="text-xl font-bold mt-4">Products</h3>
      {order.products && order.products.length > 0 ? (
        <ul className="list-disc ml-5">
          {order.products.map((product, index) => (
            <li key={index}>
              <p>
                <strong>Product Name:</strong>{" "}
                {product.productId?.title || "Unnamed Product"}
              </p>
              <p>
                <strong>Price:</strong> $
                {product.productId?.variants?.[0]?.price || product.price}
              </p>
              <p>
                <strong>Quantity:</strong> {product.quantity}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {product.productId?.category || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {product.productId?.description || "No description available"}
              </p>
              <div className="flex space-x-2 mt-2">
                {product.productId?.images?.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={`https://ecommerce-server-0slo.onrender.com/${image}`} 
                    alt={product.productId?.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found in this order.</p>
      )}
    </div>
  );
};

export default OrderDetails;
