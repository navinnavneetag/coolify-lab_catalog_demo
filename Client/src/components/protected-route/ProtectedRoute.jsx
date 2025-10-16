import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function ProtectedRoute({ children, auth = false }) {
  const token = localStorage.getItem("token");
  
  if(auth) {
    if (token) {
      return <Navigate to="/" />;
    }
  } else {
    if (!token) {
      return <Navigate to="/login" />;
    }
  }
  
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  auth: PropTypes.bool.isRequired,
};

export default ProtectedRoute;

