import { graphql, useStaticQuery } from "gatsby";

const useSiteMetadata = () => {
  const data: QueryData = useStaticQuery(query);
  return data.site.siteMetadata;
};

interface QueryData {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      siteUrl: string;
      author: {
        email: string;
        name: string;
        url: string;
      };
      social: {
        twitter: string;
        github: string;
        reddit: string;
        linkedin: string;
      };
    };
    pathPrefix: string;
  };
}

export const query = graphql`
  {
    site {
      siteMetadata {
        title
        description
        siteUrl
        author {
          email
          name
          url
        }
        social {
          twitter
          github
          reddit
          linkedin
        }
      }
      pathPrefix
    }
  }
`;

export default useSiteMetadata;
