import React from "react";

import MainLayout from "../components/core/main-layout";
import Head from "../components/core/head";
import ParticlesBackground from "../components/particles-background";
import PresentText from "../components/present-text";

import SpaceKnight from "../images/space_knight.svg";

const Index = () => {
  return (
    <MainLayout scrollable={false} showFooter={false}>
      <Head title="Accueil" keywords={[`blog`, `gatsby`, `javascript`, `react`]} />
      <ParticlesBackground />
      <div className="w-full flex">
        <PresentText />
        <SpaceKnight className="absolute bottom-0 -right-0 z-10 w-auto" style={{ height: "40vw" }} />
      </div>
    </MainLayout>
  );
};

export default Index;
