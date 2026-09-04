import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ArrowLeft,
  RefreshCw,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Weight,
  FileText,
  Camera,
  Calendar,
  Award,
  Gift,
  Hash,
  Tag,
  Info
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const statusOptions = [
  "received",
  "sorting",
  "cleaning",
  "shredding",
  "extrusion",
  "testing",
  "printing",
  "finishing",
  "packaging",
  "completed",
  "rejected"
];

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

const statusLabels = {
  received: "Received",
  sorting: "Sorting",
  cleaning: "Cleaning & Drying",
  shredding: "Plastic Shredding",
  extrusion: "Filament Extrusion",
  testing: "Quality Testing",
  printing: "3D Printing",
  finishing: "Product Finishing",
  packaging: "Eco-Friendly Packaging",
  completed: "Completed",
  rejected: "Rejected"
};

export default function AdminRecycling() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRequest, setDetailRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/recycling/all");
      setRequests(res.data.requests);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      toast.error("Failed to load recycling requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      await axiosInstance.put(`/recycling/${id}/status`, { status: newStatus });
      toast.success(`Status updated to ${statusLabels[newStatus]}`);
      fetchRequests();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
      setSelectedRequest(null);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === "all" || req.status === filter;
    const matchesSearch = 
      req.recyclingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.categoryLabel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.contactPhone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateFull = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openDetailModal = (request) => {
    setDetailRequest(request);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setDetailRequest(null);
  };

  // Detail Modal Component
  const DetailModal = ({ request, onClose }) => {
    if (!request) return null;

    const categoryIcons = {
      "3d_filament": "🎯",
      "broken_toys": "🧸",
      "plastic_waste": "♻️",
      "pet_bottles": "💧"
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{categoryIcons[request.category] || "♻️"}</span>
                <div>
                  <h2 className="text-xl font-bold">{request.categoryLabel}</h2>
                  <p className="text-green-50 text-sm">Recycling Request Details</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Badge & ID */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Recycling ID</p>
                  <p className="font-mono font-bold text-gray-900">{request.recyclingId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
                  {statusLabels[request.status] || request.status}
                </span>
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Waste Details */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-3">
                    <Weight className="w-4 h-4" />
                    Waste Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium text-gray-900">{request.wasteWeight} {request.weightUnit}</span>
                    </div>
                    {request.description && (
                      <div>
                        <span className="text-gray-600">Description:</span>
                        <p className="text-gray-900 mt-1 bg-white p-2 rounded-lg">{request.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-3">
                    <User className="w-4 h-4" />
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-gray-900">{request.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      <a href={`mailto:${request.contactEmail}`} className="text-blue-600 hover:underline">
                        {request.contactEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-500" />
                      <a href={`tel:${request.contactPhone}`} className="text-blue-600 hover:underline">
                        {request.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                {request.user && (
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-indigo-800 flex items-center gap-2 mb-3">
                      <Info className="w-4 h-4" />
                      User Account
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Name:</span> {request.user.name}</p>
                      <p><span className="text-gray-600">Email:</span> {request.user.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Shipping Address */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-green-800 flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </h3>
                  <div className="text-sm text-gray-900 space-y-1">
                    <p>{request.address.street}</p>
                    <p>{request.address.city}, {request.address.state}</p>
                    <p>{request.address.zipCode}</p>
                    <p>{request.address.country}</p>
                  </div>
                </div>

                {/* Photos */}
                {request.photos && request.photos.length > 0 && (
                  <div className="bg-orange-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-orange-800 flex items-center gap-2 mb-3">
                      <Camera className="w-4 h-4" />
                      Photos ({request.photos.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {request.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Waste photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                          onClick={() => window.open(photo, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4" />
                    Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted:</span>
                      <span className="text-gray-900">{formatDateFull(request.createdAt)}</span>
                    </div>
                    {request.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-gray-900">{formatDateFull(request.updatedAt)}</span>
                      </div>
                    )}
                    {request.estimatedCompletion && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Completion:</span>
                        <span className="text-gray-900">{formatDateFull(request.estimatedCompletion)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rewards */}
                {(request.rewardPoints > 0 || request.discountCoupon) && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                    <h3 className="text-sm font-semibold text-yellow-800 flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4" />
                      Rewards
                    </h3>
                    <div className="space-y-2 text-sm">
                      {request.rewardPoints > 0 && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-600" />
                          <span className="text-yellow-800 font-medium">{request.rewardPoints} Reward Points</span>
                        </div>
                      )}
                      {request.discountCoupon && (
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-800">
                            Coupon: <strong>{request.discountCoupon.code}</strong> 
                            ({request.discountCoupon.discount}% off)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tracking */}
                {request.trackingNumber && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-2">
                      <Truck className="w-4 h-4" />
                      Tracking
                    </h3>
                    <p className="text-sm text-blue-800 font-mono">{request.trackingNumber}</p>
                  </div>
                )}

                {/* Notes */}
                {request.notes && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4" />
                      Additional Notes
                    </h3>
                    <p className="text-sm text-gray-700">{request.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Update Section in Modal */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Update Status
              </h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      updateStatus(request._id, status);
                      if (status === request.status) {
                        // If same status, just close modal
                        onClose();
                      }
                    }}
                    disabled={updating}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      status === request.status
                        ? "bg-green-500 text-white cursor-default"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recycling Requests</h1>
            <p className="text-gray-600">Manage all recycling submissions</p>
          </div>
          <button
            onClick={fetchRequests}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", ...statusOptions].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  filter === status
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "All" : statusLabels[status] || status}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Requests Found</h3>
            <p className="text-gray-500">
              {requests.length === 0 
                ? "No recycling requests have been submitted yet."
                : `No ${filter} requests found.`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {request.category === "3d_filament" && "🎯"}
                        {request.category === "broken_toys" && "🧸"}
                        {request.category === "plastic_waste" && "♻️"}
                        {request.category === "pet_bottles" && "💧"}
                      </span>
                      <h3 className="font-semibold text-gray-900">{request.categoryLabel}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                        {statusLabels[request.status] || request.status}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">ID:</span> {request.recyclingId}
                      </div>
                      <div>
                        <span className="font-medium">Weight:</span> {request.wasteWeight} {request.weightUnit}
                      </div>
                      <div>
                        <span className="font-medium">From:</span> {request.contactName}
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span> {formatDate(request.createdAt)}
                      </div>
                    </div>

                    {request.user && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">User:</span> {request.user.email}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDetailModal(request)}
                      className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition flex items-center gap-1"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="text-xs font-medium">View All</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && detailRequest && (
          <DetailModal request={detailRequest} onClose={closeDetailModal} />
        )}
      </AnimatePresence>
    </div>
  );
}