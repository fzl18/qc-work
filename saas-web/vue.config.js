const webpack = require('webpack')

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(svg)(\?.*)?$/,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                symbolId: 'icon-[name]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin(`Copyright ${new Date().getFullYear()} iQiChengTech Co. Ltd. All Rights Reserved. chunkhash:[chunkhash]`),
    ]
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .test(() => false)
      .use('file-loader');
    config.plugin('html').tap(args => {
      args[0].minify = false
      return args
    })
  }
};
