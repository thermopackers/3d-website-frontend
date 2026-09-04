// pages/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Truck, 
  Shield, 
  CheckCircle,
  Loader,
  Zap,
  Clock,
  Package,
  MapPin,
  ChevronDown,
  ChevronUp,
  Home,
  Building,
  Star,
  Gift,
  Percent,
  IndianRupee
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import CouponDisplay from "../components/CouponDisplay";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  
  // Coupon states
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [showCouponSection, setShowCouponSection] = useState(false);
  
  // Shipping Details
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const deliveryFee = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + deliveryFee;
  const finalTotal = total - discount;

  // Fetch user profile and addresses
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("🔄 Fetching user profile and addresses...");
      const res = await axiosInstance.get("/users/address", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = res.data.data;
      console.log("👤 User data:", data);
      
      setUserEmail(data.email || "");
      
      if (data.addresses && data.addresses.length > 0) {
        setAddresses(data.addresses);
        const defaultAddr = data.addresses.find(addr => addr.isDefault) || data.addresses[0];
        setSelectedAddressId(defaultAddr._id);
        fillShippingDetails(defaultAddr, data.email);
      } else {
        setShippingDetails({
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          pincode: data.address?.zipCode || "",
          landmark: data.address?.landmark || "",
        });
      }
      
    } catch (err) {
      console.error("❌ Failed to fetch user profile:", err);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user) {
        const userEmail = user.email || "";
        setUserEmail(userEmail);
        setShippingDetails(prev => ({
          ...prev,
          fullName: user.name || "",
          email: userEmail,
        }));
      }
    }
  };

  const fillShippingDetails = (address, email) => {
    setShippingDetails({
      fullName: address.name || "",
      email: email || userEmail || shippingDetails.email || "",
      phone: address.phone || "",
      address: address.street || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.zipCode || "",
      landmark: address.landmark || "",
    });
  };

  const handleAddressSelect = (addressId) => {
    const address = addresses.find(addr => addr._id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      fillShippingDetails(address, userEmail);
      setShowAddressSelector(false);
    }
  };

  // Coupon handlers
  const handleApplyCoupon = (couponData) => {
    setAppliedCoupon(couponData);
    setDiscount(couponData.discount);
    console.log("✅ Coupon applied:", couponData);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  // Fetch cart from database
  const fetchCartFromDB = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { state: { from: "/checkout" } });
        return;
      }

      const res = await axiosInstance.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const items = res.data.items.map(i => ({
        ...i.product,
        quantity: i.quantity,
        cartItemId: i._id
      }));
      
      if (items.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        navigate("/products");
        return;
      }
      
      setCartItems(items);
      setLoading(false);
      await fetchUserProfile();
      
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert("Failed to load cart. Please try again.");
        navigate("/products");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 Checkout component mounted");
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    fetchCartFromDB();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (let field of requiredFields) {
      if (!shippingDetails[field]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    try {
      setProcessing(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to proceed with checkout");
        navigate("/login");
        return;
      }

      // If coupon is applied, mark it as used
      if (appliedCoupon) {
        try {
          await axiosInstance.put(`/recycling/coupons/${appliedCoupon.code}/use`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log("✅ Coupon marked as used:", appliedCoupon.code);
        } catch (err) {
          console.error("Failed to mark coupon as used:", err);
        }
      }

      console.log("📦 Creating payment order...");
      console.log("  Total amount:", finalTotal);

      const orderResponse = await axiosInstance.post(
        "/payments/create-order",
        { 
          amount: Math.round(finalTotal),
          currency: "INR",
          receipt: `order_${Date.now()}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📦 Order response:", orderResponse.data);

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.error || "Failed to create payment order");
      }

      const { orderId, amount, currency, key } = orderResponse.data;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway. Please check your internet connection.");
      }

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "PrintForge",
        description: "3D Printing Purchase",
        order_id: orderId,
        handler: async function(response) {
          try {
            console.log("✅ Payment successful:", response);
            
            const verifyResponse = await axiosInstance.post(
              "/payments/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartItems: cartItems,
                totalAmount: finalTotal,
                shippingDetails: shippingDetails,
                couponApplied: appliedCoupon,
                discount: discount
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              setPaymentSuccess(true);
              await axiosInstance.post("/cart/clear", {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setTimeout(() => {
                navigate("/orders", { state: { paymentSuccess: true } });
              }, 2000);
            } else {
              throw new Error(verifyResponse.data.error || "Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            setError(err.message || "Payment verification failed. Please contact support.");
            setProcessing(false);
          }
        },
        prefill: {
          name: shippingDetails.fullName,
          email: shippingDetails.email,
          contact: shippingDetails.phone,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (err) {
      console.error("Payment error:", err);
      let errorMessage = err.message || "Failed to initiate payment. Please try again.";
      
      if (err.response?.status === 503) {
        errorMessage = "Payment service is currently unavailable. Please check your Razorpay configuration.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please check your Razorpay API keys.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please check your Razorpay credentials and try again.";
      }
      
      setError(errorMessage);
      setProcessing(false);
    }
  };

  const getLabelIcon = (label) => {
    switch(label) {
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Work': return <Building className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-200"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div className="w-20"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold">Payment Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  Shipping Details
                </h2>
                {addresses.length > 0 && (
                  <button
                    onClick={() => setShowAddressSelector(!showAddressSelector)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <MapPin className="w-4 h-4" />
                    {showAddressSelector ? 'Hide saved addresses' : 'Choose saved address'}
                    {showAddressSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Address Selector */}
              {showAddressSelector && addresses.length > 0 && (
                <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="font-medium text-gray-900 mb-3">Select a saved address</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => handleAddressSelect(address._id)}
                        className={`p-3 border rounded-lg cursor-pointer transition ${
                          selectedAddressId === address._id
                            ? 'border-blue-500 bg-blue-100'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 flex items-center gap-1">
                                {getLabelIcon(address.label)}
                                {address.label}
                              </span>
                              {address.isDefault && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Star className="w-3 h-3" /> Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              <p>{address.name}</p>
                              <p>{address.street}</p>
                              <p>{address.city}, {address.state} - {address.zipCode}</p>
                              <p className="text-gray-500">📞 {address.phone}</p>
                            </div>
                          </div>
                          {selectedAddressId === address._id && (
                            <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowAddressSelector(false)}
                    className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Shipping Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingDetails.fullName}
                    onChange={handleInputChange}
                    className="w-full placeholder-gray-300 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Rahul"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingDetails.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="john@example.com"
                    readOnly
                  />
                  <p className="text-xs text-gray-400 mt-1">Email is linked to your account</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingDetails.phone}
                    onChange={handleInputChange}
                    className="w-full placeholder-gray-300 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    className="w-full placeholder-gray-300 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="123 Modal Town"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    className="w-full placeholder-gray-300 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Jalandhar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingDetails.state}
                    onChange={handleInputChange}
                    className="w-full placeholder-gray-300 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Punjab"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingDetails.pincode}
                    onChange={handleInputChange}
                    className="w-full placeholder-gray-300 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="400001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={shippingDetails.landmark}
                    onChange={handleInputChange}
                    className="w-full placeholder-gray-300 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Near City Center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400 m-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-900">
                    {deliveryFee === 0 ? "Free" : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                
                {/* Coupon Discount Section */}
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      Coupon Discount
                    </span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Section - ADDED HERE */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={() => setShowCouponSection(!showCouponSection)}
                  className="flex items-center cursor-pointer gap-2 text-sm text-blue-600 hover:text-blue-700 transition"
                >
                  <Gift className="w-4 h-4" />
                  {showCouponSection ? 'Hide coupons' : 'Apply coupon'}
                  {appliedCoupon && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Applied ✓
                    </span>
                  )}
                </button>

                {showCouponSection && (
                  <div className="mt-3">
                    <CouponDisplay 
                      onApplyCoupon={handleApplyCoupon}
                      onRemoveCoupon={handleRemoveCoupon}
                      orderAmount={total}
                      appliedCoupon={appliedCoupon}
                    />
                  </div>
                )}
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className={`w-full mt-6 py-3 px-4 bg-black hover:bg-white cursor-pointer hover:border hover:text-black text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  processing 
                    ? 'opacity-75 cursor-not-allowed' 
                    : 'hover:shadow-xl transform hover:scale-[1.02]'
                }`}
              >
                {processing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Pay ₹{finalTotal.toFixed(2)} with Razorpay
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <Shield className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Secure<br />Payment</p>
                </div>
                <div>
                  <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Fast<br />Delivery</p>
                </div>
                <div>
                  <CheckCircle className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">100%<br />Authentic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}