// App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <div className="bg-white text-gray-900 dark:bg-background dark:text-white font-sans">
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
