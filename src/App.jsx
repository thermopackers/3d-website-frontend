import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import Navbar from "./components/Navbar.jsx";
import Cart from "./pages/Cart.jsx";
import Footer from "./components/Footer.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Recycling from "./pages/Recycling.jsx";
import MyRecycling from "./pages/MyRecycling.jsx";
import RecyclingDetail from "./pages/RecyclingDetail.jsx";
import AdminRecycling from "./pages/admin/AdminRecycling.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import Checkout from "./pages/Checkout.jsx";
import Learn from "./pages/Learn.jsx";
import Education from "./pages/Education.jsx";
import AdminEducation from "./pages/admin/AdminEducation.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import Contact from "./pages/Contact.jsx";
// import TestModeToggle from "./components/TestModeToggle.jsx";
function AppWrapper() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      {/* Make Routes container grow to fill available space */}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
                  <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute requiredRole="admin"><AdminProducts /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
<Route path="/admin/recycling" element={<ProtectedRoute><AdminRecycling /></ProtectedRoute>} />
<Route path="/admin/AdminEducation" element={<ProtectedRoute><AdminEducation /></ProtectedRoute>} />
<Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/recycling" element={<Recycling />} />
<Route path="/my-recycling" element={<MyRecycling />} />
<Route path="/recycling/:id" element={<RecyclingDetail />} />
<Route path="/profile" element={<Profile />} />
<Route path="/about" element={<About />} />
<Route path="/learn" element={<Learn />} />
<Route path="/education" element={<Education />} />
<Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        </Routes>
      </main>

      {!hideNavbar && <Footer />}
      {/* Show Test Mode Toggle on all pages except login */}
      {/* {!hideNavbar && <TestModeToggle />} */}
    </>
  );
}

function App() {
  return (
    <Router>
            <div className="flex flex-col min-h-screen">
      <AppWrapper />
      </div>
    </Router>
  );
}

export default App;
