import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Export routes as directories (for example, /about/index.html) so the
  // deployed static server can resolve extensionless links such as /about/.
  trailingSlash: true,
};

export default nextConfig;
