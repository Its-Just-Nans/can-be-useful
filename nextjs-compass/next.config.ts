import type { NextConfig } from "next";
import { withYak } from "next-yak/withYak";

const nextConfig: NextConfig = {
    basePath: "/can-be-useful/nextjs-compass",
    output: "export",
    distDir: "dist",
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default withYak(nextConfig);
