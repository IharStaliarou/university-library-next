const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
    imagekit: {
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    },
    databaseUrl: process.env.DATABASE_URL!,
    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_URL!,
      redisToken: process.env.UPSTASH_REDIS_TOKEN!,
      qstashUrl: process.env.QSTASH_URL!,
      qstashToken: process.env.QSTASH_TOKEN!,
    },
    emailjs: {
      serviceId: process.env.EMAILJS_SERVICE_ID!,
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      welcomeTemplateId: process.env.EMAILJS_WELCOME_TEMPLATE_ID!,
      inactiveTemplateId: process.env.EMAILJS_INACTIVE_TEMPLATE_ID!,
      activeTemplateId: process.env.EMAILJS_ACTIVE_TEMPLATE_ID!,
    },
  },
};

export default config;
