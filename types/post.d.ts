export interface PostQueryData {
  site: {
    siteMetadata: {
      title: string;
      author: {
        name: string;
        email: string;
      };
    };
  };
  allMarkdownRemark: {
    edges: {
      node: {
        excerpt: string;
        fields: {
          slug: string;
        };
        frontmatter: {
          date: string;
          title: string;
          slug: string;
          tags: string[];
          layout: string;
          published: boolean;
          image: any;
        };
      };
    }[];
  };
}

export interface Post {
  excerpt: string;
  html?: string;
  tableOfContents?: string;
  timeToRead?: number;
  fields: {
    slug: string;
  };
  frontmatter: {
    date: string;
    title: string;
    slug: string;
    tags: string[];
    layout: string;
    published: boolean;
    image: any;
  };
  headings?: {
    value: string;
    depth: number;
    id: string;
  }[];
}
