module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: {
        primary: "var(--color-bg-primary)",
        secondary: "var(--color-bg-secondary)",
        navbar: "var(--color-bg-navbar)",
        code: "var(--color-bg-code)",
      },
      textColor: {
        accent: "var(--color-text-accent)",
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
      },
      borderColor: {
        accent: "var(--color-text-accent)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "var(--color-text-secondary)",
            a: {
              color: "var(--color-text-secondary)",
              "&:hover": {
                color: "var(--color-text-accent)",
              },
              transitionProperty: "none",
            },
            blockquote: {
              color: "var(--color-text-secondary)",
              borderLeftColor: "var(--color-text-accent)",
              backgroundColor: "var(--color-bg-secondary)",
            },
            h1: { color: "var(--color-text-primary)" },
            h2: { color: "var(--color-text-accent)" },
            h3: { color: "var(--color-text-accent)" },
            strong: { color: "var(--color-text-secondary)" },
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
