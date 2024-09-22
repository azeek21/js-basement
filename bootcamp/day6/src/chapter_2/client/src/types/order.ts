//  id Int @id @default(autoincrement())
//  isActive Boolean
//  user User @relation(fields: [userId], references: [id])
//  userId Int
//  items MenuItem[]

import { MenuItem } from "./menu";
import { User } from "./user";

export interface Order {
  id: number,
  isActive: boolean,
  items?: MenuItem[],
  user?: User
}

export const ORDERS_SLUG = 'orders';
