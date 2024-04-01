import { PrismaClient } from '@prisma/client';

export class PrismaSessionStorage {
  constructor(private prismaClient: PrismaClient) {}

  public async get(key: string) {
    const value = await this.prismaClient.telegrafSessions.findFirst({
      where: {
        key,
      },
    });

    // NOTE: check here expiry and delete

    return value ? JSON.parse(value.session) : undefined;
  }

  public set(key: string, value: unknown) {
    const session = JSON.stringify(value);

    return this.prismaClient.telegrafSessions.upsert({
      where: { key },
      create: { key, session },
      update: { key, session },
    });
  }

  public delete(key: string) {
    return this.prismaClient.telegrafSessions.delete({
      where: { key },
    });
  }
}
