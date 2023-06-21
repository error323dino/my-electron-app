const path = require('path');

module.exports = {
  entry: './src/index.js', // Replace with your entry file path
  output: {
    path: path.resolve(__dirname, 'dist'), // Replace with your desired output directory
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};