import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';

export function populateContext({
  forumId,
  googleEmail,
  googleCalendar,
  googleCalendarId,
  webAppUrl,
  adminAreaUrl,
  serviceApiSdk,
  logger,
  $t,
}: Partial<iMedbotContext>): MiddlewareFn<iMedbotContext> {
  return function populateContextMiddleware(ctx, next) {
    ctx.forumId = forumId;
    ctx.googleEmail = googleEmail;
    ctx.googleCalendar = googleCalendar;
    ctx.googleCalendarId = googleCalendarId;
    ctx.webAppUrl = webAppUrl;
    ctx.adminAreaUrl = adminAreaUrl;
    ctx.serviceApiSdk = serviceApiSdk;
    ctx.logger = logger;
    ctx.$t = $t;

    return next();
  };
}
