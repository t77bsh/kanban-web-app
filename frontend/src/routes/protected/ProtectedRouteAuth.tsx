import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../misc/Spinner";

function ProtectedRouteAuth() {
  const { user, loading } = useAuth();
  if (loading) {
    return <Spinner />;
  } else if (user) {
    return <Navigate to={`/${user.uid}`} />;
  } else {
    return <Outlet />;
  }
}

export default ProtectedRouteAuth;

// This protects the login and register routes