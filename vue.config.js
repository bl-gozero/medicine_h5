module.exports = {
  configureWebpack: config => {
    if (process.env.UNI_PLATFORM !== 'h5') {
      ;(config.plugins || []).forEach(plugin => {
        if (plugin.constructor?.name === 'CopyWebpackPlugin') {
          plugin.patterns = plugin.patterns.map(item => {
            if (item.from.includes('static')) {
              return {
                ...item,
                globOptions: {
                  ignore: [
                    'static/anime/**'
                  ]
                }
              }
            }
            return item
          })
        }
      })
    }
  }
}