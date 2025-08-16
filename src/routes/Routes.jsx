import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";

import Landing from "../pages/Landing";
import Signin from "../pages/Auth/Signin";
import Signup from "../pages/Auth/Signup";
import Property from "../pages/Property";
import SupportPage from "../pages/SupportPage";
import AboutPage from "../pages/AboutPage";
import PropertyDetailsPage from "../pages/PropertyDetailsPage";
import Wishlist from "../pages/Wishlist";
import ProfilePage from "../pages/ProfilePage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/property" element={<Property />} />
        <Route path="/propertydetails/:id" element={<PropertyDetailsPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        {/* <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        /> */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
