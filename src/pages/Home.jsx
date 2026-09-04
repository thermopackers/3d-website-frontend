import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import bgImage from '../../images/hero.jpg';
import { 
  Play, 
  ArrowDown, 
  Zap, 
  Palette, 
  Gem, 
  Wrench,
  Package,
  CheckCircle,
  Clock,
  Users,
  Layers,
  ArrowRight,
  Phone,
  Star,
  Image,
  Recycle,
  Leaf,
  Trash2,
  Award,
  TrendingUp,
  Heart,
  Globe
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import fastPrintBg from '../../images/fast.png';
import customDesignBg from '../../images/custom.jpg';
import premiumMaterialsBg from '../../images/filament.jpg';
import expertSupportBg from '../../images/expert.png';
import plaBg from '../../images/pla.png';
import absBg from '../../images/abs.png';
import petgBg from '../../images/petg.png';
import resinBg from '../../images/resin.png';
import tpuBg from '../../images/tpu.png';
import FeaturedCreations from "../components/FeaturedCreations";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const heroRef = useRef(null);

  // For parallax effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  // ✅ SCROLL TO TOP ON PAGE MOUNT
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);

    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Please login to view products");
          return;
        }

        const res = await axiosInstance.get("/products?featured=true", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setFeaturedProducts(res.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        setError("Failed to load featured products");
        
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [navigate]);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "High-speed 3D printing with quick turnaround times. Get your prints in record time.",
      bgImage: fastPrintBg,
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Custom Designs",
      description: "Fully customizable designs to match your exact vision and requirements.",
      bgImage: customDesignBg,
    },
    {
      icon: <Gem className="w-8 h-8" />,
      title: "Premium Materials",
      description: "High-quality PLA, ABS, and resin materials for superior print quality.",
      bgImage: premiumMaterialsBg,
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Expert Support",
      description: "24/7 technical support and design consultation from industry experts.",
      bgImage: expertSupportBg,
    }
  ];

  const materials = [
    { 
      name: "PLA", 
      color: "", 
      icon: "",
      bgImage: plaBg,
      description: "Eco-friendly, biodegradable"
    },
    { 
      name: "ABS", 
      color: "", 
      icon: "",
      bgImage: absBg,
      description: "Durable, heat-resistant"
    },
    { 
      name: "PETG", 
      color: "", 
      icon: "",
      bgImage: petgBg,
      description: "Strong, flexible"
    },
    { 
      name: "Resin", 
      color: "", 
      icon: "",
      bgImage: resinBg,
      description: "High detail, smooth finish"
    },
    { 
      name: "TPU", 
      color: "", 
      icon: "",
      bgImage: tpuBg,
      description: "Flexible, rubber-like"
    }
  ];

  // Recycling benefits data
  const recyclingBenefits = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Eco-Friendly",
      description: "Reduce plastic waste and help protect our environment for future generations."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Earn Rewards",
      description: "Get discount coupons and reward points for every kg of plastic you recycle."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Sustainable Future",
      description: "Support the circular economy by turning waste plastic into valuable 3D printing materials."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Make a Difference",
      description: "Every kg of plastic recycled saves up to 2kg of CO2 emissions."
    }
  ];

  const recyclingStats = [
    { number: "500+", label: "KG Plastic Recycled", icon: <Recycle className="w-6 h-6" /> },
    { number: "1000+", label: "Happy Recyclers", icon: <Users className="w-6 h-6" /> },
    { number: "200+", label: "Trees Saved", icon: <Leaf className="w-6 h-6" /> },
    { number: "50+", label: "Partner Brands", icon: <Globe className="w-6 h-6" /> }
  ];

  const stats = [
        // { number: "10K+", label: "Projects Completed", icon: <Package className="w-6 h-6" />, color: "text-blue-600" },
    { number: "99%", label: "Success Rate", icon: <CheckCircle className="w-6 h-6" />, color: "text-green-600" },
    { number: "24/7", label: "Customer Support", icon: <Clock className="w-6 h-6" />, color: "text-purple-600" },
    { number: "50+", label: "Materials Available", icon: <Layers className="w-6 h-6" />, color: "text-orange-600" }
  ];

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const handleProductClick = (productId) => {
    navigate("/products", { state: { scrollToProduct: productId } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image and Parallax */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-white bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Bring Your Ideas<br />to Life
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Professional 3D printing services with precision, quality, and speed. 
            Transform your digital designs into physical reality.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.button 
              onClick={() => navigate("/recycling")}
              className="bg-white hover:from-blue-600 hover:to-purple-700 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5 text-black" />
              Start Recycling Now
            </motion.button>
            <motion.button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <ArrowDown className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div 
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============ RECYCLING SECTION - ADDED ============ */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 relative z-10 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full filter blur-[128px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-[128px]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="inline-block mb-4 px-6 py-2 bg-green-100 rounded-full"
            >
              <span className="text-sm font-semibold text-green-700 tracking-widest uppercase flex items-center gap-2">
                <Recycle className="w-4 h-4" />
                Plastic Recycling
              </span>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Turn Waste Into <span className="text-green-600">Value</span>
            </motion.h2>
            
            <motion.div 
              variants={itemVariants}
              className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
            />

            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Recycle your plastic waste and earn rewards while helping the planet. 
              Together, we can create a sustainable future.
            </motion.p>
          </motion.div>

          {/* Recycling Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {recyclingStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl text-green-500 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Recycling Benefits Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {recyclingBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                whileHover={{ y: -8 }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA for Recycling */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              <button
                onClick={() => navigate("/recycling")}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Recycle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Start Recycling Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <p className="mt-4 text-sm text-gray-500">
                ♻️ Every kg of plastic recycled helps save our planet
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Featured Products */}
      <FeaturedCreations />

      {/* Stats Section */}
      <section className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="p-6"
              >
                <motion.div 
                  className={`text-4xl font-bold mb-2 ${stat.color} flex items-center justify-center gap-2`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {stat.icon}
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Premium Version */}
      <section id="features" className="py-28 relative z-10 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          {/* Animated Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-1000 opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-2000 opacity-10"></div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-6"
              variants={itemVariants}
            >
              <span className="text-gray-400">Why Choose </span>
              <br className="block md:hidden" />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Our 3D Printing?
              </span>
            </motion.h2>
            
            <motion.div 
              className="w-32 h-1.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto mb-8 rounded-full shadow-lg"
              variants={itemVariants}
            />
            
            <motion.p 
              className="text-xl text-gray/70 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              We combine cutting-edge technology with expert craftsmanship to deliver 
              <span className="text-gray/90 font-medium"> exceptional 3D printed products</span> every time.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="group relative"
                variants={itemVariants}
                whileHover={{ 
                  y: -16, 
                  transition: { duration: 0.5, ease: "easeOut" } 
                }}
              >
                {/* Premium Card */}
                <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
                  {/* Background Image with Zoom */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${feature.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  
                  {/* Multi-layer Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90 transition-all duration-500 group-hover:from-black/50 group-hover:via-black/60 group-hover:to-black/80" />
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 min-h-[360px] flex flex-col items-start">
                    {/* Icon with Premium Glow */}
                    <motion.div 
                      className="relative mb-6"
                      whileHover={{ 
                        scale: 1.15, 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                      <div className="relative p-4 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
                        <div className="text-white/90">
                          {feature.icon}
                        </div>
                      </div>
                    </motion.div>

                    {/* Title with Gradient */}
                    <h3 className="text-2xl font-bold text-white mb-3 transition-all duration-500">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/70 leading-relaxed flex-1">
                      {feature.description}
                    </p>

                    {/* Premium Learn More */}
                    <motion.div 
                      className="mt-6 inline-flex items-center gap-3 text-white/80 group-hover:text-white transition-all duration-300 cursor-pointer"
                      whileHover={{ x: 10 }}
                    >
                      <span className="text-sm font-medium tracking-wider uppercase">Explore</span>
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold mb-6"
              variants={itemVariants}
            >
              Ready to Start Your 3D Printing Journey?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Join thousands of satisfied customers who have brought their ideas to life with our premium 3D printing services.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <motion.button 
                onClick={() => navigate("/products")}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-2 mx-auto sm:mx-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-5 h-5" />
                Order Now
              </motion.button>
              <motion.button 
                onClick={() => navigate("/contact")}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-2 mx-auto sm:mx-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-5 h-5" />
                Contact Us
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}