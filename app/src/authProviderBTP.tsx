import { useLocation, useHistory } from "@docusaurus/router";
import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import siteConfig from "@generated/docusaurus.config";

// const BTP_API = siteConfig.customFields.api_url as string;
const BTP_API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4004"
    : "https://btp-ai-best-practices-qa-qa-btp-ai-best-practices-srv.cfapps.eu10-005.hana.ondemand.com";

interface AuthContextProps {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => void;
  user: UserInfo | null;
}

interface UserInfo {
  ID: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  companyId: string[];
  type: string;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
  user: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState("");
  const location = useLocation();
  const history = useHistory();

  const login = async () => {
    // Redirect to login
    window.location.href = `${BTP_API}/user/login?origin_uri=${window.location.origin}`;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      login,
      logout,
      user,
    }),
    [isLoggedIn, login, logout, user]
  );

  useEffect(() => {
    if (token > "") {
      localStorage.setItem("token", token);
    } else if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, [token]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const responseUser = await fetch(`${BTP_API}/user/getUserInfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
        });
        console.log(responseUser);
        if (responseUser.ok) {
          const dataUser = await responseUser.json();
          console.log(dataUser);
          setUser(dataUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const params = new URLSearchParams(location.search);
    if (params.get("t") > "") {
      setToken(params.get("t"));
      history.replace("/");
    }

    console.log(`token: ${token}`);
    if (token > "") {
      getUserInfo();
    }
  }, [location, history, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
