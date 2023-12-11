export const ENV_VARS = {
  TOKEN: process.env.TG_BOT_TOKEN,
  TEST_ENV: !!Number(process.env.TG_BOT_TEST),
  FORUM_ID: process.env.TG_BOT_FORUM_ID,
};
