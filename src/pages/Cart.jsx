import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { 
  Zap,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle
} from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  
  // ✅ SCROLL TO TOP ON PAGE MOUNT
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Navigate to product detail
  const navigateToProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Fetch cart from DB
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/cart");
      setCart(res.data.items.map(i => ({ 
        ...i.product, 
        quantity: i.quantity,
        cartItemId: i._id // Keep cart item ID for updates
      })));
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate total whenever cart changes
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cart]);

  const updateQuantity = async (id, delta) => {
    const item = cart.find(i => i._id === id);
    if (!item) return;
    
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    if (newQty > 10) {
      alert("Maximum quantity per item is 10");
      return;
    }

    try {
      setUpdatingItems(prev => ({ ...prev, [id]: true }));
      await axiosInstance.post("/cart/update", {
        productId: id,
        quantity: newQty,
      });
      await fetchCart(); // Refresh cart data
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert("Failed to update quantity");
    } finally {
      setUpdatingItems(prev => ({ ...prev, [id]: false }));
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item from your cart?")) {
      return;
    }

    try {
      setUpdatingItems(prev => ({ ...prev, [id]: true }));
      await axiosInstance.post("/cart/remove", { productId: id });
      await fetchCart(); // Refresh cart data
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Failed to remove item from cart");
    } finally {
      setUpdatingItems(prev => ({ ...prev, [id]: false }));
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      setPlacingOrder(true);
      const orderData = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        color: item.color || "Default",
        material: item.material || "PLA"
      }));

      await axiosInstance.post("/orders/bulk", { orders: orderData });
      await axiosInstance.post("/cart/clear");
      
      alert("Order placed successfully! 🎉");
      setCart([]);
      navigate("/orders");
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const continueShopping = () => {
    navigate("/products");
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any 3D printed products to your cart yet.
            </p>
            <button
              onClick={continueShopping}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart Items ({cart.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item._id} className="p-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image - Clickable */}
                      <div 
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() => navigateToProduct(item._id)}
                      >
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 hover:shadow-md transition-shadow duration-200">
                          {item.images?.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details - Clickable */}
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => navigateToProduct(item._id)}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Color: {item.color || "Default"}</span>
                          <span>Material: {item.material || "PLA"}</span>
                        </div>
                      </div>

                      {/* Quantity Controls & Price */}
                      <div className="flex flex-col sm:items-end gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">₹{item.price}</p>
                          <p className="text-sm text-gray-500">per item</p>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              disabled={updatingItems[item._id] || item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            >
                              {updatingItems[item._id] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                              ) : (
                                <span className="text-lg font-semibold">−</span>
                              )}
                            </button>
                            
                            <span className="w-8 text-center font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              disabled={updatingItems[item._id] || item.quantity >= 10}
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            >
                              {updatingItems[item._id] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                              ) : (
                                <span className="text-lg font-semibold">+</span>
                              )}
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item._id)}
                            disabled={updatingItems[item._id]}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition duration-200 disabled:opacity-50"
                            title="Remove item"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">Total</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({cart.length})</span>
                  <span className="text-gray-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹{(total * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">₹{(total * 1.18).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                disabled={placingOrder || cart.length === 0}
                className="w-full cursor-pointer bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                Proceed to Checkout
              </button>

              <button
                onClick={continueShopping}
                className="w-full cursor-pointer mt-3 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}