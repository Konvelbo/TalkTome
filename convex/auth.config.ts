// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.VITE_CONVEX_SITE_URL,
      applicationID: 'convex',
    },
  ],
}
