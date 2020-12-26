import React, { useEffect, useMemo } from "react";
import { Link } from "gatsby";

import { Post } from "../../../types/post";
import { useActiveHash } from "../../hooks/use-active-hash";

interface TableOfContentsProps {
  post: Post;
}

const TableOfContents = ({ post }: TableOfContentsProps) => {
  const targetedIds = useMemo(() => {
    return post.headings?.map((heading) => heading.id);
  }, [post]);

  if (targetedIds?.length == 0) return <div></div>;

  const activeHash = useActiveHash(targetedIds as string[]);

  useEffect(() => {
    const ToClinks = document.querySelectorAll(`.toc a`);

    ToClinks.forEach((a) => {
      a.classList.remove("text-secondary");
      a.classList.remove("text-accent");
      a.classList.add("text-secondary");
    });

    const activeLink = document.querySelectorAll(`.toc a[href$="${"/#" + activeHash}"]`);

    if (activeLink.length) {
      activeLink[0].classList.remove("text-secondary");
      activeLink[0].classList.add("text-accent");
    }
  }, [activeHash]);

  return (
    <aside className="sticky hidden lg:block pl-8 pt-8 max-h-0.5 flex-shrink-0 top-0">
      <nav className="toc text-secondary">
        <h2 className="mb-2 font-normal text-accent tracking-widestest uppercase">Table of contents</h2>
        {post.headings &&
          post.headings.map((heading, index) => {
            return (
              <Link
                key={index}
                to={`#${heading.id}`}
                className={`block mt-3 text-sm hover:text-accent ml-${4 * (heading.depth - 2)} text-secondary`}>
                {heading.value}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
};

export default TableOfContents;
