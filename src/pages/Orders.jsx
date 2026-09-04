import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  Eye,
  ShoppingBag,
  ArrowLeft,
  Search,
  RefreshCw,
  Printer
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import OrderTracking from "../components/OrderTracking";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/orders");
      
      // ✅ FIX: Check if response is an array, if not, convert to array
      let ordersData = res.data;
      
      // If response is an object with orders property, extract it
      if (ordersData && typeof ordersData === 'object' && !Array.isArray(ordersData)) {
        ordersData = ordersData.orders || ordersData.data || ordersData;
      }
      
      // Ensure it's an array
      if (!Array.isArray(ordersData)) {
        ordersData = [];
      }
      
      setOrders(ordersData);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'Pending': { 
        icon: <Clock className="w-4 h-4" />, 
        color: 'bg-yellow-100 text-yellow-800',
        progress: '25%'
      },
      'Processing': { 
        icon: <RefreshCw className="w-4 h-4 animate-spin" />, 
        color: 'bg-blue-100 text-blue-800',
        progress: '50%'
      },
      'Shipped': { 
        icon: <Truck className="w-4 h-4" />, 
        color: 'bg-purple-100 text-purple-800',
        progress: '75%'
      },
      'Out for Delivery': { 
        icon: <Truck className="w-4 h-4" />, 
        color: 'bg-orange-100 text-orange-800',
        progress: '90%'
      },
      'Delivered': { 
        icon: <CheckCircle className="w-4 h-4" />, 
        color: 'bg-green-100 text-green-800',
        progress: '100%'
      },
      'Cancelled': { 
        icon: <XCircle className="w-4 h-4" />, 
        color: 'bg-red-100 text-red-800',
        progress: '0%'
      },
      'Paid': { 
        icon: <CheckCircle className="w-4 h-4" />, 
        color: 'bg-green-100 text-green-800',
        progress: '25%'
      }
    };
    return configs[status] || { 
      icon: <Package className="w-4 h-4" />, 
      color: 'bg-gray-100 text-gray-800',
      progress: '0%'
    };
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ FIX: Use optional chaining and ensure orders is an array
  const filteredOrders = (Array.isArray(orders) ? orders : []).filter(order => {
    const matchesSearch = 
      order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch(sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "status":
        return a.status?.localeCompare(b.status);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              My Orders
            </h1>
            <p className="text-gray-500 mt-1">
              {Array.isArray(orders) ? orders.length : 0} {orders.length === 1 ? 'order' : 'orders'} placed
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by product name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Paid">Paid</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-gray-300 text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You haven't placed any orders yet. Start shopping to see your orders here."}
            </p>
            {(searchTerm || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Clear Filters
              </button>
            )}
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={() => navigate("/products")}
                className="mt-4 px-6 py-2 bg-black hover:bg-white hover:text-black cursor-pointer hover:border text-white rounded-lg transition flex items-center gap-2 mx-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order #{order._id?.slice(-6).toUpperCase()}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {order.product?.images?.[0] ? (
                          <img
                            src={order.product.images[0]}
                            alt={order.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {order.product?.name || 'Product'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Qty: {order.quantity}
                        </p>
                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                          <span>{order.color || 'Default'}</span>
                          <span>•</span>
                          <span>{order.material || 'PLA'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        ₹{order.amount || (order.product?.price * order.quantity || 0).toFixed(2)}
                      </div>
                    </div>

                    {order.status !== 'Cancelled' && (
                      <div className="mt-3">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                            style={{ width: statusConfig.progress }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Order Detail Modal */}
        <AnimatePresence>
          {showOrderModal && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowOrderModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                      <p className="text-sm text-gray-500">Order #{selectedOrder._id}</p>
                    </div>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <XCircle className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* ✅ Order Tracking Component */}
                    <OrderTracking order={selectedOrder} />

                    {/* Product Details */}
                    <div className="border border-gray-100 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {selectedOrder.product?.images?.[0] ? (
                            <img
                              src={selectedOrder.product.images[0]}
                              alt={selectedOrder.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{selectedOrder.product?.name}</h4>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-gray-500">Quantity:</span>
                              <span className="ml-2 font-medium">{selectedOrder.quantity}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Color:</span>
                              <span className="ml-2 font-medium">{selectedOrder.color || 'Default'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Material:</span>
                              <span className="ml-2 font-medium">{selectedOrder.material || 'PLA'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <span className="ml-2 font-medium">₹{selectedOrder.product?.price || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border border-gray-100 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="text-gray-900">₹{selectedOrder.amount || (selectedOrder.product?.price * selectedOrder.quantity || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipping</span>
                          <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tax</span>
                          <span className="text-gray-900">₹{((selectedOrder.amount || 0) * 0.18).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-blue-600">₹{selectedOrder.amount || (selectedOrder.product?.price * selectedOrder.quantity || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowOrderModal(false);
                          navigate(`/products/${selectedOrder.product?._id}`);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        View Product
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}