export interface iUser {
  id: number;
  name?: string;
  surname?: string;
  patronymic?: string;
  birthDate?: string;
  topicForumId?: number;
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
  status: 'ACTIVE' | 'DONE';
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
  createdAt: string;
}
