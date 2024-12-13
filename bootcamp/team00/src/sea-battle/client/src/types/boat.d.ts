interface Boat {
  start?: [number, number], // x,y
  end?: [number, number], // x,y
  alignment?: 'vertical' | 'horizontal',
  size: number
  id: string;
}
