import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [buyingNow, setBuyingNow] = useState({});
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedFilters, setSelectedFilters] = useState({
    colors: [],
    materials: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null); // Track hover state

    // ✅ SCROLL TO TOP ON PAGE MOUNT
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/products");
        setProducts(res.data);
        setError(null);
        
        // Initialize quantities to 1 for all products
        const initialQuantities = {};
        res.data.forEach(product => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Hover handlers
  const handleMouseEnter = (productId) => {
    setHoveredProduct(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  // Get current image based on hover state
  const getCurrentImage = (product) => {
    if (!product.images || product.images.length === 0) return null;
    
    // If product has multiple images and is being hovered, show second image
    if (hoveredProduct === product._id && product.images.length > 1) {
      return product.images[1]; // Second image
    }
    
    // Otherwise show first image or active image from dots
    return product.images[activeImageIndex[product._id] || 0];
  };

  // Quantity handlers
  const increaseQuantity = (productId, e) => {
    e?.stopPropagation();
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1
    }));
  };

  const decreaseQuantity = (productId, e) => {
    e?.stopPropagation();
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1)
    }));
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  const addToCart = async (product, e) => {
    e?.stopPropagation();
    try {
      setAddingToCart(prev => ({ ...prev, [product._id]: true }));
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please login to add items to cart");
        return;
      }

      const quantity = quantities[product._id] || 1;
      
      const res = await axiosInstance.post(
        "/cart/add",
        { productId: product._id, quantity: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
      
      // Update local cart state
      const cartItem = { ...product, quantity: quantity };
      const existingItemIndex = cart.findIndex(item => item._id === product._id);
      let updatedCart;
      
      if (existingItemIndex >= 0) {
        updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart = [...cart, cartItem];
      }
      
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      
      // Show toast notification
      showNotification(`Added ${quantity} ${product.name} to cart!`);
      
    } catch (err) {
      console.error(err);
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
      alert("Failed to add product to cart");
    }
  };

  const buyNow = async (product, e) => {
    e?.stopPropagation();
    try {
      setBuyingNow(prev => ({ ...prev, [product._id]: true }));
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please login to proceed with purchase");
        return;
      }

      const quantity = quantities[product._id] || 1;
      
      // Add to cart first
      await axiosInstance.post(
        "/cart/add",
        { productId: product._id, quantity: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local cart
      const cartItem = { ...product, quantity: quantity };
      const existingItemIndex = cart.findIndex(item => item._id === product._id);
      let updatedCart;
      
      if (existingItemIndex >= 0) {
        updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart = [...cart, cartItem];
      }
      
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      
      setBuyingNow(prev => ({ ...prev, [product._id]: false }));
      
      // Navigate to checkout page
      navigate("/checkout");
      
    } catch (err) {
      console.error(err);
      setBuyingNow(prev => ({ ...prev, [product._id]: false }));
      alert("Failed to process order. Please try again.");
    }
  };

  const navigateToProductDetail = (productId) => {
    navigate(`/products/${productId}`);
  };

  const showNotification = (message) => {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // Extract unique filters
  const allColors = [...new Set(products.flatMap(p => p.colorOptions || []))];
  const allMaterials = [...new Set(products.flatMap(p => p.materialOptions || []))];

  const handleFilterToggle = (type, value) => {
    setSelectedFilters(prev => {
      const currentValues = prev[type];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [type]: updatedValues };
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters({ colors: [], materials: [] });
    setCurrentPage(1);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useCallback(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesColor = selectedFilters.colors.length === 0 || 
                          product.colorOptions?.some(color => selectedFilters.colors.includes(color));
      
      const matchesMaterial = selectedFilters.materials.length === 0 || 
                             product.materialOptions?.some(material => selectedFilters.materials.includes(material));
      
      return matchesSearch && matchesColor && matchesMaterial;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "name":
        default:
          return a.name?.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, sortBy, selectedFilters]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredAndSortedProducts().slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedProducts().length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeProductImage = (productId, imageIndex, e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => ({
      ...prev,
      [productId]: imageIndex
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      

        {/* Search, Filter and Sort Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters
                {(selectedFilters.colors.length > 0 || selectedFilters.materials.length > 0) && (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {selectedFilters.colors.length + selectedFilters.materials.length}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Color Filters */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                      <button
                        key={color}
                        onClick={() => handleFilterToggle('colors', color)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                          selectedFilters.colors.includes(color)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material Filters */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3">Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {allMaterials.map(material => (
                      <button
                        key={material}
                        onClick={() => handleFilterToggle('materials', material)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                          selectedFilters.materials.includes(material)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedFilters.colors.length > 0 || selectedFilters.materials.length > 0) && (
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{currentProducts.length}</span> of{" "}
            <span className="font-semibold">{filteredAndSortedProducts().length}</span> products
          </p>
          
          {(selectedFilters.colors.length > 0 || selectedFilters.materials.length > 0) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Active filters:</span>
              {selectedFilters.colors.map(color => (
                <span key={color} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {color}
                </span>
              ))}
              {selectedFilters.materials.map(material => (
                <span key={material} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {material}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentProducts.map((product) => {
            const currentImage = getCurrentImage(product);
            const hasMultipleImages = product.images && product.images.length > 1;
            
            return (
              <div 
                key={product._id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer"
                onClick={() => navigateToProductDetail(product._id)}
              >
                {/* Product Image Gallery */}
                <div 
                  className="relative h-72 w-full overflow-hidden bg-gray-100"
                  onMouseEnter={() => handleMouseEnter(product._id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {product.images?.length > 0 ? (
                    <div className="relative h-full w-full">
                      {/* Main Image */}
                      <img
                        src={currentImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-opacity duration-500"
                      />
                      
                      {/* Image Gallery Indicators */}
                      {hasMultipleImages && (
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black bg-opacity-50 rounded-full px-2 py-1">
                          {product.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => changeProductImage(product._id, index, e)}
                              className={`w-2 h-2 rounded-full transition duration-200 ${
                                index === (activeImageIndex[product._id] || 0) ? 'bg-white' : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      
                      {/* Quick Actions Overlay */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, e);
                          }}
                          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-500 hover:text-white transition duration-200"
                          title="Add to Cart"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            buyNow(product, e);
                          }}
                          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-500 hover:text-white transition duration-200"
                          title="Buy Now"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ₹{product.price}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition duration-200 flex-1 mr-2">
                      {product.name}
                    </h2>
                    <div className="flex-shrink-0">
                      {product.materialOptions?.[0] && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                          {product.materialOptions[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Color Options */}
                  {product.colorOptions?.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-gray-500">Colors:</span>
                      <div className="flex gap-1">
                        {product.colorOptions.slice(0, 3).map((color, index) => (
                          <span
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                        {product.colorOptions.length > 3 && (
                          <span className="text-xs text-gray-500">+{product.colorOptions.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quantity and Actions */}
                  <div className="space-y-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Qty:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => decreaseQuantity(product._id, e)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition duration-200 shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantities[product._id] || 1}
                          onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                          className="w-12 text-center border border-gray-300 rounded-lg py-1 text-sm font-medium bg-white"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => increaseQuantity(product._id, e)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition duration-200 shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => addToCart(product, e)}
                        disabled={addingToCart[product._id]}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 ${
                          addingToCart[product._id]
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-black hover:bg-white hover:text-black hover:border text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                        {addingToCart[product._id] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => buyNow(product, e)}
                        disabled={buyingNow[product._id]}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                          buyingNow[product._id]
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-white text-black shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer'
                        }`}
                      >
                        {buyingNow[product._id] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          </>
                        ) : (
                          <>
                            Buy Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Products Message */}
        {currentProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">No products found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm || selectedFilters.colors.length > 0 || selectedFilters.materials.length > 0
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "No products available at the moment. Please check back later."
              }
            </p>
            {(searchTerm || selectedFilters.colors.length > 0 || selectedFilters.materials.length > 0) && (
              <button
                onClick={clearFilters}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 font-semibold"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Page <span className="font-semibold">{currentPage}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </p>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNum = currentPage <= 3 
                    ? index + 1 
                    : currentPage >= totalPages - 2 
                    ? totalPages - 4 + index 
                    : currentPage - 2 + index;
                  
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg transition duration-200 font-medium ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}