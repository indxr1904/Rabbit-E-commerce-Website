import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../redux/slices/authSlice";

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    //  If no token → immediately invalidate and logout
    if (!token) {
      setIsValid(false);
      dispatch(logout());
      navigate("/login", { replace: true, state: { from: location.pathname } });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      // Token expired → logout + redirect
      if (decoded.exp && decoded.exp < now) {
        console.warn("⏰ Token expired — logging out...");
        dispatch(logout());
        setIsValid(false);
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
      } else {
        setIsValid(true);
      }
    } catch (error) {
      console.error("❌ Invalid token:", error);
      dispatch(logout());
      setIsValid(false);
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [token, dispatch, navigate, location.pathname]);

  //Show nothing while checking or redirecting
  if (!user || !token || !isValid || (role && user.role !== role)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
