import { createContext, useState, useEffect, ReactNode } from "react";
import { useHistory } from "react-router-dom";
import authService from "../services/AuthService";
import { USER_ROUTES } from "../services/Apis";
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading";
import UserModel from "../models/UserModel";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserModel | null;
  authTokens: string | null;
  setAuthTokens: (tokens: string | null) => void;
  setUser: (user: UserModel | null) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  authTokens: null,
  setAuthTokens: function (tokens: string | null): void {
    throw new Error("Function not implemented.");
  },
  setUser: function (user: UserModel | null): void {
    throw new Error("Function not implemented.");
  },
  logoutUser: function (): void {
    throw new Error("Function not implemented.");
  },
});

export default AuthContext;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authTokens, setAuthTokens] = useState<string | null>(null);
  const [user, setUser] = useState<UserModel | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setIsLoading] = useState(true);

  const history = useHistory();

  const handleInvalidToken = () => {
    setUser(null);
    setAuthTokens(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authTokens");
  };

  const logoutUser = () => {
    handleInvalidToken();
    history.push("/login");
  };

  useEffect(() => {
    // useEffect with empty dependency array will only be called at the initial mount
    // page refresh is treated as re-render of the existing component not initial mount
    const token: string | null = localStorage.getItem("authTokens");
    // instead of storing user in localStorage
    // always get user from backend
    const fetchUser = async (token: string) => {
      const rsp = await fetch(USER_ROUTES.refreshUser, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!rsp.ok) {
        handleInvalidToken();
      } else {
        const data = await rsp.json();
        const user = data.data;
        setUser(new UserModel(user.id, user.username, user.email));
        setIsLoading(false);
        setIsAuthenticated(true);
        setAuthTokens(token);
      }
    };

    if (authService.validateToken(token)) {
      fetchUser(token!).catch((error: any) => {
        handleInvalidToken();
        console.log("fetch user fail: ", error);
      });
    } else {
      handleInvalidToken();
      setIsLoading(false);
    }
  }, []);

  let contextData: AuthContextType = {
    isAuthenticated: isAuthenticated,
    user: user,
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <SpinnerLoading /> : children}
    </AuthContext.Provider>
  );
};
