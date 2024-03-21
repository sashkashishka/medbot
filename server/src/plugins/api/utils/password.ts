import { pbkdf2Sync } from 'node:crypto';

export function encryptPassword(password: string, salt: string) {
  return pbkdf2Sync(password, salt, 5, 40, 'sha256').toString('hex');
}
