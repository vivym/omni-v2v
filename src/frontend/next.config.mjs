import withBundleAnalyzer from '@next/bundle-analyzer'
import withPlugins from 'next-compose-plugins'
import { env } from './env.mjs'

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[withBundleAnalyzer({ enabled: env.ANALYZE })]], {
  reactStrictMode: true,
  experimental: { instrumentationHook: true },
  rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://127.0.0.1:12580/:path*' },
    ]
  },
})

export default config
