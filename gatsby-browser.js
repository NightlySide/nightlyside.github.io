/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

import "./src/styles/custom.css";

import "./src/styles/global.css";

import "./src/styles/prism-material-dark.css";

import "./src/styles/prism-material-light.css";

import "gatsby-remark-mathjax-ssr/mathjax.css";

/* Why did you update */
import React from "react";

export const onClientEntry = () => {
  if (process.env.NODE_ENV !== "production") {
    const whyDidYouRender = require("@welldone-software/why-did-you-render");
    whyDidYouRender(React, {
      trackAllPureComponents: true,
    });
  }
};
