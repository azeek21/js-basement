import z from 'zod';

const cantBeEmptyMessage = 'Field can\'t be emtpy';

export const createClientSchema = z.object({
  firstName: z.string().min(1, cantBeEmptyMessage),
  lastName: z.string().min(1, cantBeEmptyMessage),
  middleName: z.string(),
  inn: z.string().min(1, cantBeEmptyMessage).regex(/^[0-9]*$/, "Inn should be only numbers"),
})

export type CreateClient = z.infer<typeof createClientSchema>;
