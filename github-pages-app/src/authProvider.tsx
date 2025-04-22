import { useLocation } from "@docusaurus/router";
import React, { createContext, useState, useContext, useEffect } from "react";

const BTP_XSUAA_CONFIG = {
  authorizeUrl: "https://github-pages-cd1iy27i.authentication.eu11.hana.ondemand.com/oauth/authorize",
  tokenUrl: "https://github-pages-cd1iy27i.authentication.eu11.hana.ondemand.com/oauth/token",
  userInfoUrl: "https://github-pages-cd1iy27i.authentication.eu11.hana.ondemand.com/userinfo",
  clientId: "sb-github-pages-auth!t26957",
  clientSecret: "5c52cace-305e-42ac-9661-2817d17d9ae3$eEuKcqDGgysUx7w4568oPW7KJTyvZzbJeE7ZbbC8IC4=",
};

interface AuthContextProps {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => void;
  user: UserInfo | null;
}

interface UserInfo {
  name: string;
  email: string;
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
  const location = useLocation();

  const login = async () => {
    // Redirect to AuthoriszeUrl
    window.location.href = `${BTP_XSUAA_CONFIG.authorizeUrl}?response_type=code&client_id=${BTP_XSUAA_CONFIG.clientId}&redirect_uri=${window.location.origin}`;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("access_token");
  };

  const value = {
    isLoggedIn,
    login,
    logout,
    user,
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(BTP_XSUAA_CONFIG.tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code || "",
            redirect_uri: `${window.location.origin}`,
            client_id: BTP_XSUAA_CONFIG.clientId,
            client_secret: BTP_XSUAA_CONFIG.clientSecret,
          }),
        });
        const json = await response.json();
        localStorage.setItem("access_token", json.access_token);
        window.location.href = "/";
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    if (code) {
      getToken();
    }
  }, [location]);

  useEffect(() => {
    const getUserInfo = async (token: string) => {
      try {
        const responseUser = await fetch(BTP_XSUAA_CONFIG.userInfoUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const dataUser = await responseUser.json();
        setUser(dataUser); // Assuming the user info contains a 'name' field
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      getUserInfo(storedToken);
    }
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
