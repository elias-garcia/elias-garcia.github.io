module.exports = {
  plugins: [
    "gatsby-plugin-ts-config",
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: ["rubik"],
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
