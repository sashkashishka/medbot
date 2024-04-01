import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';

export function populateContext({
  forumId,
  googleCalendar,
  googleCalendarId,
  webAppUrl,
  adminAreaUrl,
  serviceApiSdk,
}: Partial<iMedbotContext>): MiddlewareFn<iMedbotContext> {
  return function populateContextMiddleware(ctx, next) {
    ctx.forumId = forumId;
    ctx.googleCalendar = googleCalendar;
    ctx.googleCalendarId = googleCalendarId;
    ctx.webAppUrl = webAppUrl;
    ctx.adminAreaUrl = adminAreaUrl;
    ctx.serviceApiSdk = serviceApiSdk;

    return next();
  };
}
