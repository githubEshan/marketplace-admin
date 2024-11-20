/** @type {import('next').NextConfig} */

export default {
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
};