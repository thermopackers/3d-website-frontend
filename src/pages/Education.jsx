import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  School,
  Users,
  Recycle,
  Leaf,
  Award,
  TrendingUp,
  Heart,
  Globe,
  Zap,
  Clock,
  CheckCircle,
  Play,
  Info,
  FileText,
  GraduationCap,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Send,
  Star,
  Shield,
  Target,
  Sparkles,
  Handshake,
  TreePine,
  Droplet,
  Sun,
  Compass,
  Factory,
  Building,
  CalendarDays,
  Clock as ClockIcon,
  CreditCard,
  IndianRupee,
  AlertCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

export default function Education() {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    participants: 1,
    name: "",
    email: "",
    phone: "",
    organization: ""
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    message: ""
  });
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
      setBookingData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Program Types
  const programTypes = [
    {
      id: "workshop",
      title: "Live Hands-On Workshop",
      icon: <Handshake className="w-8 h-8" />,
      description: "Our team provides live practicals on plastic recycling with hands-on experience.",
      duration: "2 hours",
      cost: 1000,
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      details: [
        "Live practical demonstration",
        "Hands-on recycling experience",
        "All materials provided",
        "Certificate of participation"
      ]
    },
    {
      id: "drive",
      title: "Plastic Recycling Drive",
      icon: <Users className="w-8 h-8" />,
      description: "Complete recycling drive including awareness, collection, and segregation.",
      duration: "Full Day",
      cost: 10000,
      color: "from-green-500 to-teal-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      details: [
        "Awareness session",
        "Location identification",
        "Collection drive",
        "Segregation & recycling demonstration"
      ]
    }
  ];

  // FAQs Data
  const faqs = [
    {
      id: 1,
      question: "What is included in the Live Hands-On Workshop?",
      answer: "The Live Hands-On Workshop is a 2-hour program where our team provides live practical demonstrations on plastic recycling. You'll get hands-on experience with sorting, cleaning, and processing plastic waste. All materials are provided, and you'll receive a certificate of participation at the end."
    },
    {
      id: 2,
      question: "What does the Plastic Recycling Drive include?",
      answer: "The Plastic Recycling Drive is a full-day program that includes: 1) Awareness session about plastic pollution and recycling, 2) Identifying collection locations with community input, 3) Visiting and collecting plastic waste from the identified locations, 4) Segregation and recycling demonstration showing how plastic is converted into useful filament."
    },
    {
      id: 3,
      question: "Is the booking fee refundable?",
      answer: "No, all program bookings are non-refundable. Please ensure you're available on the selected date and time before confirming your booking. If you need to reschedule, please contact us at least 48 hours in advance."
    },
    {
      id: 4,
      question: "How many participants can join the program?",
      answer: "For the Live Hands-On Workshop, we recommend up to 20 participants for the best experience. For the Plastic Recycling Drive, groups of up to 50 participants can be accommodated. You can specify the number of participants when booking."
    },
    {
      id: 5,
      question: "What materials are provided during the workshop?",
      answer: "All necessary materials for the workshop are provided, including plastic waste samples, sorting tools, cleaning supplies, safety equipment (gloves, masks), and educational materials. You'll also receive a certificate and take-home guide."
    },
    {
      id: 6,
      question: "Can I book multiple programs?",
      answer: "Yes, you can book multiple programs for different dates. Each program booking is separate and requires its own payment. You can also book programs for different communities or organizations."
    },
    {
      id: 7,
      question: "What should I bring to the workshop?",
      answer: "We recommend wearing comfortable clothing and closed-toe shoes. Bring a water bottle, notebook for taking notes, and your enthusiasm to learn! All other materials will be provided by us."
    },
    {
      id: 8,
      question: "How do I confirm my booking?",
      answer: "After completing the payment process, you'll receive a confirmation email with all the details including date, time, location, and what to bring. You can also view your bookings in the 'My Programs' section of your account."
    }
  ];

  // Generate available slots
  const generateAvailableSlots = (date) => {
    const slots = [];
    const times = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];
    const bookedSlots = ["10:30 AM", "2:30 PM"]; // Simulated booked slots
    
    times.forEach(time => {
      if (!bookedSlots.includes(time)) {
        slots.push({ time, available: true });
      } else {
        slots.push({ time, available: false });
      }
    });
    
    return slots;
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setBookingData(prev => ({ ...prev, date }));
    if (date) {
      setAvailableSlots(generateAvailableSlots(date));
    } else {
      setAvailableSlots([]);
    }
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    setShowBooking(true);
    setError(null);
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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.time || !bookingData.name || !bookingData.email || !bookingData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setProcessingPayment(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to book a program");
        navigate("/login");
        return;
      }

      const orderResponse = await axiosInstance.post(
        "/payments/create-order",
        { 
          amount: selectedProgram.cost,
          currency: "INR",
          receipt: `program_${selectedProgram.id}_${Date.now()}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.error || "Failed to create payment order");
      }

      const { orderId, amount, currency, key } = orderResponse.data;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Kind Earth",
        description: `${selectedProgram.title} Booking`,
        order_id: orderId,
        handler: async function(response) {
          try {
            const verifyResponse = await axiosInstance.post(
              "/education/book-program",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                programId: selectedProgram.id,
                programTitle: selectedProgram.title,
                programCost: selectedProgram.cost,
                bookingData: {
                  date: bookingData.date,
                  time: bookingData.time,
                  participants: bookingData.participants,
                  name: bookingData.name,
                  email: bookingData.email,
                  phone: bookingData.phone,
                  organization: bookingData.organization
                }
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              setPaymentSuccess(true);
              await sendConfirmationEmail();
              setTimeout(() => {
                navigate("/programs", { state: { bookingSuccess: true } });
              }, 3000);
            } else {
              throw new Error(verifyResponse.data.error || "Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            setError(err.message || "Payment verification failed. Please contact support.");
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: bookingData.name,
          email: bookingData.email,
          contact: bookingData.phone,
        },
        theme: {
          color: "#22c55e",
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to initiate payment. Please try again.");
      setProcessingPayment(false);
    }
  };

  const sendConfirmationEmail = async () => {
    try {
      await axiosInstance.post("/education/send-confirmation", {
        programTitle: selectedProgram.title,
        programCost: selectedProgram.cost,
        bookingData: bookingData
      });
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to submit a request");
      navigate("/login");
      return;
    }

    const response = await axiosInstance.post(
      "/education",
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        message: formData.message,
        programType: "community"
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.success) {
      alert("Thank you for your interest! We'll contact you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        message: ""
      });
    }
  } catch (err) {
    console.error("Error submitting request:", err);
    alert(err.response?.data?.error || "Failed to submit request. Please try again.");
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-blue-800">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-1000 opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-2000 opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-block mb-4 px-6 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20"
            >
              <span className="text-sm font-semibold text-white/90 tracking-widest uppercase flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Education & Community
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Start a <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                Recycling Program
              </span>
              <br />
              in Your Community
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl text-white/80 max-w-3xl mx-auto"
            >
              Choose from our specialized programs and make a real difference in your community.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Communities Reached", icon: <Globe className="w-6 h-6 text-green-500" /> },
              { number: "1000+", label: "Programs Launched", icon: <CheckCircle className="w-6 h-6 text-blue-500" /> },
              { number: "50K+", label: "KG Plastic Recycled", icon: <Recycle className="w-6 h-6 text-purple-500" /> },
              { number: "200+", label: "Schools Engaged", icon: <School className="w-6 h-6 text-orange-500" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Selection */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {!showBooking ? (
            <>
              <motion.div 
                className="text-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                <motion.h2 
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                >
                  Choose Your <span className="text-green-600">Program</span>
                </motion.h2>
                <motion.div 
                  variants={itemVariants}
                  className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
                />
                <motion.p 
                  variants={itemVariants}
                  className="text-xl text-gray-600 max-w-3xl mx-auto"
                >
                  Select a program that best fits your community's needs and budget.
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {programTypes.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                    whileHover={{ y: -8 }}
                  >
                    <div className={`p-8 ${program.bgColor} border-b ${program.borderColor}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${program.color} text-white`}>
                          {program.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{program.title}</h3>
                          <p className="text-sm text-gray-500">{program.duration}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <ul className="space-y-2 mb-6">
                        {program.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Program Fee</p>
                          <p className="text-2xl font-bold text-gray-900">₹{program.cost}</p>
                        </div>
                        <button
                          onClick={() => handleSelectProgram(program)}
                          className={`px-6 py-3 bg-gradient-to-r ${program.color} text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2`}
                        >
                          <Calendar className="w-4 h-4" />
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={() => {
                  setShowBooking(false);
                  setSelectedProgram(null);
                  setError(null);
                }}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Programs
              </button>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className={`p-6 rounded-xl bg-gradient-to-r ${selectedProgram.color} text-white mb-8`}>
                  <h2 className="text-2xl font-bold">Booking: {selectedProgram.title}</h2>
                  <p className="text-white/80">Duration: {selectedProgram.duration}</p>
                  <p className="text-white/80">Fee: ₹{selectedProgram.cost}</p>
                </div>

                {paymentSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h3>
                    <p className="text-gray-600">Your program has been booked successfully.</p>
                    <p className="text-sm text-gray-500 mt-2">A confirmation email has been sent to your email.</p>
                    <button
                      onClick={() => navigate("/programs")}
                      className="mt-6 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
                    >
                      View My Programs
                    </button>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                          <input type="text" name="name" value={bookingData.name} onChange={handleBookingInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="Your full name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                          <input type="email" name="email" value={bookingData.email} onChange={handleBookingInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="your@email.com" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                          <input type="tel" name="phone" value={bookingData.phone} onChange={handleBookingInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="Enter phone number" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Organization/Community</label>
                          <input type="text" name="organization" value={bookingData.organization} onChange={handleBookingInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="School, Society, College, etc." />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date *</label>
                          <input type="date" name="date" value={bookingData.date} onChange={handleDateChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Participants *</label>
                          <input type="number" name="participants" value={bookingData.participants} onChange={handleBookingInputChange} min="1" max="50" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
                        </div>
                      </div>

                      {bookingData.date && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot *</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableSlots.map((slot, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setBookingData(prev => ({ ...prev, time: slot.time }))}
                                disabled={!slot.available}
                                className={`p-3 border-2 rounded-xl text-center transition ${
                                  bookingData.time === slot.time
                                    ? 'border-green-500 bg-green-50'
                                    : slot.available
                                    ? 'border-gray-200 hover:border-green-300'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                                }`}
                              >
                                <ClockIcon className="w-4 h-4 mx-auto mb-1" />
                                <span className="text-sm font-medium">{slot.time}</span>
                                {!slot.available && <p className="text-xs text-red-500">Booked</p>}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-sm text-yellow-800 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          <span><strong>Note:</strong> This booking is <strong>non-refundable</strong>. Please ensure you're available on the selected date and time before confirming.</span>
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={processingPayment}
                        className={`w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                          processingPayment ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'
                        }`}
                      >
                        {processingPayment ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Pay ₹{selectedProgram.cost} with Razorpay
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Frequently Asked <span className="text-green-600">Questions</span>
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
            />
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Find answers to common questions about our programs and booking process.
            </motion.p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: faq.id * 0.05 }}
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-green-300 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {openFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl"
          >
            <p className="text-gray-600">
              Still have questions? <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="text-green-600 font-semibold hover:underline">Contact us</button> and we'll be happy to help!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Get <span className="text-green-600">Started</span> Today
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
            />
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Have questions or want to customize a program? Reach out to us!
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization/Community</label>
                  <input type="text" name="organization" value={formData.organization} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="School, Society, College, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="Tell us about your community and recycling goals" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Request
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  
                  <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                    <Mail className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-white/80">recycle@kindearth.org</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                    <MapPin className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">Visit Us</p>
                      <p className="text-white/80">Kind Earth</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                    <Clock className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">Working Hours</p>
                      <p className="text-white/80">Mon-Sat: 9AM - 6PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Why Partner With Us?
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Free consultation and guidance
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Training materials and resources
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Ongoing support and monitoring
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Recognition and certification
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Make a Difference?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-white/80 max-w-2xl mx-auto mb-8"
            >
              Choose a program and start your recycling journey today.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => {
                  const programSection = document.querySelector('.grid-cols-1.md\\:grid-cols-2');
                  if (programSection) {
                    programSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-3 bg-white text-green-700 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto sm:mx-0"
              >
                <Recycle className="w-5 h-5" />
                Start a Program
              </button>
              <button
                onClick={() => navigate("/recycling")}
                className="px-8 py-3 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2 mx-auto sm:mx-0"
              >
                <Leaf className="w-5 h-5" />
                Join Recycling Drive
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}