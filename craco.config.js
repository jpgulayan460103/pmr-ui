const CracoLessPlugin = require('craco-less');
const { getThemeVariables } = require('antd/dist/theme');
module.exports = {
    style: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              modifyVars: {
                '@primary-color': '#4834d4',
                '@link-color': '#4834d4'
              },
              javascriptEnabled: true,
            },
          },
        },
      },
    ],
  }