import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  RotateCcw, 
  Shield,
  Minus,
  Plus,
  Image as ImageIcon,
  Zap
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch product with caching
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setImageLoaded(false);
        
        const token = localStorage.getItem("token");
        
        // Check cache first
        const cacheKey = `product_${productId}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        const cacheTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);
        const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
        
        // Use cache if less than 5 minutes old
        if (cachedData && cacheAge < 300000) {
          setProduct(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // Fetch from API with timeout
        const res = await axiosInstance.get(`/products/${productId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 10000
        });
        
        setProduct(res.data);
        
        // Cache the result
        sessionStorage.setItem(cacheKey, JSON.stringify(res.data));
        sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        
      } catch (err) {
        console.error("Error fetching product:", err);
        
        if (err.response?.status === 404) {
          setError("Product not found. It may have been removed.");
        } else if (err.code === 'ECONNABORTED') {
          setError("Request timed out. Please check your connection.");
        } else {
          setError("Failed to load product details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [productId]);

  // Add to Cart handler
  const addToCart = useCallback(async () => {
    try {
      setAddingToCart(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please login to add items to cart");
        setAddingToCart(false);
        return;
      }

      await axiosInstance.post(
        "/cart/add",
        { productId: product._id, quantity: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-slide-in';
      notification.textContent = `${quantity} ${product.name}(s) added to cart!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('animate-slide-out');
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  }, [product, quantity]);

  // Buy Now handler
  const buyNow = useCallback(async () => {
    try {
      setBuyingNow(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please login to proceed with purchase");
        setBuyingNow(false);
        return;
      }

      // Add to cart first
      await axiosInstance.post(
        "/cart/add",
        { productId: product._id, quantity: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Navigate to checkout
      navigate("/checkout");
      
    } catch (err) {
      console.error(err);
      alert("Failed to process order. Please try again.");
      setBuyingNow(false);
    }
  }, [product, quantity, navigate]);

  const incrementQuantity = useCallback(() => {
    if (quantity < 10) {
      setQuantity(prev => prev + 1);
    }
  }, [quantity]);

  const decrementQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  }, [quantity]);

  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setQuantity(value);
    }
  }, []);

  const toggleLike = useCallback(() => {
    setIsLiked(prev => !prev);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} on PrintForge!`,
        url: window.location.href,
      });
    } catch (err) {
      // Copy to clipboard fallback
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }, [product]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-8">
                <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-200 h-96 mb-4"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 rounded-md bg-gray-200"></div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 p-8 border-l border-gray-200">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate("/products")}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Back to Products
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg transition duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
          <button
            onClick={() => navigate("/products")}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Images */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-4 aspect-square">
                {product.images?.length > 0 ? (
                  <>
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
                      </div>
                    )}
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setImageLoaded(true)}
                      loading="lazy"
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="h-24 w-24" />
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 aspect-square ${
                        selectedImage === index 
                          ? 'border-blue-500 shadow-lg scale-95' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
              <div className="flex flex-col h-full">
                <div>
                  {/* Product Name & Actions */}
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex-1">
                      {product.name}
                    </h1>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={toggleLike}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Share2 className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-4">
                    <span className="text-3xl font-bold text-blue-600">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="ml-3 text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {product.material && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Material</p>
                        <p className="font-medium text-gray-900">{product.material}</p>
                      </div>
                    )}
                    {product.color && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Color</p>
                        <p className="font-medium text-gray-900">{product.color}</p>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Dimensions</p>
                        <p className="font-medium text-gray-900">{product.dimensions}</p>
                      </div>
                    )}
                    {product.weight && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="font-medium text-gray-900">{product.weight}</p>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                      <ul className="space-y-1">
                        {product.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start text-gray-600 text-sm">
                            <Star className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Add to Cart & Buy Now Section */}
                <div className="border-t border-gray-200 pt-6 mt-auto">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-12 text-center bg-transparent font-semibold text-gray-900 outline-none"
                      />
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= 10}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons - Add to Cart & Buy Now */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Add to Cart Button */}
                    <button
                      onClick={addToCart}
                      disabled={addingToCart}
                      className={`flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        addingToCart 
                          ? 'opacity-75 cursor-not-allowed' 
                          : 'hover:shadow-xl transform hover:scale-[1.02]'
                      }`}
                    >
                      {addingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
                    </button>

                    {/* Buy Now Button */}
                    <button
                      onClick={buyNow}
                      disabled={buyingNow}
                      className={`flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        buyingNow 
                          ? 'opacity-75 cursor-not-allowed' 
                          : 'hover:shadow-xl transform hover:scale-[1.02]'
                      }`}
                    >
                      {buyingNow ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Buy Now - ₹{(product.price * quantity).toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Shipping Info */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="text-center">
                      <Truck className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Free Shipping</p>
                    </div>
                    <div className="text-center">
                      <RotateCcw className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">30-Day Returns</p>
                    </div>
                    <div className="text-center">
                      <Shield className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Secure Checkout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}