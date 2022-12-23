'use strict'
const path = require('path')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/PSGIS/' : '/',
  // assetsDir: "static",
  configureWebpack: {
    output: {
      sourcePrefix: ' ' //让webpack正确处理多行字符串
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [],
    module: {}
  },
  devServer: {
    host: '127.0.0.1',
    port: 8081,
    hot: true,
    compress: true, // 代码压缩
    proxy: {
      [process.env.VUE_APP_API]: {
        target: 'http://101.132.68.240:6022/', //官网
        // target: 'http://192.168.2.5:8080',  //杜宇轩
        // target: 'http://192.168.2.187:8080',
        // target: 'http://192.168.2.30:8082',
        // target:'http://192.168.2.16:8080',
        // target: 'http://192.168.2.7:8081',
        // target: 'http://192.168.2.89:8080/',
        // target: 'http://192.168.2.84:8080/', //张鑫
        changeOrigin: true
      }
    }
  }
}
