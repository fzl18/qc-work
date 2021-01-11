module.exports = {
    devServer: {
        proxy: 'http://localhost: 51362',
        port: 9999
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.worker\.js$/,
                    use: { loader: 'worker-loader' }
                }
            ]
        }
    },
    chainWebpack: config => {
        config.externals({

        })
    },
    lintOnSave: false,
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true,
            }
        }
    }
}