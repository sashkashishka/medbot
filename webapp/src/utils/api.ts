import { tg } from './tg';

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

export function createApi(url: string, options?: RequestInit) {
  const controller = new AbortController();

  const reqOptions = {
    ...options,
    headers: {
      ...options?.headers,
      'x-webapp-info': tg.initData,
    },
    signal: controller.signal,
  };

  return {
    request<tResp>() {
      return fetch(url, reqOptions).then((response) => {
        if (!response.ok) {
          throw new NetworkError(response.status, response.statusText);
        }
        return response.json() as tResp;
      });
    },
    controller,
  };
}
