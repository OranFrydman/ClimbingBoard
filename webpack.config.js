const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
  cache: argv.mode === 'development' ? false : true,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: {
                filter: (url) => {
                  // Don't process absolute URLs (they're served from public directory)
                  return !url.startsWith('/');
                },
              },
            },
          },
        ],
        sideEffects: true,
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|wav)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    hot: true,
    static: [
      { directory: path.join(__dirname, 'public', 'MEDIA'), publicPath: '/MEDIA' },
    ],
    proxy: {
      '/api': 'http://localhost:8080',
      '/Login': 'http://localhost:8080',
      '/LogOut': 'http://localhost:8080',
      '/createNewClimber': 'http://localhost:8080',
      '/createNewRecords': 'http://localhost:8080',
      '/FilterStats': 'http://localhost:8080',
      '/Delete': 'http://localhost:8080',
    },
  },
});
