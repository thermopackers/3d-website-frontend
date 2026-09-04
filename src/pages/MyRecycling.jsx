import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Eye,
  ArrowLeft,
  Filter,
  Search
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const statusColors = {
  received: "bg-green-100 text-green-800",
  sorting: "bg-blue-100 text-blue-800",
  cleaning: "bg-cyan-100 text-cyan-800",
  shredding: "bg-purple-100 text-purple-800",
  extrusion: "bg-indigo-100 text-indigo-800",
  testing: "bg-orange-100 text-orange-800",
  printing: "bg-pink-100 text-pink-800",
  finishing: "bg-teal-100 text-teal-800",
  packaging: "bg-emerald-100 text-emerald-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
};

const statusIcons = {
  received: CheckCircle,
  sorting: Clock,
  cleaning: Clock,
  shredding: Clock,
  extrusion: Clock,
  testing: Clock,
  printing: Clock,
  finishing: Clock,
  packaging: Package,
  completed: CheckCircle,
  rejected: XCircle
};

export default function MyRecycling() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  useEffect(() => {
    fetchRequests();
  }, []);

      // ✅ SCROLL TO TOP ON PAGE MOUNT
    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, []);
  
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/recycling/my-requests");
      setRequests(res.data.requests);
    } catch (err) {
      console.error("Failed to fetch recycling requests:", err);
      toast.error("Failed to load recycling requests");
    } finally {
      setLoading(false);
    }
  };
  
  const filteredRequests = filter === "all" 
    ? requests 
    : requests.filter(r => r.status === filter);
  
  const getStatusBadge = (status) => {
    const Icon = statusIcons[status] || Clock;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[status]}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Recycling Requests</h1>
          <button
            onClick={() => navigate("/recycling")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            New Request
          </button>
        </div>
        
        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "received", "sorting", "cleaning", "shredding", "extrusion", "testing", "printing", "finishing", "packaging", "completed", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  filter === status
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recycling Requests Found</h3>
            <p className="text-gray-500 mb-4">
              {requests.length === 0 
                ? "You haven't submitted any recycling requests yet."
                : `No ${filter} requests found.`}
            </p>
            <button
              onClick={() => navigate("/recycling")}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Submit Your First Request
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {request.category === "3d_filament" && "🎯"}
                        {request.category === "broken_toys" && "🧸"}
                        {request.category === "plastic_waste" && "♻️"}
                        {request.category === "pet_bottles" && "💧"}
                      </span>
                      <h3 className="font-semibold text-gray-900">{request.categoryLabel}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Recycling ID:</span> {request.recyclingId}
                      </div>
                      <div>
                        <span className="font-medium">Weight:</span> {request.wasteWeight} {request.weightUnit}
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span> {formatDate(request.createdAt)}
                      </div>
                    </div>
                    
                    {request.rewardPoints > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        {request.rewardPoints} Reward Points Earned
                      </div>
                    )}
                    
                    {request.discountCoupon && (
                      <div className="mt-2 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-flex items-center gap-1">
                        <span className="font-bold">🎫</span>
                        Coupon: {request.discountCoupon.code} ({request.discountCoupon.discount}% off)
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => navigate(`/recycling/${request._id}`)}
                    className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}