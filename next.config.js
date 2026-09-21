/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    // output: "export" removido para habilitar API Routes (Supabase + Gemini IA)
    // O deploy na Vercel continua funcionando normalmente no modo dinâmico.

    // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
    // trailingSlash: true,

    // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
    // skipTrailingSlashRedirect: true,

    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
};

module.exports = nextConfig;
