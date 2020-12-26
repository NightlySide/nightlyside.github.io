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

const PostTemplate: React.FC<Props> = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const { previous, next } = pageContext;

  let prev_slug, next_slug;

  if (previous) prev_slug = previous.frontmatter.slug ? previous.frontmatter.slug : previous.fields.slug;
  if (next) next_slug = next.frontmatter.slug ? next.frontmatter.slug : next.fields.slug;

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
          <main className="prose lg:prose-lg w-full">
            <header className="mb-4">
              <p className="text-sm text-secondary">
                {post.frontmatter.date} • {post.timeToRead} min de lecture
              </p>
              <h1 className="text-primary text-4xl font-black tracking-tight">{post.frontmatter.title}</h1>
            </header>
            <div>
              <div dangerouslySetInnerHTML={{ __html: post.html as string }} />
              <div className="grid grid-cols-2 gap-4 mt-16">
                {previous ? (
                  <Link
                    to={`/posts/${prev_slug}`}
                    rel="prev"
                    className="text-center text-accent border rounded-lg py-4 border-current no-underline">
                    ← {previous.frontmatter.title}
                  </Link>
                ) : (
                  <div></div>
                )}
                {next ? (
                  <Link
                    to={`/posts/${next_slug}`}
                    rel="next"
                    className="text-center text-accent border rounded-lg py-4 border-current no-underline">
                    {next.frontmatter.title} →
                  </Link>
                ) : (
                  <div></div>
                )}
              </div>
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
  query PostBySlug($slug: String!) {
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

export default PostTemplate;
