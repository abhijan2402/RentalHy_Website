import { createContext, useState, useContext, useEffect } from "react";

const NavbarContext = createContext();

const buttons = [
  { id: "tolet", label: "To-Let", path: "/" },
  { id: "convention", label: "Convention/Function Hall", path: "/convention" },
  { id: "resort", label: "Resort/Farm House", path: "/farm-resort" },
];

export function NavbarProvider({ children }) {
  const [activeMain, setActiveMain] = useState("Home");
  const [activeButton, setActiveButton] = useState(null);

  // Sync activeButton if activeMain changes
  useEffect(() => {
    if (activeMain === "Home") setActiveButton("tolet");
    else if (activeMain === "Convention/Function Hall")
      setActiveButton("convention");
    else if (activeMain === "Resort/Farm House") setActiveButton("resort");
    else setActiveButton(null);
  }, [activeMain]);

  // Call this on button click from component, pass navigate explicitly
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
