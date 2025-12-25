import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { restoreAuth, logout } from "../store/slices/authSlice";
import { BACKEND_BASE_URL } from "../utils/constant";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyAuth = async () => {
      if (isAuthenticated) {
        try {
          const res = await fetch(`${BACKEND_BASE_URL}/verify-token`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!res.ok) {
            dispatch(logout());
          }
        } catch (error) {
          console.error("Auth verification failed:", error);
        }
      }
    };

    verifyAuth();
  }, [dispatch, isAuthenticated]);

  return children;
};

export default AuthInitializer;
