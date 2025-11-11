let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    KNOCK_SECRET_API_KEY: process.env.KNOCK_SECRET_API_KEY,
  },
  webpack: (config) => {
    // Add alias for react to provide useEffectEvent polyfill
    // Only apply this alias for node_modules to avoid circular dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // Use a more specific alias that only applies to node_modules
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      {
        apply: resolver => {
          resolver.hooks.resolve.tapAsync('ReactPolyfill', (request, resolveContext, callback) => {
            // Only apply to imports from node_modules
            if (request.path && request.path.includes('node_modules') && request.request === 'react') {
              const newRequest = { ...request, request: '@/lib/polyfills/react' };
              resolver.doResolve(resolver.hooks.resolve, newRequest, null, resolveContext, callback);
            } else {
              callback();
            }
          });
        }
      }
    ];

    return config;
  },
  turbopack: {
    // Adding an alias and custom file extension
    resolveAlias: {
      underscore: 'lodash',
      // We can't use the same selective approach as webpack for turbopack
      // but we'll keep this for now and monitor for any circular dependency issues
      'react': '@/lib/polyfills/react',
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
    images: {
      //  domains: [
      //      ''
      //],
    unoptimized: true,
  },
}

// Merge user config if it exists
mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
