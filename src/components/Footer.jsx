import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import logo from "../assets/clogo.png";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#7C0902] text-white pt-16 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div>
          <div className="cursor-pointer mb-4" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" className="h-14 w-28" />
          </div>
          <p className="text-sm mb-4">
            Helping you discover, buy, and rent premium properties across the
            city. Trusted by thousands for our transparency, local expertise,
            and customer-first approach.
          </p>
          <div className="text-sm">
            📍 123 Skyline Avenue, Downtown City, 560001
            <br />
            📞 +91-9876543210
            <br />
            📧 info@stayproperties.com
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li
              onClick={() => navigate("/")}
              className="hover:text-gray-300 transition cursor-pointer"
            >
              Home
            </li>
            <li
              onClick={() => navigate("/tickets")}
              className="hover:text-gray-300 transition cursor-pointer"
            >
              Tickets
            </li>
            <li
              onClick={() => navigate("/properties")}
              className="hover:text-gray-300 transition cursor-pointer"
            >
              Properties
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li
              onClick={() => navigate("/about")}
              className="hover:text-gray-300 transition cursor-pointer"
            >
              About
            </li>
            <li
              onClick={() => navigate("/privacy-policy")}
              className="hover:text-gray-300 transition cursor-pointer"
            >
              Privacy Policy
            </li>
            <li
              onClick={() => navigate("/terms-and-conditions")}
              className="hover:text-gray-300 transition cursor-pointer"
            >
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
          <div className="flex gap-4 text-2xl mt-2">
            <a href="#" className="hover:text-gray-300 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <FaSquareXTwitter />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <FaLinkedin />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-500 pt-6 text-center text-sm">
        © {new Date().getFullYear()} Stay Properties. All rights reserved.
      </div>
    </footer>
  );
}
