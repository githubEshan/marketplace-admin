/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: process.env.FRONTEND_ORIGIN,
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization",
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/dfr4gm4a5/image/upload/**',
            },
        ],
    },
    reactStrictMode: false,
};

export default nextConfig;