/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects:()=>{
    return [
      {
        source: '/',
        destination: '/editor',
        permanent: false,
      },
    ]
  }
};

module.exports = nextConfig;
