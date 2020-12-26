import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { useLocation } from "@reach/router";

import avatar from "../../images/avatar.png";

import Home from "../../images/icons/home.svg";
import Code from "../../images/icons/code.svg";
import Picture from "../../images/icons/picture.svg";
import Cv from "../../images/icons/cv.svg";
import Letter from "../../images/icons/letter.svg";

import Github from "../../images/icons/github.svg";
import Twitter from "../../images/icons/twitter.svg";
import Reddit from "../../images/icons/reddit.svg";
import Linkedin from "../../images/icons/linkedin.svg";
import Tooltip from "./tooltip";

const NavBar = () => {
  const location = useLocation();
  const data: QueryData = useStaticQuery(query);

  const getLinkClasses = (pathToPage: string, fill: boolean, stroke: boolean) => {
    let res = "h-8 mx-auto md:w-8 hover:text-gray-400 transition-none";
    if (fill) res += " fill-current";
    if (stroke) res += " stroke-current";

    if (pathToPage == "" || pathToPage == "/") {
      if (location.pathname == "/" || location.pathname == "") res += " text-accent";
      else res += " text-white";
    } else {
      res += location.pathname.includes(pathToPage) ? " text-accent" : " text-white";
    }

    return res;
  };

  return (
    <div className="bg-navbar flex-grow-0 flex-shrink-0 flex flex-row md:flex-col h-16 md:h-screen md:w-16 z-10">
      <div className="bg-black text-center flex-grow-0 flex-shrink-0 w-16 h-16 md:h-24 flex flex-col items-center">
        <img src={avatar} className="w-16 h-16" alt="Author avatar" />
        <span className="hidden md:block text-gray-200 font-black py-3 transition-none">Alex</span>
      </div>

      <div className="flex flex-grow flex-row md:flex-col items-center max-w-96 md:max-w-full md:max-h-72 mx-auto md:my-auto justify-around px-7 md:px-0">
        <Tooltip tooltipText="Accueil">
          <Link to="/" className="flex-auto md:py-4 items-center">
            <Home className={getLinkClasses("/", true, false)} />
          </Link>
        </Tooltip>
        <Tooltip tooltipText="Projets">
          <Link to="/projects" className="flex-auto md:py-4">
            <Picture className={getLinkClasses("/projects", false, true)} />
          </Link>
        </Tooltip>
        <Tooltip tooltipText="Posts">
          <Link to="/posts" className="flex-auto md:py-4">
            <Code className={getLinkClasses("/posts", true, false)} />
          </Link>
        </Tooltip>
        <Tooltip tooltipText="CV">
          <Link to="/cv" className="flex-auto md:py-4">
            <Cv className={getLinkClasses("/cv", true, false)} />
          </Link>
        </Tooltip>
        <Tooltip tooltipText="Me contacter">
          <Link to="/" className="flex-auto md:py-4">
            <Letter className={getLinkClasses("/about", true, false)} />
          </Link>
        </Tooltip>
      </div>

      <div className="navbar-socials hidden md:flex flex-col items-center flex-grow flex-shrink-0 max-h-44">
        <a className="flex-auto" href={data.site.siteMetadata.social.github} target="_blank" rel="noopener">
          <Github className="w-6" />
        </a>
        <a className="flex-auto" href={data.site.siteMetadata.social.linkedin} target="_blank" rel="noopener">
          <Linkedin className="w-6" />
        </a>
        <a className="flex-auto" href={data.site.siteMetadata.social.reddit} target="_blank" rel="noopener">
          <Reddit className="w-6" />
        </a>
        <a className="flex-auto" href={data.site.siteMetadata.social.twitter} target="_blank" rel="noopener">
          <Twitter className="w-6" />
        </a>
      </div>
    </div>
  );
};

interface QueryData {
  site: {
    siteMetadata: {
      title: string;
      social: {
        github: string;
        linkedin: string;
        reddit: string;
        twitter: string;
      };
    };
  };
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        social {
          twitter
          github
          reddit
          linkedin
        }
      }
    }
  }
`;

export default NavBar;
