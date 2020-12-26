import React, { useContext } from "react";
import { ThemeContext } from "../../hooks/themeContext";

import DarkThemeIcon from "../../images/icons/dark-theme.svg";

export const Toggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  function isDark() {
    return theme === "dark";
  }

  return (
    <DarkThemeIcon
      className="absolute top-24 md:top-8 right-10 md:right-16 fill-current text-primary h-6 w-6 z-50 cursor-pointer"
      onClick={() => {
        setTheme(isDark() ? "light" : "dark");
      }}
    />
  );
};
