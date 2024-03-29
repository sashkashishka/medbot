export interface iAdmin {
  id: number;
  name: string;
}

export interface iLogin {
  name: string;
  password: string;
}

export interface iRegister extends iLogin {}

export interface iAdminConfig {
  forumUrlTemplate: string;
  googleEmail: string;
}

export interface iPaginatorResp<T> {
  items: T[];
  count: number;
}

// TODO think how to share types between webapp and admin
export interface iUser {
  id: number;
  name?: string;
  surname?: string;
  patronymic?: string;
  birthDate?: string;
  messageThreadId?: number;
  botChatId?: number;
  phone?: string;
  email?: string;
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
  timezoneOffset: string;
  status: 'ACTIVE' | 'DONE' | 'DELETED';
  calendarEventId: string;
  report: string;
  treatment: string;
}

export interface iFreeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface iSendMessageBody {
  botChatId: iUser['botChatId'];
  text: string;
}
