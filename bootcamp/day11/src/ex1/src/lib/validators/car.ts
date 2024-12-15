import z from 'zod';
export const createCarSchema = z.object({
  name: z.string().min(1, {
    message: 'Car name can\'t be emtpy',
  })
})

export type CreateCar = z.infer<typeof createCarSchema>;


