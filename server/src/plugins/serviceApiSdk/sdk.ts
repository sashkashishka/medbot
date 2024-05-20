import type { BaseLogger } from 'pino';
import type { Prisma } from '@prisma/client';
import { NetworkError } from './errors.js';
import type { tNsTranslations } from '../i18n/i18n.js';

export class ServiceApiSdk {
  constructor(
    private logger: BaseLogger,
    private host: string,
    private tgToken: string,
  ) {}

  public getTranslations(lang: string, ns: string) {
    return this.request<tNsTranslations>(`/i18n/ns/${lang}/${ns}`);
  }

  public teardownUserData(userId: number) {
    return this.request<{ done: boolean }>(`/teardown-user-data/${userId}`);
  }

  public getBotChatId(messageThreadId: number) {
    return this.request<{ botChatId: number }>(
      `/bot-chat-id/${messageThreadId}`,
    );
  }

  public activeOrder(userId: number) {
    return this.request<Prisma.OrderUncheckedCreateInput>(
      `/order/active/${userId}`,
    );
  }

  public checkOrderActive(id: number, idType: 'messageThreadId' | 'botChatId') {
    return this.request<{ active: boolean }>(
      `/check-order-active/${id}?id=${idType}`,
    );
  }

  public getActiveOrdersProduct(
    id: number,
    idType: 'messageThreadId' | 'botChatId',
  ) {
    return this.request<Prisma.ProductUncheckedCreateInput>(
      `/orders-product/${id}?id=${idType}`,
    );
  }

  public activeAppointment(userId: number) {
    return this.request<Prisma.AppointmentUncheckedCreateInput>(
      `/appointment/${userId}`,
    );
  }

  public user(userId: number) {
    return this.request<Prisma.UserCreateInput>(`/user/${userId}`);
  }

  public updateUser(userId: number, data: Prisma.UserCreateInput) {
    return this.request<Prisma.UserCreateInput>(`/user/update/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  private getUrl(url: string) {
    return new URL(`/api/service${url}`, this.host);
  }

  private getInit(init: RequestInit): RequestInit {
    return {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
        'x-token': this.tgToken,
      },
    };
  }

  private async request<T>(
    url: string,
    init?: RequestInit,
  ): Promise<[T, null] | [null, Error | Record<string, any>]> {
    try {
      const response = await fetch(this.getUrl(url), this.getInit(init));
      if (!response.ok) {
        switch (response.status) {
          case 400:
          case 401:
          case 403: {
            return [null, await response.json()];
          }

          default:
            throw new NetworkError(response.status, response.statusText);
        }
      }

      return [(await response.json()) as T, null];
    } catch (e) {
      this.logger.error(e, 'serviceApiSdk');
      return [null, e];
    }
  }
}
