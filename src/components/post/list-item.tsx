import React from "react";
import { navigate } from "gatsby";
import { Post } from "../../../types/post";
import Img from "gatsby-image";

interface ListItemProps {
  post: Post;
  basePath: string;
}

const ListItem = ({ post, basePath }: ListItemProps) => {
  const clickHandler = () => {
    const slug = post.frontmatter.slug ? post.frontmatter.slug : post.fields.slug;
    navigate(`/${basePath}/${slug}`);
  };

  const tagline =
    post.frontmatter.tags.length > 1 ? post.frontmatter.tags.slice(0, 2).join(" | ") : post.frontmatter.tags[0];

  return (
    <div className="flex flex-row underline-on-hover cursor-pointer" onClick={clickHandler}>
      <Img
        fluid={post.frontmatter.image.childImageSharp.fluid}
        alt={`${post.frontmatter.title} thumbnail`}
        className="w-56 h-32 flex-grow-0 flex-shrink-0 mr-8"
      />
      <div className="flex-grow flex-shrink">
        <h2 className="text-2xl font-bold text-primary to-underline">{post.frontmatter.title}</h2>
        <p className="py-2">
          <span className="text-base text-secondary mr-2">{post.frontmatter.date}</span>
          <span className="text-sm text-secondary uppercase">{tagline}</span>
        </p>
        <p className="text-lg text-secondary">{post.excerpt}</p>
      </div>
    </div>
  );
};

export default ListItem;
