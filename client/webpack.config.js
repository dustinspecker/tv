const HtmlWebpackPlugin = require('html-webpack-plugin')
const template = require('html-webpack-template')

module.exports = {
  entry: './index.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ],
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  },
  output: {
    path: __dirname + '/build/assets'
  },
  plugins: [
    new HtmlWebpackPlugin({
      appMountId: 'app',
      baseHref: '/',
      filename: __dirname + '/build/index.html',
      inject: false,
      lang: 'en-US',
      mobile: true,
      links: [
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
        'https://fonts.googleapis.com/icon?family=Material+Icons'
      ],
      scripts: [
        'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
      ],
      template,
      title: 'TV'
    })
  ]
}
