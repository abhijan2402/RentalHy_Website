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
          theme="colored"
          transition={Slide}
          toastClassName="custom-toast"
        />
      </LocationProvider>
    </Provider>
  </StrictMode>
);

// import { StrictMode, useEffect, useState } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Provider } from "react-redux";
// import { store } from "./redux/store/store.js";
// import FlagLoader from "./components/FlagLoader/FlagLoader.jsx";

// function RootApp() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // simulate app/data loading
//     const timer = setTimeout(() => setLoading(false), 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <FlagLoader />
//       ) : (
//         <>
//           <App />
//           <ToastContainer
//             position="bottom-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme="colored"
//           />
//         </>
//       )}
//     </>
//   );
// }

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Provider store={store}>
//       <RootApp />
//     </Provider>
//   </StrictMode>
// );
