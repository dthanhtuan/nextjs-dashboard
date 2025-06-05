import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    config: {
        turbo: {
            rules: {
                '*.html': {
                    loaders: ['raw-loader'], // or another appropriate loader
                    as: '*.js',
                },
                // Add other file types if needed
            },
        },
    }
};

export default nextConfig;
