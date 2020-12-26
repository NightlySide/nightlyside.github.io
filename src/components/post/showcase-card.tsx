import React from "react";
import { navigate } from "gatsby";
import Img from "gatsby-image";
import { Post } from "../../../types/post";

interface ShowcaseCardProps {
  post: Post;
  basePath: string;
}

const ShowcaseCard = ({ post, basePath }: ShowcaseCardProps) => {
  const clickHandler = () => {
    const slug = post.frontmatter.slug ? post.frontmatter.slug : post.fields.slug;
    navigate(`/${basePath}/${slug}`);
  };

  const tagline =
    post.frontmatter.tags.length > 1 ? post.frontmatter.tags.slice(0, 2).join(" | ") : post.frontmatter.tags[0];

  return (
    <div
      className="bg-showcard rounded-lg cursor-pointer underline-on-hover transform hover:scale-105 transition duration-200 min-h-full"
      onClick={clickHandler}>
      <Img
        fluid={post.frontmatter.image.childImageSharp.fluid}
        alt={`${post.frontmatter.title} thumbnail`}
        className="h-44 rounded-t-lg"
      />
      <div className="pt-4 pb-2 px-5">
        <p className="text-sm text-secondary font-thin">{post.frontmatter.date}</p>
        <h2 className="text-3xl font-bold text-primary pb-2 to-underline">{post.frontmatter.title}</h2>
        <p className="text-secondary pb-8">{post.excerpt}</p>
        <p className="text-sm text-secondary uppercase text-center w-full absolute bottom-0 left-0 py-2">{tagline}</p>
      </div>
    </div>
  );
};

export default ShowcaseCard;
