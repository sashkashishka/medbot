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
    'MYSQL_DATABASE',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'MYSQL_HOST',
    'MYSQL_ROOT_PASSWORD',
    'DATABASE_URL',
    'NODE_ENV',
    'PORT',
    'HOST',
    'TG_BOT_TOKEN',
    'TG_BOT_FORUM_ID',
    'TG_BOT_FORUM_URL_TEMPLATE',
    'TG_BOT_TEST',
    'TG_BOT_WEBAPP_URL',
    'GOOGLE_CALENDAR_PRIVATE_KEY',
    'GOOGLE_CALENDAR_SERVICE_ACCOUNT',
    'GOOGLE_CALENDAR_ID',
    'GOOGLE_EMAIL',
    'RATE_LIMITER_CAPACITY',
    'RATE_LIMITER_FREQUENCY_RATE',
    'RATE_LIMITER_FREQUENCY_TIME',
    'RATE_LIMITER_MAX_ATTEMPTS',
    'PASSWORD_SALT',
    'JWT_SECRET',
    'COOKIE_SECRET',
    'ADMIN_AREA_URL',
  ],
  properties: {
    MYSQL_DATABASE: { type: 'string' },
    MYSQL_USER: { type: 'string' },
    MYSQL_PASSWORD: { type: 'string' },
    MYSQL_HOST: { type: 'string' },
    MYSQL_ROOT_PASSWORD: { type: 'string' },
    DATABASE_URL: { type: 'string' },
    NODE_ENV: { type: 'string' },
    PORT: { type: 'number', default: 8000 },
    HOST: { type: 'string', default: '0.0.0.0' },
    TG_BOT_TOKEN: { type: 'string' },
    TG_BOT_FORUM_ID: { type: 'number' },
    TG_BOT_FORUM_URL_TEMPLATE: { type: 'string' },
    TG_BOT_TEST: { type: 'string' },
    TG_BOT_WEBAPP_URL: { type: 'string' },
    GOOGLE_CALENDAR_PRIVATE_KEY: { type: 'string' },
    GOOGLE_CALENDAR_SERVICE_ACCOUNT: { type: 'string' },
    GOOGLE_CALENDAR_ID: { type: 'string' },
    GOOGLE_EMAIL: { type: 'string' },
    RATE_LIMITER_CAPACITY: { type: 'number' },
    RATE_LIMITER_FREQUENCY_RATE: { type: 'number' },
    RATE_LIMITER_FREQUENCY_TIME: { type: 'number' },
    RATE_LIMITER_MAX_ATTEMPTS: { type: 'number' },
    PASSWORD_SALT: { type: 'string' },
    JWT_SECRET: { type: 'string' },
    COOKIE_SECRET: { type: 'string' },
    ADMIN_AREA_URL: { type: 'string' },
  } as const,
};

export const envPluginConfig = {
  confKey: 'config',
  schema,
};
