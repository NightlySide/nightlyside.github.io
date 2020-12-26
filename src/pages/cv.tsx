import React from "react";
import { withPrefix } from "gatsby";
import "react-pdf/dist/umd/Page/AnnotationLayer.css";

import MainLayout from "../components/core/main-layout";
import Head from "../components/core/head";

const CV = () => {
  return (
    <MainLayout showFooter={false}>
      <Head title="CV" />
      <object data={withPrefix("/cv.pdf")} type="application/pdf" className="w-full h-screen">
        <embed src={withPrefix("/cv.pdf")} type="application/pdf" />
      </object>
    </MainLayout>
  );
};

export default CV;
