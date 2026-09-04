import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/admin/orders/${id}`, { status: newStatus });
      fetchOrders(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  // pages/admin/AdminOrders.jsx - Add status update functionality
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const note = prompt("Add a note for this status update (optional):");
    const location = prompt("Enter location (optional):");
    
    await axiosInstance.put(
      `/orders/admin/${orderId}/status`,
      {
        status: newStatus,
        note: note || undefined,
        location: location || undefined
      }
    );
    
    toast.success(`Order status updated to ${newStatus}`);
    fetchOrders();
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to update order status");
  }
};

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">All Orders (Admin)</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">User</th>
            <th className="border px-3 py-2">Product</th>
            <th className="border px-3 py-2">Quantity</th>
            <th className="border px-3 py-2">Color</th>
            <th className="border px-3 py-2">Material</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Ordered At</th>
            <th className="border px-3 py-2">Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="text-center">
              <td className="border px-3 py-2">{order.user.name}</td>
              <td className="border px-3 py-2">{order.product.name}</td>
              <td className="border px-3 py-2">{order.quantity}</td>
              <td className="border px-3 py-2">{order.color}</td>
              <td className="border px-3 py-2">{order.material}</td>
              <td className="border px-3 py-2">{order.status}</td>
              <td className="border px-3 py-2">
                {new Date(order.createdAt).toLocaleString()}
              </td>
              <td className="border px-3 py-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
