module.exports = {
  devServer: {
    // overlay: {
    //     warnings: true,
    //     errors: true
    // },
    port: 8084,
    proxy: 'http://localhost:5000'
  },

  chainWebpack: config => {
    config.externals({
      '_': 'loadash',
      'moment': 'moment'
    })
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  lintOnSave: true
}
