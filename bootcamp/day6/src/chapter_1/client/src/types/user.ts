//   id Int @id @default(autoincrement())
//   name String
//   role UserRoles @default(GUEST)

import { Order } from "./order"

export interface User {
  id: number;
  name: string;
  role: string;
  orders?: Order[];
}

export const enum UserRoles {
  ADMIN = 'ADMIM',
  GUEST = 'GUEST',
  WAITER = 'WAITER'
}


export const USERS_SLUG = 'users'
export const WAITERS_SLUG = 'waiters'
