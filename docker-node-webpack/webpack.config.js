module.exports = {
  entry: "./index.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: "style-loader!css-loader"
    },
    {
      test: /\.sass$/,
      loader: "style-loader!css-loader!sass-loader"
    }]
  },
  devServer: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
};
