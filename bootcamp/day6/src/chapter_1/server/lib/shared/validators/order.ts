import { Order, User } from "@prisma/client";
import { z } from "zod";

export const OrderValidator = z.object({
	userId: z.number().int().positive(),
	isActive: z.boolean(),
	items: z.array(z.number().int()).optional(),
})

export const PartialOrderValidator = OrderValidator.partial();

export type TOrder = z.infer<typeof OrderValidator>
export type TPartialOrder = z.infer<typeof PartialOrderValidator>
