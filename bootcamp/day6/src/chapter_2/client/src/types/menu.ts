//  id Int @id @default(autoincrement())
//  title String
//  picture String
//  cost Float
//  CallQuantity Int
//  description String
//  orders Order[]

export interface MenuItem {
  id: number,
  title: string,
  picture: string,
  cost: number,
  callQuantity: number,
  description: string
}

export const MENU_SLUG = 'menu';
