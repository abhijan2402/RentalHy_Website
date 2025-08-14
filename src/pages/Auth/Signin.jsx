import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Signin() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form.email, form.password);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 max-w-xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center text-sm text-gray-500 space-x-1">
          <Link to="/" className="hover:text-[#7C0902]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#7C0902] font-semibold">Sign In</span>
        </nav>

        <div className="mb-8 md:hidden flex flex-col items-center">
          {/* Logo (shown on mobile above form, right side will show on desktop) */}
          <img
            src="/logo.png"
            alt="Property Logo"
            className="h-12 mb-2"
            style={{ objectFit: "contain" }}
          />
          <p className="text-[#7C0902] text-lg font-semibold">Welcome Back!</p>
        </div>

        <div className="bg-white rounded-lg w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-[#7C0902]">
            Sign In to Your Account
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
              Sign In
            </button>
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
          {/* <img
            src="/logo.png"
            alt="Logo"
            className="h-16 md:h-20 mb-4 drop-shadow-xl"
            style={{ objectFit: "contain" }}
          /> */}
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome toTO-LET INDIA
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
