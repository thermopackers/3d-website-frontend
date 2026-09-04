import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Home, 
  Package, 
  ShoppingCart, 
  Settings, 
  Users, 
  LogOut,
  User,
  ChevronDown,
  Shield,
  BarChart3,
  Phone,
  Info,
  Recycle,
  BookOpen,
  Gift,
  ClipboardList
} from "lucide-react";
import logo from '/images/kind-earth-logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      
      if (userObj.role !== "admin") {
        updateCartCount();
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 FIX: Handle body scroll when mobile menu opens/closes
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Prevent scrolling on body when menu is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Restore scrolling when menu is closed
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location]);

  const updateCartCount = () => {
    try {
      if (user?.role === "admin") {
        setCartItemsCount(0);
        return;
      }
      
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItemsCount(savedCart.length);
    } catch (error) {
      console.error("Error loading cart count:", error);
      setCartItemsCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    document.addEventListener('visibilitychange', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      document.removeEventListener('visibilitychange', handleCartUpdate);
    };
  }, [user]);

  const navLinks = [
    { 
      path: "/", 
      label: <span className="text-xs">Home</span>, 
      icon: <Home className="w-4 h-4" />,
      show: true 
    },
    { 
      path: "/products", 
      label: <span className="text-xs">Products</span>, 
      icon: <Package className="w-4 h-4" />,
      show: true 
    },
    { 
      path: "/learn", 
      label: <span className="text-xs">Learn</span>, 
      icon: <BookOpen className="w-4 h-4" />,
      show: true 
    },
    { 
  path: "/education", 
  label: <span className="text-xs">Education</span>, 
  icon: <BookOpen className="w-4 h-4" />,
  show: true 
},
    { 
      path: "/about", 
      label: <span className="text-xs">About</span>, 
      icon: <Info className="w-4 h-4" />,
      show: true 
    },
  ];

  const profileLinks = [
    { 
      path: "/profile", 
      label: "My Profile", 
      icon: <User className="w-4 h-4" /> 
    },
    { 
      path: "/recycling", 
      label: "Recycle", 
      icon: <Recycle className="w-4 h-4" /> 
    },
    { 
      path: "/orders", 
      label: "My Orders", 
      icon: <ClipboardList className="w-4 h-4" /> 
    },
    { 
      path: "/my-recycling", 
      label: "My Recycling", 
      icon: <Gift className="w-4 h-4" /> 
    },
  ];

  const adminLinks = [
    { 
      path: "/admin/orders", 
      label: <span className="text-xs">All Orders</span>, 
      icon: <BarChart3 className="w-3 h-3" /> 
    },
    { 
      path: "/admin/products", 
      label: <span className="text-xs">Manage Products</span>, 
      icon: <Settings className="w-3 h-3" /> 
    },
    { 
      path: "/admin/users", 
      label: <span className="text-xs">User Management</span>, 
      icon: <Users className="w-3 h-3" /> 
    },
    { 
      path: "/admin/recycling", 
      label: <span className="text-xs">Recycling Requests</span>, 
      icon: <Recycle className="w-3 h-3" /> 
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const filteredNavLinks = navLinks.filter(link => link.show !== false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 text-gray-800" 
            : "bg-black text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
             <div className='p-2 rounded-lg' onClick={() => navigate("/")}>
  <img src={logo} alt="Logo" className="w-10 h-10" />
</div>
              {/* <span 
                className="font-bold text-xl cursor-pointer"
                onClick={() => navigate("/")}
              >
                Kind Earth
              </span> */}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {filteredNavLinks.map((link) => (
                <motion.div
                  key={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isActiveRoute(link.path)
                        ? scrolled
                          ? "bg-blue-100 text-blue-700 shadow-sm"
                          : "bg-white/20 text-white shadow-sm"
                        : scrolled
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Admin Links */}
              {user?.role === "admin" && (
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      scrolled
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`} />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                      >
                        {adminLinks.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            {link.icon}
                            {link.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* User Section - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {user?.role !== "admin" && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => navigate("/cart")}
                    className={`relative p-2 rounded-xl font-medium transition-all duration-200 ${
                      isActiveRoute("/cart")
                        ? scrolled
                          ? "bg-blue-100 text-blue-700"
                          : "bg-white/20 text-white"
                        : scrolled
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemsCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                      >
                        {cartItemsCount > 9 ? '9+' : cartItemsCount}
                      </motion.span>
                    )}
                  </button>
                </motion.div>
              )}

              {user ? (
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                >
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      scrolled
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      scrolled ? "bg-blue-600 text-white" : "bg-white/20 text-white"
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`} />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                        </div>
                        
                        {profileLinks.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            {link.icon}
                            {link.label}
                          </Link>
                        ))}
                        
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                      scrolled
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white hover:bg-gray-100 text-blue-600"
                    }`}
                  >
                    Login
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
                scrolled 
                  ? "text-gray-600 hover:bg-gray-100" 
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu - With proper scrolling */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "calc(100vh - 64px)" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200 shadow-xl overflow-y-auto"
              style={{
                position: 'fixed',
                top: '64px',
                left: 0,
                right: 0,
                bottom: 0,
                height: 'calc(100vh - 64px)',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="px-4 py-6 space-y-4">
                {/* Navigation Links */}
                {filteredNavLinks.map((link) => (
                  <motion.div
                    key={link.path}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActiveRoute(link.path)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Cart Link for Mobile */}
                {user?.role !== "admin" && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to="/cart"
                      className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActiveRoute("/cart")
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center text-xs gap-3">
                        <ShoppingCart className="w-3 h-3" />
                        Shopping Cart
                      </div>
                      {cartItemsCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                )}

                {/* Profile Links for Mobile */}
                {user && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-t border-gray-200 pt-4"
                  >
                    <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      My Account
                    </h3>
                    {profileLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}

                {/* Admin Links */}
                {user?.role === "admin" && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-t border-gray-200 pt-4"
                  >
                    <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Admin Panel
                    </h3>
                    {adminLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}

                {/* User Section - Mobile */}
                {user ? (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-t border-gray-200 pt-4"
                  >
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-t border-gray-200 pt-4"
                  >
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200"
                    >
                      Login
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
