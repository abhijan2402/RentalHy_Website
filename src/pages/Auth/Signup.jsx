import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import logo from "../../assets/clogo.png";

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(form.email, form.password);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 max-w-xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center text-sm text-gray-500 space-x-1">
          <Link to="/home" className="hover:text-[#7C0902]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#7C0902] font-semibold">Sign Up</span>
        </nav>

        <div className="mb-8 md:hidden flex flex-col items-center">
          {/* Logo on mobile */}
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C0902] transition"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C0902] transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#7C0902] text-white py-3 rounded-md font-semibold hover:bg-[#600601] transition-colors text-lg shadow"
            >
              Sign Up
            </button>
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

      {/* Right: Image + Overlay (desktop only) */}
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
