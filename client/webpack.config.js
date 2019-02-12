const HtmlWebpackPlugin = require('html-webpack-plugin')
const template = require('html-webpack-template')

module.exports = {
  devServer: {
    contentBase: __dirname + '/build',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true,
    host: '0.0.0.0',
    open: true,
    proxy: {
      '/tv': 'http://localhost:3000',
      '/videos': 'http://localhost:3000'
    },
    useLocalIp: true
  },
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
          loader: 'babel-loader'
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
