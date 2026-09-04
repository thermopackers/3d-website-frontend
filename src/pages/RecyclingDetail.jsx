import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Weight,
  FileText,
  Camera,
  Award,
  Gift,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Building,
  ExternalLink,
  Info,
  AlertCircle,
  ClipboardList,
  Box,
  Send,
  Star
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

export default function RecyclingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchRequest();
  }, [id]);
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  const fetchRequest = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/recycling/my-requests/${id}`);
      setRequest(res.data.request);
    } catch (err) {
      console.error("Failed to fetch request:", err);
      toast.error("Failed to load recycling request");
      navigate("/my-recycling");
    } finally {
      setLoading(false);
    }
  };
  
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
  
  const getStatusBadge = (status) => {
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get shipping partner details
  const getShippingPartnerName = (partnerId) => {
    const partners = {
      'dhl': 'DHL Express',
      'fedex': 'FedEx',
      'bluedart': 'Blue Dart',
      'delhivery': 'Delhivery',
      'dtc': 'DTC (Direct to Customer)',
      'other': 'Other Courier'
    };
    return partners[partnerId] || partnerId || 'Not specified';
  };

  // Get shipping partner color
  const getShippingPartnerColor = (partnerId) => {
    const colors = {
      'dhl': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'fedex': 'bg-purple-100 text-purple-800 border-purple-200',
      'bluedart': 'bg-blue-100 text-blue-800 border-blue-200',
      'delhivery': 'bg-orange-100 text-orange-800 border-orange-200',
      'dtc': 'bg-green-100 text-green-800 border-green-200',
      'other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[partnerId] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get shipping method display
  const getShippingMethodDisplay = () => {
    if (!request) return null;
    
    if (request.shippingMethod === 'pickup') {
      return {
        icon: <Truck className="w-5 h-5" />,
        title: 'Pickup Request',
        color: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-700'
      };
    } else {
      return {
        icon: <Building className="w-5 h-5" />,
        title: 'Self Ship to Kind Earth',
        color: 'bg-purple-50 border-purple-200',
        textColor: 'text-purple-700'
      };
    }
  };

  // Send Instructions
  const sendInstructions = [
    {
      step: 1,
      icon: <Box className="w-5 h-5" />,
      title: "Pack Your Waste",
      details: [
        "Use sturdy cardboard boxes or strong plastic bags",
        "Separate different types of plastic waste",
        "Remove labels and caps if possible",
        "Ensure materials are dry before packing",
        "Seal the package properly"
      ]
    },
    {
      step: 2,
      icon: <ClipboardList className="w-5 h-5" />,
      title: "Label Your Package",
      details: [
        `Write your Recycling ID: ${request?.recyclingId || 'N/A'}`,
        "Add 'Recycling - Kind Earth' on the package",
        "Include your contact name and phone number",
        "Mark as 'Fragile' if needed"
      ]
    },
    {
      step: 3,
      icon: <Send className="w-5 h-5" />,
      title: "Send It to Us",
      details: request?.shippingMethod === 'pickup' 
        ? [
            "Your package will be picked up from your address",
            "Keep your phone handy for pickup coordination",
            "We'll send you tracking details once picked up"
          ]
        : [
            "Ship to our recycling center address",
            "Use any courier service of your choice",
            "Keep the tracking number for reference",
            "Send us the tracking number if possible"
          ]
    },
    {
      step: 4,
      icon: <Award className="w-5 h-5" />,
      title: "Track & Earn Rewards",
      details: [
        "We'll process your request within 7-10 days",
        "You'll receive reward points and coupons",
        "Track your recycling journey in real-time",
        "Help us create a sustainable future! 🌍"
      ]
    }
  ];
  
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
  
  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Request not found</p>
      </div>
    );
  }
  
  const shippingMethod = getShippingMethodDisplay();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/my-recycling")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Requests
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Recycling Request</h1>
                <p className="text-green-50">ID: {request.recyclingId}</p>
              </div>
              {getStatusBadge(request.status)}
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Category */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {request.category === "3d_filament" && "🎯"}
                  {request.category === "broken_toys" && "🧸"}
                  {request.category === "plastic_waste" && "♻️"}
                  {request.category === "pet_bottles" && "💧"}
                </span>
                <p className="text-lg font-semibold text-gray-900">{request.categoryLabel}</p>
              </div>
            </div>
            
            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Waste Details
                </h3>
                <p className="text-gray-900">
                  {request.wasteWeight} {request.weightUnit}
                </p>
                {request.description && (
                  <p className="text-sm text-gray-600 mt-2">{request.description}</p>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Timeline
                </h3>
                <p className="text-gray-900">Submitted: {formatDate(request.createdAt)}</p>
                {request.estimatedCompletion && (
                  <p className="text-sm text-gray-600 mt-1">
                    Est. Completion: {formatDate(request.estimatedCompletion)}
                  </p>
                )}
              </div>
            </div>
            
            {/* ============ SHIPPING METHOD SECTION ============ */}
            <div className="rounded-xl p-4 border-2" style={{
              backgroundColor: shippingMethod?.color?.includes('blue') ? '#eff6ff' : '#f5f3ff',
              borderColor: shippingMethod?.color?.includes('blue') ? '#bfdbfe' : '#ddd6fe'
            }}>
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Shipping Method
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    request.shippingMethod === 'pickup' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {shippingMethod?.icon}
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      request.shippingMethod === 'pickup' ? 'text-blue-700' : 'text-purple-700'
                    }`}>
                      {shippingMethod?.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.shippingMethod === 'pickup' 
                        ? 'We will arrange pickup from your address' 
                        : 'Ship to our recycling center'}
                    </p>
                  </div>
                </div>
                
                {request.shippingMethod === 'pickup' && request.shippingPartner && (
                  <div className="sm:ml-auto">
                    <div className={`px-4 py-2 rounded-lg border inline-flex items-center gap-2 ${getShippingPartnerColor(request.shippingPartner)}`}>
                      <Truck className="w-4 h-4" />
                      <span className="font-medium">
                        {request.shippingPartnerName || getShippingPartnerName(request.shippingPartner)}
                      </span>
                    </div>
                    {request.trackingNumber && (
                      <div className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                        <span>Tracking: {request.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {request.shippingMethod === 'self_ship' && (
                  <div className="sm:ml-auto">
                    <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      📦 Ship on your own
                    </span>
                  </div>
                )}
              </div>
              
              {/* Shipping Address for Self Ship */}
              {request.shippingMethod === 'self_ship' && request.shippingAddress && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">📬 Kind Earth Address</p>
                  <p className="text-sm text-gray-700">
                    {request.shippingAddress.street}, {request.shippingAddress.city},<br />
                    {request.shippingAddress.state} - {request.shippingAddress.zipCode},<br />
                    {request.shippingAddress.country}
                  </p>
                </div>
              )}
            </div>

            {/* ============ HOW TO SEND SECTION - ALWAYS VISIBLE ============ */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  📋 How to Send Your Waste
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sendInstructions.map((instruction, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {instruction.step}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">{instruction.icon}</span>
                          <h4 className="font-semibold text-gray-900">{instruction.title}</h4>
                        </div>
                      </div>
                      <ul className="space-y-1.5 ml-11">
                        {instruction.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Pro Tips */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4" />
                    Pro Tips
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 💡 Clean your recyclables before packing - it helps in the recycling process</li>
                    <li>• 📦 Use eco-friendly packaging materials when possible</li>
                    <li>• 📸 Take photos of your packed items before shipping</li>
                    <li>• 📋 Keep a copy of your Recycling ID and tracking number</li>
                    {request.shippingMethod === 'pickup' && (
                      <li>• 📞 Be available for pickup coordination calls</li>
                    )}
                    {request.shippingMethod === 'self_ship' && (
                      <li>• ✉️ Send us your tracking number after shipping</li>
                    )}
                  </ul>
                </div>
                
                {/* Important Note */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span><strong>Important:</strong> Please ensure your package is properly sealed and labeled with your Recycling ID to avoid any delays in processing.</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {request.contactName}</p>
                <p><span className="font-medium">Email:</span> {request.contactEmail}</p>
                <p><span className="font-medium">Phone:</span> {request.contactPhone}</p>
              </div>
            </div>
            
            {/* Address */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pickup/Shipping Address
              </h3>
              <div className="text-sm text-gray-900">
                <p>{request.address.street}</p>
                <p>{request.address.city}, {request.address.state} - {request.address.zipCode}</p>
                <p>{request.address.country}</p>
              </div>
            </div>
            
            {/* Photos */}
            {request.photos && request.photos.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Photos ({request.photos.length})
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {request.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Waste photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Rewards */}
            {(request.rewardPoints > 0 || request.discountCoupon) && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Rewards
                </h3>
                <div className="space-y-2">
                  {request.rewardPoints > 0 && (
                    <p className="text-sm text-yellow-800">
                      🎯 {request.rewardPoints} Reward Points Earned
                    </p>
                  )}
                  {request.discountCoupon && (
                    <p className="text-sm text-yellow-800">
                      🎫 Coupon: <span className="font-bold">{request.discountCoupon.code}</span> 
                      ({request.discountCoupon.discount}% off, valid until {formatDate(request.discountCoupon.validUntil)})
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Tracking */}
            {request.trackingNumber && request.shippingMethod !== 'self_ship' && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Tracking Information
                </h3>
                <p className="text-sm text-blue-800">Tracking Number: {request.trackingNumber}</p>
                <button
                  onClick={() => window.open(`https://www.google.com/search?q=${request.trackingNumber}`, '_blank')}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Track Order <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {/* Notes */}
            {request.notes && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notes
                </h3>
                <p className="text-sm text-gray-700">{request.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}