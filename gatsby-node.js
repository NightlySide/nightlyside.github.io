const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = ({ graphql, actions }) => {
  return graphql(
    `
      {
        posts: allMarkdownRemark(
          filter: { frontmatter: { published: { ne: false }, layout: { ne: "project" } } }
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                tags
                title
                date
                slug
                layout
                published
              }
            }
          }
        }
        projects: allMarkdownRemark(
          filter: { frontmatter: { published: { ne: false }, layout: { eq: "project" } } }
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                tags
                title
                date
                slug
                layout
                published
              }
            }
          }
        }
      }
    `,
  ).then((result) => {
    if (result.errors) {
      throw result.errors;
    }

    // Get the templates
    const postTemplate = path.resolve(`./src/templates/Post.tsx`);
    const projectTemplate = path.resolve(`./src/templates/Project.tsx`);
    const tagTemplate = path.resolve("./src/templates/Tag.tsx");

    // Create post pages
    const posts = result.data.posts.edges;
    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node;
      const next = index === 0 ? null : posts[index - 1].node;
      const slug = post.node.frontmatter.slug ? post.node.frontmatter.slug : post.node.fields.slug;

      console.log(`[+] Creating page: "${post.node.frontmatter.title}" with path: "/posts/${slug}"`);

      actions.createPage({
        path: `/posts/${slug}`,
        component: postTemplate,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      });
    });

    // Create project pages
    const projects = result.data.projects.edges;
    projects.forEach((project, index) => {
      const previous = index === projects.length - 1 ? null : projects[index + 1].node;
      const next = index === 0 ? null : projects[index - 1].node;
      const slug = project.node.frontmatter.slug ? project.node.frontmatter.slug : project.node.fields.slug;

      console.log(`[+] Creating project: "${project.node.frontmatter.title}" with path: "/projects/${slug}"`);

      actions.createPage({
        path: `/projects/${slug}`,
        component: projectTemplate,
        context: {
          slug: project.node.fields.slug,
          previous,
          next,
        },
      });
    });

    // Iterate through each post, putting all found tags into `tags`
    let tags = [];
    posts.forEach((post) => {
      if (post.node.frontmatter.tags) {
        tags = tags.concat(post.node.frontmatter.tags);
      }
    });
    const uniqTags = [...new Set(tags)];

    // Create tag pages
    uniqTags.forEach((tag) => {
      if (!tag) return;
      actions.createPage({
        path: `/tags/${tag}/`,
        component: tagTemplate,
        context: {
          tag,
        },
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type === `MarkdownRemark`) {
    let value = createFilePath({ node, getNode });
    value = value.substr(1, value.length - 2); // removing slashes
    actions.createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
