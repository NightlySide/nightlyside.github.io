import React from "react";
import Img from "gatsby-image";
import { Link, graphql } from "gatsby";

import MainLayout from "../components/core/main-layout";
import Head from "../components/core/head";
import TableOfContents from "../components/post/table-of-contents";
import { Post } from "../../types/post";

import "../styles/post.css";

interface Props {
  readonly data: PageQueryData;
  readonly pageContext: {
    previous?: any;
    next?: any;
  };
}

const ProjectTemplate: React.FC<Props> = ({ data, pageContext }) => {
  const post = data.markdownRemark;

  return (
    <MainLayout>
      <Head title={post.frontmatter.title} description={post.excerpt} />
      <Img
        fluid={post.frontmatter.image.childImageSharp.fluid}
        alt={`${post.frontmatter.title} header image`}
        className="max-h-48"
      />
      <article className="container m-auto px-5 sm:px-12 md:px-20 max-w-screen-xl">
        <div className="flex justify-between my-12 relative">
          <main className="prose md:prose-lg">
            <header className="mb-4">
              <p className="text-sm text-secondary">
                {post.frontmatter.date} • {post.timeToRead} min de lecture
              </p>
              <h1 className="text-primary text-4xl font-black tracking-tight">{post.frontmatter.title}</h1>
            </header>
            <div>
              <div className="post" dangerouslySetInnerHTML={{ __html: post.html as string }} />
            </div>
          </main>
          <TableOfContents post={post} />
        </div>
      </article>
    </MainLayout>
  );
};

interface PageQueryData {
  site: {
    siteMetadata: {
      title: string;
    };
  };
  markdownRemark: Post;
}

export const pageQuery = graphql`
  query ProjectBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 2500)
      tableOfContents
      timeToRead
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        slug
        tags
        layout
        published
        image {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      headings {
        value
        depth
        id
      }
    }
  }
`;

export default ProjectTemplate;
