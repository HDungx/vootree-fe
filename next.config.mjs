/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
const nextConfig = { 
    async rewrites() {
    return [
      {
        source: '/partner/:path*',
        destination: '/partner/:path*',
      },
    ];
  }, images: {
    domains: ['localhost'],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

  export default withNextIntl(nextConfig);
