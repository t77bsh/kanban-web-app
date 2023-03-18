import ErrorNavbar from "../components/ErrorNavbar";
import Spinner from "../misc/Spinner";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";

function Dashboard() {

  // Contexts Hook
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  } else if (user) {
    return <Navigate to="/" />;
  } else {
    return (
      <>
        <ErrorNavbar />
        <div className="page-center text-lg">
          Error: Sorry this page is private, try{" "}
          <Link to="/login">logging in</Link> to your account.
        </div>
      </>
    );
  }
}

export default Dashboard;