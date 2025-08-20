import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import logo from "../../assets/clogo.png";

export default function Signin() {
  const { login, loginLoading, loginError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Simple email regex for validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate fields and set errors
  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Track touched fields
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Validate on each change if field is touched
    if (touched[e.target.name]) {
      validate();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      login(form.email, form.password);
    }
  };

  // Determine if form is valid to enable submit
  const isFormValid = () => {
    return validate();
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 max-w-xl mx-auto">
        <nav className="mb-8 flex items-center text-sm text-gray-500 space-x-1">
          <Link to="/" className="hover:text-[#7C0902]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#7C0902] font-semibold">Sign In</span>
        </nav>

        {/* Logo for mobile */}
        <div className="mb-8 md:hidden flex flex-col items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-16 md:h-20 mb-4 drop-shadow-xl"
            style={{ objectFit: "contain" }}
          />
          <p className="text-[#7C0902] text-lg font-semibold">Welcome Back!</p>
        </div>

        <div className="bg-white rounded-lg w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-[#7C0902]">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                required
                className={`w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 transition ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "focus:ring-[#7C0902]"
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  required
                  className={`w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 transition ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "focus:ring-[#7C0902]"
                  }`}
                />
                <span
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-2.5 cursor-pointer text-gray-500 select-none"
                  tabIndex={0}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="#7C0902"
                        strokeWidth="2"
                        d="M3 3l18 18M17.94 17.94C16.11 18.88 14.11 19.39 12 19.39c-4.42 0-8.08-3.11-9.31-7.39A9.98 9.98 0 0 1 12 4.61c2.33 0 4.45.8 6.17 2.13M21 21l-1.06-1.06"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="#7C0902"
                        strokeWidth="2"
                        d="M1 12s3.53-6.47 11-6.47c7.47 0 11 6.47 11 6.47s-3.53 6.47-11 6.47c-7.47 0-11-6.47-11-6.47z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#7C0902"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full text-[16px] py-3 rounded-md font-semibold shadow transition-colors ${
                Object.keys(errors).length === 0 && form.email && form.password
                  ? "bg-[#7C0902] hover:bg-[#600601] text-white"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={
                Object.keys(errors).length > 0 ||
                !form.email ||
                !form.password ||
                loginLoading
              }
            >
              {loginLoading ? "Signing In..." : "Sign In"}
            </button>
            {/* {loginError && (
              <p className="text-red-600 mt-2">
                {loginError?.data?.message || "Login failed"}
              </p>
            )} */}
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#7C0902] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Image + Logo/Subheading Overlay (hidden on mobile) */}
      <div className="hidden md:flex w-1/2 relative bg-gray-100">
        <img
          alt="property background"
          src="https://www.michaelzingraf.com/storage/images/xOWyG9KJ1jqmMPFgv1KoscsYpkoQ0lCDD2WTi8WE.jpeg"
          className="w-full h-full object-cover"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#000]/50 to-black/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-10">
          <img
            src={logo}
            alt="Logo"
            className="h-16 md:h-20 mb-4 drop-shadow-xl"
            style={{ objectFit: "contain" }}
          />
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to TO-LET INDIA
          </h1>
          <p className="max-w-md text-lg md:text-xl font-medium drop-shadow-md">
            Sign in to access your saved properties, personalized
            recommendations, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
