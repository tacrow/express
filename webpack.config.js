const path = require('path');

module.exports = {
  entry: [
    './src/client.jsx'
  ],
  output: {
    path: `${__dirname}/public/js`,
    filename: 'client.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                // envの指定でES2017をES5に変換
                // {modules: false}にしないと import 文が Babel によって CommonJS に変換され、
                // webpack の Tree Shaking 機能が使えない
                ['env', {'modules': false}],
                // ReactのJSXを解釈
                'react'
              ]
            }
          }
        ],
        // node_modulesは除外
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    // modulesDirectories: ['node_modules'],
  },
  devtool: 'source-map'
};