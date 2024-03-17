export class NetworkError extends Error {
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
