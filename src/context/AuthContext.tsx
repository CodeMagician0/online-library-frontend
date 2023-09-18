import { createContext, useState, useEffect, ReactNode } from "react";
import { useHistory } from "react-router-dom";
import authService from "../services/AuthService";
import { USER_ROUTES } from "../services/Apis";
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading";
import UserModel from "../models/UserModel";

interface AuthContextType {
  user: UserModel | null;
  authTokens: string | null;
  loading: boolean;
  setAuthTokens: (tokens: string | null) => void;
  setUser: (user: UserModel | null) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authTokens: null,
  loading: true,
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
  const [loading, setIsLoading] = useState(true);

  const history = useHistory();

  const handleInvalidToken = () => {
    setUser(null);
    setAuthTokens(null);
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
    if (authService.validateToken(token)) {
      setAuthTokens(token);
    }

    // instead of storing user in localStorage
    // refresh user information after page refresh or initial mount
    const fetchUser = async () => {
      console.log("Authorization: ", authTokens);
      const rsp = await fetch(USER_ROUTES.refreshUser, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens}`,
        },
      });

      if (!rsp.ok) {
        handleInvalidToken();
      } else {
        const data = await rsp.json();
        const user = data.data;
        setUser(new UserModel(user.id, user.username, user.email));
      }
    };

    if (authTokens) {
      fetchUser().catch((error: any) => {
        handleInvalidToken();
        console.log("fetch user fail: ", error);
      });
    }

    setIsLoading(false);
  }, [loading]);

  let contextData: AuthContextType = {
    user: user,
    authTokens: authTokens,
    loading: loading,
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
