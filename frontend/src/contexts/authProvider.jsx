import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(sessionStorage.getItem("auth")) || false
  );

  const [user, setUser] = useState();

  useEffect(() => {
    sessionStorage.setItem("auth", isAuthenticated);
  }, [isAuthenticated]);

  const setAuth = (auth, navigate) => {
    setIsAuthenticated(auth);
    if (auth) {
      navigate("/");
    } else {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, setAuth, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
