import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.js";
import { LocationProvider } from "./contexts/LocationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <LocationProvider>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Slide}
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
        />
      </LocationProvider>
    </Provider>

    {/* Theme-based Toast styling */}
    <style>
      {`
        .custom-toast {
          background-color: #ffffff !important;
          border-left: 6px solid #EE4E34 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-radius: 12px !important;
          color: #333 !important;
          font-family: 'Poppins', sans-serif;
          padding: 10px 12px !important;
        }

        .custom-toast-body {
          font-size: 15px;
          font-weight: 500;
          color: #222;
        }

        .Toastify__progress-bar {
          background: #EE4E34 !important;
        }

        .Toastify__close-button {
          color: #EE4E34 !important;
          opacity: 0.8;
        }

        .Toastify__close-button:hover {
          opacity: 1;
        }

        /* Success toast */
        .Toastify__toast--success {
          border-left: 6px solid #28a745 !important;
        }

        /* Error toast */
        .Toastify__toast--error {
          border-left: 6px solid #dc3545 !important;
        }

        /* Info toast */
        .Toastify__toast--info {
          border-left: 6px solid #17a2b8 !important;
        }

        /* Warning toast */
        .Toastify__toast--warning {
          border-left: 6px solid #ffc107 !important;
        }
      `}
    </style>
  </StrictMode>
);
