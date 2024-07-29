// AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, user_uuid: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const getAccessLevel = (username: string) => {
    switch (username.toLowerCase()) {
      case "admin":
        return "1";
      case "bendahara1":
        return "2";
      case "bendahara2":
        return "3";
      default:
        return "4";
    }
  };

  const login = (username: string, user_uuid: string, token: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("username", username);
    console.log(1);
    localStorage.setItem("user_uuid", user_uuid);
    console.log(2);
    localStorage.setItem("token", token);
    console.log(3);
    localStorage.setItem("access_level", getAccessLevel(username));
    console.log(4);
    navigate("/dashboard");
    console.log(5);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
