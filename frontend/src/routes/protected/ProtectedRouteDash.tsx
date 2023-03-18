import { Link, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../misc/Spinner";
import ErrorNavbar from "../../components/ErrorNavbar";

function ProtectedRouteDash() {
  const { user, loading } = useAuth();
  const { uid } = useParams();

  if (loading) {
    return <Spinner />;
  } else if (user && user.uid === uid) {
    return <Outlet />;
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
export default ProtectedRouteDash;
