/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname], // Add your Supabase URL here
      },
}

module.exports = nextConfig
