"use strict";

module.exports = {
	pathPrefix: ``,
	siteMetadata: {
		title: "Alexandre Froehlich",
		description: "Site web / portfolio d'Alexandre Froehlich",
		siteUrl: "https://nightlyside.github.io",
		author: {
			name: "Alexandre Froehlich",
			url: "https://gihub.com/nightlyside",
			email: "nightlyside@gmail.com"
		},
		social: {
			twitter: "https://twitter.com/froalexandre",
			github: "https://github.com/nightlyside",
			reddit: "https://www.reddit.com/user/Nightlyside",
			linkedin: "https://www.linkedin.com/in/alexandre-f-1102298a/"
		}
	},
	plugins: [
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/posts`,
				ignore: [`**/\.~*`],
				name: `posts`
			}
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/projects`,
				ignore: [`**/\.~*`],
				name: `projects`
			}
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/assets`,
				name: `assets`
			}
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 1280,
							linkImagesToOriginal: false
						}
					},
					{
						resolve: `gatsby-remark-responsive-iframe`,
						options: {
							wrapperStyle: `margin-bottom: 1.0725rem`
						}
					},
					{
						resolve: `gatsby-remark-images-zoom`,
						options: {
							background: "var(--color-bg-primary)"
						}
					},
					`gatsby-remark-autolink-headers`,
					`gatsby-remark-mathjax-ssr`,
					`gatsby-remark-prismjs`,
					`gatsby-remark-copy-linked-files`,
					`gatsby-remark-smartypants`
				]
			}
		},
		{
			resolve: `gatsby-plugin-canonical-urls`,
			options: {
				siteUrl: `https://nightlyside.github.io`
			}
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Alexandre Froehlich`,
				short_name: `nightlyside.github.io`,
				start_url: `/`,
				background_color: `#262626`,
				theme_color: `#663399`,
				display: `minimal-ui`,
				icon: `src/images/favicon.png` // This path is relative to the root of the site.,
			}
		},
		{
			resolve: `gatsby-plugin-google-analytics`,
			options: {
				// trackingId: `ADD YOUR TRACKING ID HERE`,
			}
		},
		{
			resolve: "gatsby-plugin-react-svg",
			options: {
				rule: {
					include: /\.svg$/
				}
			}
		},
		{
			resolve: "gatsby-plugin-exclude",
			options: { paths: ["/TwitterTrendR/**"] }
		},
		`gatsby-plugin-react-helmet`,
		`gatsby-plugin-sharp`,
		`gatsby-plugin-typescript`,
		`gatsby-transformer-sharp`,
		`gatsby-plugin-transition-link`,
		`gatsby-plugin-postcss`
	]
};
