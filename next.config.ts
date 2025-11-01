// next.config.ts
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Don’t run ESLint during `next build`
  eslint: {
    ignoreDuringBuilds: true,
  },

  // (Optional) Ignore TS build errors during `next build`
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Top-level (not under `experimental`)
  // If your app folder is the repo root, use __dirname.
  // If your app lives in a subfolder (e.g. apps/web), point to the workspace root instead.
  outputFileTracingRoot: path.resolve(__dirname /*, '..' or '../..' if needed */),
  
  // Remove this block entirely if you have no other experimental flags
  // experimental: {},
}

export default nextConfig
