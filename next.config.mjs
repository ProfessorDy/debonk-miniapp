/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, {}) => {
    // Enable both WebAssembly and layers experimental features
    config.experiments = {
      asyncWebAssembly: true, // Enable WebAssembly
      layers: true, // Enable layers to resolve the error
    };

    // Add a rule for handling WebAssembly files (if needed)
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    return config;
  },
};

export default nextConfig;
