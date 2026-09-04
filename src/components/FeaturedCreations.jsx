import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Image, 
  Package, 
  Star, 
  Heart,
  Eye,
  ShoppingBag
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const FeaturedCreations = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [likedProducts, setLikedProducts] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState({});

  // Optimized fetch with caching
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Please login to view products");
          setLoading(false);
          return;
        }

        // Check cache first
        const cachedData = sessionStorage.getItem('featuredProducts');
        const cacheTimestamp = sessionStorage.getItem('featuredProductsTimestamp');
        const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
        
        // Use cache if less than 5 minutes old
        if (cachedData && cacheAge < 300000) {
          setProducts(JSON.parse(cachedData).slice(0, 6));
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get("/products?featured=true&limit=6", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          // Add timeout to prevent hanging
          timeout: 10000
        });
        
        const featuredProducts = res.data.slice(0, 6);
        setProducts(featuredProducts);
        
        // Cache the results
        sessionStorage.setItem('featuredProducts', JSON.stringify(featuredProducts));
        sessionStorage.setItem('featuredProductsTimestamp', Date.now().toString());
        
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

  // Memoized handlers
  const handleProductClick = useCallback((productId) => {
    navigate(`/products/${productId}`);
  }, [navigate]);

  const handleLike = useCallback((productId, e) => {
    e.stopPropagation();
    setLikedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  }, []);

  const handleMouseEnter = useCallback((productId) => {
    setHoveredProduct(productId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredProduct(null);
  }, []);

  const changeProductImage = useCallback((productId, imageIndex, e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => ({
      ...prev,
      [productId]: imageIndex
    }));
  }, []);

  const handleImageError = useCallback((e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextSibling;
    if (fallback) fallback.style.display = 'flex';
  }, []);

  // Memoized image getter
  const getCurrentImage = useCallback((product) => {
    if (!product.images || product.images.length === 0) return null;
    
    if (hoveredProduct === product._id && product.images.length > 1) {
      return product.images[1];
    }
    
    return product.images[activeImageIndex[product._id] || 0];
  }, [hoveredProduct, activeImageIndex]);

  // Memoized variants to prevent re-creation
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced stagger for faster appearance
        delayChildren: 0.05
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3, // Reduced duration
        ease: "easeOut"
      }
    }
  }), []);

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800/50 rounded-2xl overflow-hidden">
                  <div className="h-80 bg-gray-700/50"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
                    <div className="flex gap-3">
                      <div className="h-10 bg-gray-700/50 rounded flex-1"></div>
                      <div className="h-10 w-10 bg-gray-700/50 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-black">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Unable to load products</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Simplified Background - Less CPU intensive */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-[128px]"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full filter blur-[128px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Featured <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Creations</span>
          </motion.h2>
          
          <motion.div 
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-4 rounded-full"
          />
        </motion.div>

        {/* Products Grid - Optimized rendering */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const currentImage = getCurrentImage(product);
            const hasMultipleImages = product.images && product.images.length > 1;
            
            return (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group relative"
                whileHover={{ y: -4 }}
                onMouseEnter={() => handleMouseEnter(product._id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                  {/* Product Image */}
                  <div 
                    className="relative h-72 overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(product._id)}
                  >
                    {product.images?.length > 0 ? (
                      <img
                        src={currentImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                        <Image className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    {/* Image Dots - Simplified */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/50 rounded-full px-2 py-1">
                        {product.images.slice(0, 3).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => changeProductImage(product._id, idx, e)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                              idx === (activeImageIndex[product._id] || 0) 
                                ? 'bg-white w-3' 
                                : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Quick Action Buttons - Only show on desktop */}
                    {/* <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => handleLike(product._id, e)}
                        className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                      >
                        <Heart className={`w-4 h-4 transition-colors duration-200 ${
                          likedProducts[product._id] 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-700'
                        }`} />
                      </button>
                      <button
                        onClick={() => handleProductClick(product._id)}
                        className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                    </div> */}

                    {/* Price Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black rounded-lg">
                      <span className="text-white font-bold text-xs">₹{product.price}</span>
                    </div>
                  </div>

                  {/* Product Info - Simplified */}
                  <div className="p-4">
                    <h3 
                      className="text-lg font-bold text-white mb-1 cursor-pointer hover:text-blue-400 transition-colors duration-200 truncate"
                      onClick={() => handleProductClick(product._id)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    {/* Action Buttons - Simplified */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleProductClick(product._id)}
                        className="flex-1 py-2 px-3 bg-white hover:bg-black hover:text-white hover:border text-black rounded-lg font-semibold hover:shadow-xl cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-1 text-sm"
                      >
                        View Details
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      {/* <button
                        onClick={() => navigate('/products')}
                        className="py-2 px-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button> */}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => navigate("/products")}
            className="group px-8 py-3 bg-black text-white hover:bg-white cursor-pointer hover:text-black border rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCreations;