const ArcoWebpackPlugin = require('@arco-plugins/webpack-react');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.plugins.push(new ArcoWebpackPlugin({ style: 'css' }));
    return config;
  },
};

module.exports = nextConfig;
