/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['jdxclqrlcbbvsrhxugbz.supabase.co'], // přidejte vaši Supabase doménu
  },
  // Přidáme output: 'standalone' pro lepší kompatibilitu s Vercel
  output: 'standalone'
}

module.exports = nextConfig 