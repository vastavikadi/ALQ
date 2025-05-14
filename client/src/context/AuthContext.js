import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store user info
  const [token, setToken] = useState(null); // store token

  // 🔁 On app load, retrieve user & token from localStorage if present
  useEffect(() => {
    const storedUser = localStorage.getItem("algoquest-user");
    const storedToken = localStorage.getItem("algoquest-token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // ✅ Login with option to remember user
  const login = (userData, authToken, remember = false) => {
    setUser(userData);
    setToken(authToken);

    if (remember) {
      localStorage.setItem("algoquest-user", JSON.stringify(userData));
      localStorage.setItem("algoquest-token", authToken);
    }
  };

  // 🧹 Logout and clear localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("algoquest-user");
    localStorage.removeItem("algoquest-token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
