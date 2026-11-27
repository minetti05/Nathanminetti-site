import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Resized copies for visitors at high quality; originals in /public are never changed.
    qualities: [75, 90],
    // Case-study stills fall back to YouTube thumbnails until real stills are supplied.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  // Old Squarespace URLs (brief section 2). More are added at launch from Search Console.
  async redirects() {
    return [
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/experience", destination: "/about", permanent: true },
      { source: "/polaroid", destination: "/photography", permanent: true },
      { source: "/polaroid/:path*", destination: "/photography", permanent: true },
    ];
  },
};

export default nextConfig;
