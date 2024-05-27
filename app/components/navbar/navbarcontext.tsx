import React from "react";

export const NavbarContext = React.createContext({
  isVisible: true,
  setIsVisible: (isVisible: boolean) => {},
});
