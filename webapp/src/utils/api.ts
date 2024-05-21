import { API } from '../constants/api';
import type {
  iAppointment,
  iConfig,
  iErrorResponse,
  iFreeSlot,
  iOrder,
  iProduct,
  iUser,
  tNsTranslations,
} from '../types';
import { getInitData } from './tg';

class NetworkError extends Error {
  constructor(
    public statusCode: number,
    public key: string,
    // eslint-disable-next-line
    ...args: any[]
  ) {
    super(...args);

    this.stack = new Error().stack;
  }
}

interface iResponses {
  [API.CREATE_APPOINTMENT]:
    | iAppointment
    | iErrorResponse<{ time: string } | string>;
  [API.UPDATE_DELETE_APPOINTMENT]:
    | iAppointment
    | iErrorResponse<{ time: string } | string>;
  [API.FREE_SLOTS]: iFreeSlot[];
  [API.ACTIVE_APPOINTMENT]: iAppointment;
  [API.USER]: iUser;
  [API.CREATE_USER]: iUser;
  [API.UPDATE_USER]: iUser;
  [API.UPDATE_ORDER]: iOrder | iErrorResponse<string>;
  [API.CREATE_ORDER]: iOrder | iErrorResponse<string>;
  [API.CREATE_ORDER_BY_CODE]:
    | iOrder
    | iErrorResponse<
        | string
        | {
            blockedUntil: string;
            reason: string;
          }
      >;
  [API.WAITING_FOR_PAYMENT_ORDER]: iOrder;
  [API.I18N]: tNsTranslations;
  [API.PRODUCT_LIST]: iProduct[];
  [API.CONFIG]: iConfig;
  [API.MEDBOT_PROCEED_TO_CHAT]: unknown;
  [API.MEDBOT_SEND_APPOINTMENT_STATUS]: unknown;
}

export function createApi<tEndpoint extends API>(
  url: tEndpoint,
  options?: RequestInit,
) {
  const controller = new AbortController();

  const reqOptions: RequestInit = {
    ...options,
    headers: {
      ...options?.headers,
      'content-type': 'application/json',
      'x-webapp-info': getInitData(),
    },
    signal: controller.signal,
  };

  return {
    request() {
      return fetch(url, reqOptions).then((response) => {
        if (!response.ok) {
          switch (response.status) {
            case 400:
            case 401:
            case 403: {
              // eslint-disable-next-line
              // @ts-ignore
              return response.json() as iResponses[tEndpoint];
            }

            default:
              throw new NetworkError(response.status, response.statusText);
          }
        }
        // eslint-disable-next-line
        // @ts-ignore
        return response.json() as iResponses[tEndpoint];
      });
    },
    controller,
  };
}
