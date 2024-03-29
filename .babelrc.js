module.exports = {
  presets: [['next/babel']],
  plugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@arco-design/web-react',
        libraryDirectory: 'es',
        camel2DashComponentName: false,
        style: 'css',
      },
    ],
  ],
};
