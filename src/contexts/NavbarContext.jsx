import { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

const NavbarContext = createContext();

const buttons = [
  { id: "tolet", label: "Home", path: "/" },
  { id: "convention", label: "Convention/Function Hall", path: "/convention" },
  { id: "resort", label: "Resort/Farm House", path: "/farm-resort" },
  { id: "hostel", label: "Hostel", path: "/hostel" },
];

const navItems = [
  { name: "Home", path: "/" },
  { name: "Convention/Function Hall", path: "/convention" },
  { name: "Resort/Farm House", path: "/farm-resort" },
  { name: "Hostel", path: "/hostel" },
  { name: "Support", path: "/support" },
  { name: "Profile", path: "/profile" },
];

export function NavbarProvider({ children }) {
  const [activeMain, setActiveMain] = useState("Home");
  const [activeButton, setActiveButton] = useState("tolet");
  const location = useLocation();

  // ✅ Sync with route changes
  useEffect(() => {
    const currentItem = navItems.find(
      (item) => item.path === location.pathname
    );

    if (currentItem) {
      setActiveMain(currentItem.name);

      // map main nav to button
      if (currentItem.name === "Home") setActiveButton("tolet");
      else if (currentItem.name === "Convention/Function Hall")
        setActiveButton("convention");
      else if (currentItem.name === "Resort/Farm House")
        setActiveButton("resort");
      else if (currentItem.name === "Hostel")
        setActiveButton("hostel");
      else setActiveButton(null); // for About, Support, Profile etc.
    }
  }, [location.pathname]);

  const handleButtonClick = (btn, navigate) => {
    setActiveButton(btn.id);
    setActiveMain(btn.label);

    if (navigate && typeof navigate === "function") {
      const buttonWithPath = buttons.find((b) => b.id === btn.id);
      if (buttonWithPath) {
        navigate(buttonWithPath.path);
      }
    }
  };

  return (
    <NavbarContext.Provider
      value={{
        activeMain,
        setActiveMain,
        activeButton,
        setActiveButton,
        buttons,
        handleButtonClick,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  return useContext(NavbarContext);
}
