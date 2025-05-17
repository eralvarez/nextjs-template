import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => {
    return [
      {
        // 👇 matches all routes except /api
        source: '/((?!api/).*)',
        destination: '/spa-shell',
      },
    ];
  },
  webpack(config, { isServer, dev }) {
    // if (isServer && dev) {
    if (isServer) {
      console.log('➡️➡️➡️➡️➡️ Server build starting...');
      // Custom code here, e.g., generate dynamic imports, read files, etc.
      const files = require('fs').readdirSync('./src/spa-routes');
      console.log('Found content files:', files);
    }

    return config;
  },
};

export default nextConfig;
