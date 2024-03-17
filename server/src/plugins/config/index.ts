type tConfig<tSchema extends Record<string, { type: unknown }>> = {
  [tKey in keyof tSchema]: tSchema[tKey]['type'] extends 'string'
    ? string
    : tSchema[tKey]['type'] extends 'number'
    ? number
    : unknown;
};

declare module 'fastify' {
  // eslint-disable-next-line
  interface FastifyInstance {
    config: tConfig<typeof schema.properties>;
  }
}

const schema = {
  type: 'object',
  required: [
    'PRISMA_DATABASE',
    'PRISMA_USER_DEV',
    'PRISMA_PASSWORD_DEV',
    'PRISMA_USER_PROD',
    'PRISMA_PASSWORD_PROD',
    'PRISMA_HOST',
    'MYSQL_ROOT_PASSWORD',
    'DATABASE_URL',
    'NODE_ENV',
    'PORT',
    'HOST',
    'TG_BOT_TOKEN',
    'TG_BOT_FORUM_ID',
    'TG_BOT_TEST',
    'TG_BOT_WEBAPP_URL',
    'GOOGLE_CALENDAR_PRIVATE_KEY',
    'GOOGLE_CALENDAR_SERVICE_ACCOUNT',
    'GOOGLE_CALENDAR_ID',
    'RATE_LIMITER_CAPACITY',
    'RATE_LIMITER_FREQUENCY_RATE',
    'RATE_LIMITER_FREQUENCY_TIME',
    'RATE_LIMITER_MAX_ATTEMPTS',
  ],
  properties: {
    PRISMA_DATABASE: { type: 'string' },
    PRISMA_USER_DEV: { type: 'string' },
    PRISMA_PASSWORD_DEV: { type: 'string' },
    PRISMA_USER_PROD: { type: 'string' },
    PRISMA_PASSWORD_PROD: { type: 'string' },
    PRISMA_HOST: { type: 'string' },
    MYSQL_ROOT_PASSWORD: { type: 'string' },
    DATABASE_URL: { type: 'string' },
    NODE_ENV: { type: 'string' },
    PORT: { type: 'number', default: 8000 },
    HOST: { type: 'string', default: '0.0.0.0' },
    TG_BOT_TOKEN: { type: 'string' },
    TG_BOT_FORUM_ID: { type: 'number' },
    TG_BOT_TEST: { type: 'string' },
    TG_BOT_WEBAPP_URL: { type: 'string' },
    GOOGLE_CALENDAR_PRIVATE_KEY: { type: 'string' },
    GOOGLE_CALENDAR_SERVICE_ACCOUNT: { type: 'string' },
    GOOGLE_CALENDAR_ID: { type: 'string' },
    RATE_LIMITER_CAPACITY: { type: 'number' },
    RATE_LIMITER_FREQUENCY_RATE: { type: 'number' },
    RATE_LIMITER_FREQUENCY_TIME: { type: 'number' },
    RATE_LIMITER_MAX_ATTEMPTS: { type: 'number' },
  } as const,
};

export const envPluginConfig = {
  confKey: 'config',
  schema,
};
