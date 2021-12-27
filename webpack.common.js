const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devServer: {
    historyApiFallback: true,
  },
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /\.spec.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$|\.s(c|a)ss$/,
        use: ["lit-scss-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      'ol-styles': path.resolve(__dirname, "./node_modules/ol/ol.css")
    },
    modules: [
      path.resolve(__dirname, ""),
      path.resolve(__dirname, "./src"),
      path.resolve(__dirname, "./node_modules")
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunksSortMode: "none",
      template: "src/index.html",
    }),
  ],
};
