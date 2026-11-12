import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    return [
      {
        source: "/dashboard/ai-ml",
        destination: "/dashboard/aiml",
        permanent: true,
      },
      {
        source: "/dashboard/systemdesign",
        destination: "/dashboard/system-design",
        permanent: true,
      },
      {
        source: "/dashboard/notespace",
        destination: "/dashboard/notes",
        permanent: true,
      },
      {
        source: "/dashboard/interview",
        destination: "/dashboard/interviewprep",
        permanent: true,
      },
      {
        source: "/hiring-simulator",
        destination: "/dashboard/hiring-simulator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
