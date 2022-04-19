module.exports = {
    devServer: {
        proxy: 'https://e-bettor.herokuapp.com'
    },
    pluginOptions: {
      i18n: {
        locale: 'fr',
        fallbackLocale: 'en',
        localeDir: 'assets/locales',
        enableInSFC: true
      }
    }
  }