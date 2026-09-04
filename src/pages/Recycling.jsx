import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Camera,
  Trash2,
  Send,
  CheckCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  Weight,
  AlertCircle,
  FileText,
  Truck,
  Award,
  Gift,
  Building,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  ClipboardList,
  Box,
  Shield,
  Clock,
  Star
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

export default function Recycling() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [shippingPartners, setShippingPartners] = useState([]);
  const [showPartners, setShowPartners] = useState(false);
  const [showHowToSend, setShowHowToSend] = useState(false);
  
  const [formData, setFormData] = useState({
    wasteWeight: "",
    weightUnit: "kg",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    },
    notes: "",
    shippingMethod: "self_ship",
    shippingPartner: "",
    shippingPartnerName: "",
    trackingNumber: ""
  });
  
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/recycling/categories");
        setCategories(res.data);
        
        if (categoryParam) {
          const cat = res.data.find(c => c.id === categoryParam);
          if (cat) setSelectedCategory(cat);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load recycling categories");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [categoryParam]);

  // Fetch shipping partners
  useEffect(() => {
    const fetchShippingPartners = async () => {
      try {
        const res = await axiosInstance.get("/recycling/shipping-partners");
        setShippingPartners(res.data.partners);
      } catch (err) {
        console.error("Failed to fetch shipping partners:", err);
      }
    };
    fetchShippingPartners();
  }, []);

  // Auto-fill user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get("/users/address");
        const data = res.data.data;
        
        setFormData(prev => ({
          ...prev,
          contactName: data.name || prev.contactName,
          contactEmail: data.email || prev.contactEmail,
          contactPhone: data.phone || prev.contactPhone,
          address: {
            street: data.address?.street || prev.address.street,
            city: data.address?.city || prev.address.city,
            state: data.address?.state || prev.address.state,
            zipCode: data.address?.zipCode || prev.address.zipCode,
            country: data.address?.country || prev.address.country
          }
        }));
      } catch (err) {
        console.log("No saved user data found, using empty form");
      }
    };

    if (selectedCategory) {
      fetchUserData();
    }
  }, [selectedCategory]);
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setErrors({});
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (photos.length + files.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }
    
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
    }
    
    setPhotos(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prev => [...prev, ...previews]);
    e.target.value = "";
  };
  
  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedCategory) {
      newErrors.category = "Please select a recycling category";
    }
    
    if (!formData.wasteWeight || parseFloat(formData.wasteWeight) <= 0) {
      newErrors.wasteWeight = "Please enter a valid waste weight";
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email";
    }
    
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Phone number is required";
    } else if (formData.contactPhone.length < 10) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }
    
    if (!formData.address.street.trim()) {
      newErrors.street = "Street address is required";
    }
    if (!formData.address.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.address.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.address.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    }
    
    if (formData.shippingMethod === "pickup" && !formData.shippingPartner) {
      newErrors.shippingPartner = "Please select a shipping partner";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setSubmitting(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append("category", selectedCategory.id);
      formDataToSend.append("categoryLabel", selectedCategory.label);
      formDataToSend.append("wasteWeight", formData.wasteWeight);
      formDataToSend.append("weightUnit", formData.weightUnit);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("contactName", formData.contactName);
      formDataToSend.append("contactEmail", formData.contactEmail);
      formDataToSend.append("contactPhone", formData.contactPhone);
      formDataToSend.append("address", JSON.stringify(formData.address));
      formDataToSend.append("notes", formData.notes);
      formDataToSend.append("shippingMethod", formData.shippingMethod);
      formDataToSend.append("shippingPartner", formData.shippingPartner);
      formDataToSend.append("shippingPartnerName", formData.shippingPartnerName);
      formDataToSend.append("trackingNumber", formData.trackingNumber);
      
      photos.forEach(photo => {
        formDataToSend.append("photos", photo);
      });
      
      const res = await axiosInstance.post("/recycling/submit", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      setSubmittedRequest(res.data.recycling);
      setShippingAddress(res.data.shippingAddress);
      setRequestSubmitted(true);
      toast.success("Recycling request submitted successfully!");
      
      window.scrollTo({ top: 0, behavior: "smooth" });
      
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err.response?.data?.error || "Failed to submit recycling request");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setFormData({
      wasteWeight: "",
      weightUnit: "kg",
      description: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India"
      },
      notes: "",
      shippingMethod: "self_ship",
      shippingPartner: "",
      shippingPartnerName: "",
      trackingNumber: ""
    });
    setPhotos([]);
    setPhotoPreviews([]);
    setErrors({});
  };
  
  const handleViewMyRequests = () => {
    navigate("/my-recycling");
  };

  // Get partner details
  const getPartnerDetails = (partnerId) => {
    return shippingPartners.find(p => p.id === partnerId);
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
  
  if (requestSubmitted && submittedRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block p-4 bg-green-100 rounded-full mb-4"
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recycling Request Submitted! 🌍</h2>
              <p className="text-gray-600">
                Your recycling request has been received. Here's your unique Recycling ID:
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white text-center mb-8">
              <p className="text-sm opacity-90">Your Recycling ID</p>
              <p className="text-4xl font-bold tracking-wider">{submittedRequest.recyclingId}</p>
              <p className="text-sm opacity-90 mt-2">Please write this on your package</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-blue-500" />
                  Recycling Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Category:</span> {submittedRequest.categoryLabel}</p>
                  <p><span className="text-gray-500">Weight:</span> {submittedRequest.wasteWeight} {submittedRequest.weightUnit}</p>
                  <p><span className="text-gray-500">Status:</span> 
                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {submittedRequest.status}
                    </span>
                  </p>
                  {submittedRequest.shippingMethod === "pickup" && (
                    <p><span className="text-gray-500">Shipping Partner:</span> {submittedRequest.shippingPartnerName || submittedRequest.shippingPartner}</p>
                  )}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-green-500" />
                  Ship To (Kind Earth)
                </h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium">Kind Earth Recycling Center</p>
                  {shippingAddress && (
                    <>
                      <p>{shippingAddress.street}</p>
                      <p>{shippingAddress.city}, {shippingAddress.state}</p>
                      <p>{shippingAddress.zipCode}</p>
                      <p>{shippingAddress.country}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                Shipping Instructions
              </h4>
              <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
                <li>Pack your waste materials securely</li>
                <li>Write your Recycling ID on the package: <strong>{submittedRequest.recyclingId}</strong></li>
                <li>Ship to the address above via any courier or postal service</li>
                <li>Keep your tracking number for reference</li>
              </ol>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleViewMyRequests}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                View My Recycling Requests
              </button>
              <button
                onClick={() => setRequestSubmitted(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Submit Another Request
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToCategories}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Categories
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{selectedCategory.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.label}</h2>
                <p className="text-gray-600">{selectedCategory.description}</p>
              </div>
            </div>
            
            {/* Acceptable Items */}
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-green-800 mb-2">We Accept:</p>
              <div className="flex flex-wrap gap-2">
                {selectedCategory.acceptableItems.map((item, index) => (
                  <span key={index} className="bg-white px-3 py-1 rounded-full text-sm text-green-700 border border-green-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ============ HOW TO SEND WASTE SECTION ============ */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <button
                  type="button"
                  onClick={() => setShowHowToSend(!showHowToSend)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      📋 How to Send Your Waste
                    </h3>
                  </div>
                  {showHowToSend ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {showHowToSend && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Step 1 */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                              1
                            </div>
                            <h4 className="font-semibold text-gray-900">Pack Your Waste</h4>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1 ml-11">
                            <li>• Use sturdy boxes or bags</li>
                            <li>• Separate different types of plastic</li>
                            <li>• Remove labels and caps if possible</li>
                            <li>• Ensure materials are dry</li>
                          </ul>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                              2
                            </div>
                            <h4 className="font-semibold text-gray-900">Label Your Package</h4>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1 ml-11">
                            <li>• Write your Recycling ID clearly</li>
                            <li>• Add "Recycling - Kind Earth" label</li>
                            <li>• Include your contact details</li>
                            <li>• Mark as "Fragile" if needed</li>
                          </ul>
                        </div>
                        
                        {/* Step 3 */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                              3
                            </div>
                            <h4 className="font-semibold text-gray-900">Choose Shipping Method</h4>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1 ml-11">
                            <li>• Select "Assign Pickup" for doorstep pickup</li>
                            <li>• Or choose "Send to Kind Earth"</li>
                            <li>• Keep tracking number handy</li>
                            <li>• Get shipping confirmation</li>
                          </ul>
                        </div>
                        
                        {/* Step 4 */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                              4
                            </div>
                            <h4 className="font-semibold text-gray-900">Track & Earn Rewards</h4>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1 ml-11">
                            <li>• Track your package status</li>
                            <li>• Receive reward points</li>
                            <li>• Get discount coupons</li>
                            <li>• Help save the planet! 🌍</li>
                          </ul>
                        </div>
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
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Waste Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Waste Weight *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="wasteWeight"
                    value={formData.wasteWeight}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0.1"
                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      errors.wasteWeight ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter weight"
                  />
                  <select
                    name="weightUnit"
                    value={formData.weightUnit}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
                {errors.wasteWeight && (
                  <p className="text-red-500 text-sm mt-1">{errors.wasteWeight}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Describe your waste materials in detail"
                />
              </div>
              
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Photos (Max 5)
                </label>
                <div className="flex flex-wrap gap-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={preview}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border-2 border-green-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload clear photos of your waste materials</p>
              </div>
              
              <hr className="my-6" />
              
              {/* ============ SHIPPING METHOD ============ */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-green-500" />
                  Shipping Method
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, shippingMethod: "pickup" }));
                      setShowPartners(true);
                    }}
                    className={`p-4 border-2 rounded-xl text-left transition ${
                      formData.shippingMethod === "pickup"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        formData.shippingMethod === "pickup" ? "bg-blue-100" : "bg-gray-100"
                      }`}>
                        <Truck className={`w-5 h-5 ${
                          formData.shippingMethod === "pickup" ? "text-blue-600" : "text-gray-400"
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Assign Pickup Request</p>
                        <p className="text-sm text-gray-500">We'll arrange pickup via shipping partner</p>
                      </div>
                    </div>
                    {formData.shippingMethod === "pickup" && (
                      <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Selected
                      </div>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, shippingMethod: "self_ship" }));
                      setShowPartners(false);
                    }}
                    className={`p-4 border-2 rounded-xl text-left transition ${
                      formData.shippingMethod === "self_ship"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        formData.shippingMethod === "self_ship" ? "bg-purple-100" : "bg-gray-100"
                      }`}>
                        <Building className={`w-5 h-5 ${
                          formData.shippingMethod === "self_ship" ? "text-purple-600" : "text-gray-400"
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Send to Kind Earth</p>
                        <p className="text-sm text-gray-500">Ship to our address on your own</p>
                      </div>
                    </div>
                    {formData.shippingMethod === "self_ship" && (
                      <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Selected
                      </div>
                    )}
                  </button>
                </div>
                
                {formData.shippingMethod === "pickup" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-500" />
                      Select Shipping Partner *
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {shippingPartners.length > 0 ? (
                        shippingPartners.map((partner) => (
                          <button
                            key={partner.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                shippingPartner: partner.id,
                                shippingPartnerName: partner.name
                              }));
                            }}
                            className={`p-3 border-2 rounded-xl text-center transition ${
                              formData.shippingPartner === partner.id
                                ? "border-green-500 bg-green-50 shadow-md ring-2 ring-green-200"
                                : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                            }`}
                          >
                            {partner.logo ? (
                              <img
                                src={partner.logo}
                                alt={partner.name}
                                className="h-8 mx-auto mb-2 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-8 mx-auto mb-2 flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <p className={`font-medium text-sm ${
                              formData.shippingPartner === partner.id ? "text-green-700" : "text-gray-900"
                            }`}>
                              {partner.name}
                            </p>
                            <p className="text-xs text-gray-500">{partner.estimatedDays}</p>
                            <p className="text-xs text-green-600 font-medium">{partner.price}</p>
                            {formData.shippingPartner === partner.id && (
                              <div className="mt-1 text-xs text-green-600 font-medium flex items-center justify-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Selected
                              </div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-4 text-gray-500">
                          <Truck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>Loading shipping partners...</p>
                        </div>
                      )}
                    </div>
                    {errors.shippingPartner && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingPartner}</p>
                    )}
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Once you select a partner, we'll arrange pickup from your address within 24-48 hours
                      </p>
                    </div>
                  </div>
                )}
                
                {formData.shippingMethod === "self_ship" && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Please send your waste to our recycling center at the address provided after submission
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      You will receive our shipping address along with your Recycling ID
                    </p>
                  </div>
                )}
              </div>
              
              <hr className="my-6" />
              
              {/* Contact Information */}
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-green-500" />
                Contact Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      errors.contactName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      errors.contactEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                    errors.contactPhone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.contactPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                )}
              </div>
              
              <hr className="my-6" />
              
              {/* Address */}
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                Shipping Address (Your Address)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      errors.street ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Street address"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                  )}
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.address.state}
                      onChange={handleAddressChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="State"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.address.zipCode}
                      onChange={handleAddressChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                        errors.zipCode ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="ZIP Code"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Any special instructions or notes"
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <motion.div
                      className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Recycling Request
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // Category Selection View
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ♻️ Choose Your Recycling Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the type of waste you want to recycle. Every contribution helps reduce plastic waste and protect our environment.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCategorySelect(category)}
              className={`bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-green-300`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{category.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {category.label}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {category.acceptableItems.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        {item}
                      </span>
                    ))}
                    {category.acceptableItems.length > 3 && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                        +{category.acceptableItems.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-green-500 transform rotate-180 flex-shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>
        
        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Earn Rewards</h4>
              <p className="text-sm text-gray-600">Get reward points for recycling</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Discount Coupons</h4>
              <p className="text-sm text-gray-600">Receive coupons for future purchases</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Easy Shipping</h4>
              <p className="text-sm text-gray-600">Choose pickup or self-ship options</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}