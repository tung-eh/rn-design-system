exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: "babel-plugin-module-resolver",
    options: {
      alias: {
        "rn-hero-design": "../../lib/src",
      },
    },
  });
};

exports.onCreateWebpackConfig = (args) => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        "react-native": "react-native-web",
      },
    },
  });
};
