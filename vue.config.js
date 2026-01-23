const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background.js',
    }
  },
  pwa: {
    name: 'ÇözümGayrimenkul',
    themeColor: '#ffffff',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      appleTouchIcon: 'img/icons/logo.jpeg', // iPhone ana ekran ikonu için
    },
    // İkonların yollarını belirtin (public/img/icons içinde olmalılar)
    manifestOptions: {
      display: 'standalone',
      background_color: '#ffffff',
      icons: [
        {
          src: 'img/icons/logo.jpeg',
          sizes: '192x76',
          type: 'image/jpeg',
        }
      ],
    },
  },
})
