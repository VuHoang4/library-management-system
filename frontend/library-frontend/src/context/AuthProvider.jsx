import { useState } from "react";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser || savedUser === "undefined") return null;

      return JSON.parse(savedUser);
    } catch (e) {
      console.log("Parse error:", e);
      return null;
    }
  });

  const login = (data) => {
  
  const userData = data.user;

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(userData));

  setUser(userData);
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;