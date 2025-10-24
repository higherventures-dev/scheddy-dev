// next.config.ts
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // ✅ Don't run ESLint during `next build` (prevents deploy fail & hides ESLint output)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ (Optional) Keep ignoring TS build errors like you had
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Silence "Next.js inferred your workspace root" when multiple lockfiles exist
  experimental: {
    outputFileTracingRoot: path.join(__dirname),
  },
}

export default nextConfig
