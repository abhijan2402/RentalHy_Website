import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/clogo.png";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const [sentOtp, setSentOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    username: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    password: "",
    password_confirmation: "",
  });

  const {
    signupEmail,
    emailData,
    emailError,
    emailLoading,
    verifyEmail,
    verifyData,
    verifyError,
    verifyLoading,
    completeSignup,
    completeData,
    completeError,
    completeLoading,
    userId,
    setUserId,
  } = useAuth();

  // Timer for OTP
  useEffect(() => {
    if (sentOtp && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [sentOtp, timer]);

  // Get user_id from OTP API and enable OTP step
  useEffect(() => {
    if (emailData && emailData.user_id) {
      setUserId(emailData.user_id);
      setSentOtp(true);
      setTimer(60);
    }
  }, [emailData, setUserId]);

  // If OTP verified, unlock submit button
  useEffect(() => {
    if (verifyData && (verifyData.message || verifyData.status === "success")) {
      setOtpVerified(true);
    }
  }, [verifyData]);

  // Validation
  useEffect(() => {
    // Email validation regex (simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    // Validate OTP length minimum 6 digits
    if (form.otp && form.otp.length < 6) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be at least 6 digits." }));
    } else {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }

    // Validate password minimum 8 chars
    if (form.password && form.password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    // Validate password confirmation matches password
    if (
      form.password_confirmation &&
      form.password_confirmation !== form.password
    ) {
      setErrors((prev) => ({
        ...prev,
        password_confirmation: "Passwords do not match.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password_confirmation: "" }));
    }
  }, [form.email, form.otp, form.password, form.password_confirmation]);

  // Handlers
  const handleSendOtp = (e) => {
    e.preventDefault();
    signupEmail(form.email);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    verifyEmail({ user_id: userId, verification_code: form.otp });
  };

  const handleResendOtp = () => {
    signupEmail(form.email);
    setTimer(60);
    setOtpVerified(false);
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    // Only proceed if no validation errors
    if (!otpVerified) return;
    if (errors.otp || errors.password || errors.password_confirmation) return;
    console.log({
      user_id: userId,
      phone_number: form.phone_number,
      password: form.password,
      password_confirmation: form.password_confirmation,
      username: form.username,
    });
    completeSignup({
      user_id: userId,
      phone_number: form.phone_number,
      password: form.password,
      password_confirmation: form.password_confirmation,
      username: form.username,
    });

    if (completeData && completeData.message) {
      toast.success(completeData?.message || "Signup Completed successfully");
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 max-w-xl mx-auto">
        <nav className="mb-8 flex items-center text-sm text-gray-500 space-x-1">
          <Link to="/" className="hover:text-[#7C0902]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#7C0902] font-semibold">Sign Up</span>
        </nav>

        {/* Logo for mobile */}
        <div className="mb-8 md:hidden flex flex-col items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-16 md:h-20 mb-4 drop-shadow-xl"
            style={{ objectFit: "contain" }}
          />
          <p className="text-[#7C0902] text-lg font-semibold">Join Us Today!</p>
        </div>

        <div className="bg-white rounded-lg w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-[#7C0902]">
            Create Your Account
          </h2>
          <form onSubmit={handleCompleteSubmit} className="space-y-5">
            {/* Email & Send OTP */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Email
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="example123@gmail.com"
                  className={`w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-[#7C0902] transition ${
                    errors.email ? "border-red-600" : ""
                  }`}
                  disabled={sentOtp}
                />
              </div>
              {errors.email && <p className="text-red-600">{errors.email}</p>}
              {!sentOtp && (
                <div className="flex justify-end py-2">
                  <button
                    type="button"
                    className="bg-[#7C0902] text-white py-1 px-3 cursor-pointer text-[16px] rounded font-semibold hover:bg-[#600601] transition-colors text-sm"
                    onClick={handleSendOtp}
                    disabled={
                      emailLoading || sentOtp || !form.email || !!errors.email
                    }
                  >
                    {emailLoading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              )}
              {emailError && (
                <p className="text-red-600">
                  {emailError?.data?.message || "Email request failed"}
                </p>
              )}
            </div>

            {/* OTP & Verify button - show after OTP is sent */}
            {sentOtp && (
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Enter OTP
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={form.otp}
                    onChange={(e) => setForm({ ...form, otp: e.target.value })}
                    required={!otpVerified}
                    placeholder="Enter OTP"
                    disabled={otpVerified}
                    className={`w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-[#7C0902] transition ${
                      errors.otp ? "border-red-600" : ""
                    }`}
                  />
                </div>
                {errors.otp && <p className="text-red-600">{errors.otp}</p>}
                <div className="flex justify-between p-2 ">
                  <button
                    type="button"
                    className="text-[#7C0902] text-[16px] font-medium underline ml-2"
                    onClick={handleResendOtp}
                    disabled={timer > 0}
                  >
                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                  </button>
                  {!otpVerified && (
                    <button
                      type="button"
                      className="bg-[#7C0902] text-white py-1 px-4 cursor-pointer rounded font-semibold hover:bg-[#600601] transition-colors text-sm"
                      onClick={handleVerifyOtp}
                      disabled={verifyLoading || !form.otp || !!errors.otp}
                    >
                      {verifyLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  )}
                </div>
                {verifyError && (
                  <p className="text-red-600">
                    {verifyError?.data?.message || "Invalid OTP"}
                  </p>
                )}
                {otpVerified && (
                  <p className="text-green-600">
                    OTP Verified! Continue registration.
                  </p>
                )}
              </div>
            )}

            {/* Remaining fields - phone, password, confirm password */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                placeholder="Rohan"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                disabled={!otpVerified}
                className="w-full px-4 py-2 border text-black rounded focus:outline-none focus:ring-2 focus:ring-[#7C0902] transition"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Phone Number
              </label>
              <input
                type="text"
                value={form.phone_number}
                placeholder="XXXXXXXX67"
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
                required
                disabled={!otpVerified}
                className="w-full px-4 py-2 border text-black rounded focus:outline-none focus:ring-2 focus:ring-[#7C0902] transition"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                placeholder="******"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                disabled={!otpVerified}
                className={`w-full px-4 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-[#7C0902] transition ${
                  errors.password ? "border-red-600" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.password_confirmation}
                placeholder="******"
                onChange={(e) =>
                  setForm({ ...form, password_confirmation: e.target.value })
                }
                required
                disabled={!otpVerified}
                className={`w-full px-4 py-2 border text-black rounded focus:outline-none focus:ring-2 focus:ring-[#7C0902] transition ${
                  errors.password_confirmation ? "border-red-600" : ""
                }`}
              />
              {errors.password_confirmation && (
                <p className="text-red-600">{errors.password_confirmation}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={
                !otpVerified ||
                completeLoading ||
                !!errors.otp ||
                !!errors.password ||
                !!errors.password_confirmation
              }
              className={`w-full text-[16px] py-3 rounded-md font-semibold  shadow transition-colors ${
                !otpVerified || completeLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#7C0902] hover:bg-[#600601] text-white"
              }`}
            >
              {completeLoading ? "Signing..." : "Signup"}
            </button>
            {completeError && (
              <p className="text-red-600">
                {completeError?.data?.errors || "Signup failed"}
              </p>
            )}
          </form>
          <p className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-[#7C0902] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right-side image/overlay */}
      <div className="hidden md:flex w-1/2 relative bg-gray-100">
        <img
          alt="Signup background"
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
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
            Become a Member
          </h1>
          <p className="max-w-md text-lg md:text-xl font-medium drop-shadow-md">
            Sign up to explore exclusive property listings, save your favorites,
            and connect with agents.
          </p>
        </div>
      </div>
    </div>
  );
}
