import React from "react";
import { useNavigate } from "@reach/router";
import useSiteMetaData from "../hooks/useSiteMetaData";

import send_svg from "../images/icons/send.svg";

const PresentText = () => {
  const navigate = useNavigate();
  const {
    author: { email },
  } = useSiteMetaData();

  return (
    <div className="relative h-screen w-full flex flex-col justify-center px-8 md:px-16 z-20">
      <h1 className="text-primary text-6xl font-bold leading-tight">
        Salut, <br />
        Je suis <span className="title-underline">Alexandre F.</span>
        <br />
        Ingénieur généraliste
      </h1>
      <h3 className="text-secondary text-2xl pt-3">
        Développeur Fullstack / Sécurité des Systèmes d’Information / Ingénierie Logicielle
      </h3>
    </div>
  );
};

export default PresentText;
