import z from "zod";

const cantBeEmptyMessage = 'Field can\'t be emtpy';
export const createDealSchema = z.object({
  clientId: z.string({
    message: cantBeEmptyMessage,
  }),
  carId: z.string({
    message: cantBeEmptyMessage,
  }),
});

export type CreateDeal = z.infer<typeof createDealSchema>
