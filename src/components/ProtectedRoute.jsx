import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  console.log("🔒 ProtectedRoute Debug:");
  console.log("  - Token exists:", !!token);
  console.log("  - User:", user);
  console.log("  - Required Role:", requiredRole);

  if (!token) {
    console.log("❌ No token found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // For checkout, we don't need role check, just authentication
  if (requiredRole) {
    try {
      const decoded = jwt_decode(token);
      console.log("  - Decoded token:", decoded);
      console.log("  - User role:", decoded.role);
      
      if (decoded.role !== requiredRole) {
        console.log(`❌ Role mismatch. Required: ${requiredRole}, Got: ${decoded.role}`);
        return <Navigate to="/" replace />;
      }
    } catch (err) {
      console.error("❌ Invalid JWT:", err);
      return <Navigate to="/login" replace />;
    }
  }

  console.log("✅ Access granted");
  return children;
};

export default ProtectedRoute;