import React from "react";
import { ThemeProvider } from "../../hooks/themeContext";
import Footer from "./footer";

import Navbar from "./navbar";
import { Toggle } from "./theme-toggle";

interface MainLayoutProps {
  readonly title?: string;
  readonly children: React.ReactNode;
  readonly scrollable?: boolean;
  readonly showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, scrollable, showFooter }) => {
  if (scrollable == undefined) scrollable = true;
  if (showFooter == undefined) showFooter = true;

  return (
    <ThemeProvider>
      <div className="bg-primary flex flex-col md:flex-row overflow-hidden h-screen" style={{ zIndex: -1 }}>
        <Toggle />
        <Navbar />
        <main className="overflow-y-auto flex-1">
          {children}
          {showFooter && <Footer />}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
