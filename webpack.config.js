module.exports = {
  devtool: 'eval',
  entry: './src/wegen.js',

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },

  output: {
    path: __dirname + '/dist',
    filename: 'wegen.js',
    library: 'Wegen',
    libraryTarget: 'umd'
  }
};
