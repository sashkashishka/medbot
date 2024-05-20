export interface iErrorResponse<tResp> {
  code: number;
  error: tResp;
}

export interface iUser {
  id: number;
  name?: string;
  surname?: string;
  patronymic?: string;
  birthDate?: string;
  topicForumId?: number;
  phone?: string;
  email?: string;
  timezoneOffset?: number;
  timeZone?: string;
}

export interface iProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  memberQty: number;
  subscriptionDuration: number;
}

export interface iOrder {
  id: number;
  status: 'WAITING_FOR_PAYMENT' | 'ACTIVE' | 'DONE';
  userId: number;
  productId: number;
  subscriptionEndsAt: string;
  createdAt: string;
}

export interface iAppointment {
  id: number;
  orderId: number;
  userId: number;
  complaints: string;
  complaintsStarted: string;
  medicine: string;
  chronicDiseases: string;
  time: string;
  status: 'ACTIVE' | 'DONE' | 'DELETED';
}

export interface iFreeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export type tNamespace = 'webapp' | 'medbot';

export type tLang = 'uk';

export interface iI18nConfig {
  ns: tNamespace;
  lang: tLang[];
}

export type tI18n = {
  id: number;
  key: string;
  namespace: tNamespace;
} & {
  [key in tLang]?: string;
};

export interface iI18nTranslation {
  id?: number;
  key: string;
  translation: string;
  ns: tNamespace;
  lang: tLang;
}
