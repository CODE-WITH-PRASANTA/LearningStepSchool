import { Navigate } from "react-router-dom";

const PermissionRoute = ({ children, permission }) => {
  const user = JSON.parse(localStorage.getItem("teacher"));
  const token = localStorage.getItem("token");

  // ❌ not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  const userPermissions = user?.permissions || [];

  // ✅ admin full access
  if (userPermissions.includes("ALL")) {
    return children;
  }

  // ❌ no permission
  if (!userPermissions.includes(permission)) {
    return <Navigate to="/unauthorized" />;
  }

  // ✅ allowed
  return children;
};

export default PermissionRoute;