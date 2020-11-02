module.exports = {
  siteMetadata: {
    title: "Elías García",
    description: "Página web personal",
    siteUrl: process.env.GATSBY_SITE_URL,
  },
  plugins: [
    "gatsby-plugin-ts-config",
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: ["rubik:400,500"],
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets\/images/,
        },
      },
    },
  ],
};
