import { createContext, useContext, useEffect, useState } from "react";
import decodeToken from "./User";

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to handle the auth check

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser);
      } else {
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // Authentication check is complete
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedUser = decodeToken(token);
    setUser(decodedUser);
    setLoading(false); // No longer loading after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false); // No longer loading after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
