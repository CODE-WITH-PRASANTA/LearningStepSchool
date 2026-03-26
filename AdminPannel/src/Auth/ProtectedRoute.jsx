import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // ✅ Get admin safely
  const isAdmin = localStorage.getItem("isAdmin");

  // 🔐 Convert to boolean (important)
  const isAuthenticated = isAdmin === "true";

  // ❌ Not logged in → redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // 🔥 remember previous page
      />
    );
  }

  // ✅ Logged in → allow access
  return children;
};

export default ProtectedRoute;