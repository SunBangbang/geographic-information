module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ['@babel/preset-env', { modules: false }]
  ],
  plugins: [
    [
      'component',
      {
        librayName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ],
  env: {
    development: {
      plugins: ['dynamic-import-node']
    }
  }
}
