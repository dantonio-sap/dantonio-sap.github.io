import React, { createContext, useState, useContext, useEffect } from "react";

const BTP_API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://btp-ai-best-practices-qa-qa-btp-ai-best-practices-app.cfapps.eu10-005.hana.ondemand.com";

interface AuthContextProps {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => void;
  user: UserInfo | null;
}

interface UserInfo {
  firstName: string;
  lastName: string;
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

  const login = async () => {
    // Redirect to login
    window.location.href = `${BTP_API}/user/login?origin_uri=${window.location.origin}`;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    // Redirect to logout
    window.location.href = `${BTP_API}/logout`;
  };

  const value = {
    isLoggedIn,
    login,
    logout,
    user,
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const responseUser = await fetch(`${BTP_API}/user/getUserInfo`, {
          credentials: "include",
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
    getUserInfo();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
