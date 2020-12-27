import React from "react";
import { graphql } from "gatsby";
import { PostQueryData } from "../../types/post";

import MainLayout from "../components/core/main-layout";
import Head from "../components/core/head";
import ListItem from "../components/post/list-item";
import ShowcaseCard from "../components/post/showcase-card";

interface ProjectsProps {
	readonly data: PostQueryData;
}

const Projects: React.FC<ProjectsProps> = ({ data }) => {
	const posts = data.allMarkdownRemark.edges;
	const showcase_posts = posts.slice(0, 4);
	const other_posts = posts.slice(4, posts.length);

	return (
		<MainLayout>
			<Head title="Portfolio" keywords={[`blog`, `gatsby`, `javascript`, `react`]} />

			<div className="w-full bg-secondary">
				<h1 className="py-7 px-16 text-4xl text-primary font-black text-center md:text-left">
					Derniers articles
				</h1>
				<div className="w-full px-4 md:px-8 xl:px-32 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{showcase_posts.map((post, index) => (
						<ShowcaseCard key={index} post={post.node} basePath="posts" />
					))}
				</div>
				<div className="w-full bg-primary px-16 py-8">
					<h1 className="pb-7 text-4xl text-primary font-black lg:px-32 text-center md:text-left">
						Mes autres articles
					</h1>
					<div className="flex flex-col space-y-10 lg:px-32">
						{other_posts.map((post, index) => (
							<ListItem post={post.node} basePath="posts" key={index} />
						))}
					</div>
				</div>
			</div>
			<div className="ml-0 ml-4 ml-8 ml-12" />
		</MainLayout>
	);
};

export const pageQuery = graphql`
	query {
		site {
			siteMetadata {
				title
			}
		}
		allMarkdownRemark(
			filter: { frontmatter: { published: { ne: false }, layout: { ne: "project" } } }
			sort: { fields: [frontmatter___date], order: DESC }
		) {
			edges {
				node {
					excerpt(pruneLength: 150)
					fields {
						slug
					}
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
				}
			}
		}
	}
`;

export default Projects;
