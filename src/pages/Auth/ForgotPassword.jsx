import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/clogo.png";
import { useForgotPasswordMutation, useResetForgotPasswordMutation, useVerifyForgotPasswordMutation } from "../../redux/api/authApi";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // API hooks
  const [forgotPassword, { isLoading: loadingStep1 }] =
    useForgotPasswordMutation();
  const [verifyForgotPassword, { isLoading: loadingStep2 }] =
    useVerifyForgotPasswordMutation();
  const [resetForgotPassword, { isLoading: loadingStep3 }] =
    useResetForgotPasswordMutation();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 🧩 Validation
  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Invalid email";

    if (step >= 2 && !form.otp) newErrors.otp = "OTP is required";
    if (step === 3) {
      if (!form.newPassword) newErrors.newPassword = "Password is required";
      else if (form.newPassword.length < 8)
        newErrors.newPassword = "Password must be at least 8 characters";
      if (form.newPassword !== form.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🪄 Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await forgotPassword(form.email).unwrap();
      toast(res?.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast(err?.data?.message || "Failed to send OTP");
    }
  };

  // 🪄 Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await verifyForgotPassword({
        email: form.email,
        otp: form.otp,
      }).unwrap();
      toast(res?.message || "OTP verified successfully");
      setStep(3);
    } catch (err) {
      toast(err?.data?.message || "Invalid OTP or expired");
    }
  };

  // 🪄 Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await resetForgotPassword({
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      }).unwrap();
      toast(res?.message || "Password reset successful");
      window.location.href = "/signin";
    } catch (err) {
      toast(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 max-w-xl mx-auto">
        <nav className="mb-8 flex items-center text-sm text-gray-500 space-x-1">
          <Link to="/" className="hover:text-[#7C0902]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#7C0902] font-semibold">Forgot Password</span>
        </nav>

        {/* Mobile Logo */}
        <div className="mb-8 md:hidden flex flex-col items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-16 md:h-20 mb-4 drop-shadow-xl"
            style={{ objectFit: "contain" }}
          />
          <p className="text-[#7C0902] text-lg font-semibold">
            Reset Your Password
          </p>
        </div>

        <div className="bg-white rounded-lg w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-[#7C0902]">
            {step === 1
              ? "Forgot Password"
              : step === 2
              ? "Verify OTP"
              : "Set New Password"}
          </h2>

          <form
            onSubmit={
              step === 1
                ? handleEmailSubmit
                : step === 2
                ? handleVerifyOtp
                : handleResetPassword
            }
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
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

            {/* OTP - Step 2 & 3 */}
            {step >= 2 && (
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 transition ${
                    errors.otp
                      ? "border-red-500 focus:ring-red-200"
                      : "focus:ring-[#7C0902]"
                  }`}
                />
                {errors.otp && (
                  <p className="text-red-600 text-sm mt-1">{errors.otp}</p>
                )}
              </div>
            )}

            {/* New Password - Step 3 */}
            {step === 3 && (
              <>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 transition ${
                      errors.newPassword
                        ? "border-red-500 focus:ring-red-200"
                        : "focus:ring-[#7C0902]"
                    }`}
                  />
                  {errors.newPassword && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 transition ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-200"
                        : "focus:ring-[#7C0902]"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loadingStep1 || loadingStep2 || loadingStep3}
              className="w-full text-[16px] py-3 rounded-md font-semibold shadow bg-[#7C0902] hover:bg-[#600601] text-white transition-colors"
            >
              {loadingStep1 || loadingStep2 || loadingStep3
                ? "Processing..."
                : step === 1
                ? "Send OTP"
                : step === 2
                ? "Verify OTP"
                : "Reset Password"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Remember your password?{" "}
            <Link
              to="/signin"
              className="text-[#7C0902] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image */}
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
            Forgot Password Flow
          </h1>
          <p className="max-w-md text-lg md:text-xl font-medium drop-shadow-md">
            Verify your email, confirm OTP, and reset your password securely.
          </p>
        </div>
      </div>
    </div>
  );
}
