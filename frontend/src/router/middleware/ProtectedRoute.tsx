// ProtectedRoute.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { checkToken } from "../../api";

interface ProtectedRouteProps {
  children: JSX.Element;
  thisLogin?: boolean;
}

export const isTokenValid = async (): Promise<boolean> => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const response = await checkToken();
    if (response.status == 200) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Token validation error", error);
    return false;
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  thisLogin = false,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const check = async () => {
    const valid = await isTokenValid();
    if (!valid) {
      logout();
    } else if (thisLogin) {
      navigate("/dashboard");
    }
  };

  check();
  return children;
};

export default ProtectedRoute;
