import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  console.log(user);

  // Mock login (replace with API)
  const login = (email, password) => {
    // API logic here...
    setUser({ email });
    navigate("/");
  };

  const signup = (email, password) => {
    // API signup logic here...
    setUser({ email });
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
