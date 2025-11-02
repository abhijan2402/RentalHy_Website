import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useSignupEmailMutation,
  useVerifyEmailMutation,
  useCompleteSignupMutation,
  useLoginMutation, // import login mutation hook
} from "../redux/api/authApi";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  // console.log(user);

  // Signup mutations
  const [
    signupEmail,
    { data: emailData, error: emailError, isLoading: emailLoading },
  ] = useSignupEmailMutation();

  const [
    verifyEmail,
    { data: verifyData, error: verifyError, isLoading: verifyLoading },
  ] = useVerifyEmailMutation();

  const [
    completeSignup,
    { data: completeData, error: completeError, isLoading: completeLoading },
  ] = useCompleteSignupMutation();

  // Login mutation
  const [
    loginMutation,
    { data: loginData, error: loginError, isLoading: loginLoading },
  ] = useLoginMutation();

  // Login handler using loginMutation
  const login = async (email, password) => {
    try {
      const result = await loginMutation({ email, password }).unwrap();
      console.log(result.msg);
      if (result.token) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        navigate("/");
        toast.success("Login Successfully..!!");
      }
    } catch (err) {
      const errorMsg =
        err?.data?.msg || err?.msg || err?.error || "Something went wrong !!";
      toast.error(errorMsg);
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        setUserId,
        user,
        setUser,
        signupEmail,
        verifyEmail,
        completeSignup,
        emailData,
        emailError,
        emailLoading,
        verifyData,
        verifyError,
        verifyLoading,
        completeData,
        completeError,
        completeLoading,
        login,
        loginError,
        loginLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
