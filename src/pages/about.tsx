import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/core/main-layout";
import Head from "../components/core/head";

interface Props {
  readonly data: PageQueryData;
}

const About: React.FC<Props> = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <Head title="All tags" keywords={[`blog`, `gatsby`, `javascript`, `react`]} />
      <article>About moi même...</article>
    </Layout>
  );
};

interface PageQueryData {
  site: {
    siteMetadata: {
      title: string;
    };
  };
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default About;
