import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, roles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some(role => user.roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
