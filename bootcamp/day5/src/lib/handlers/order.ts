import { PrismaClient } from "@prisma/client";
import { Handler } from "express";
import { OrderValidator, PartialOrderValidator } from "../shared/validators/order";


function getOrderById(db: PrismaClient): Handler {
	return async (req, res) => {
		const id = Number(req.params['id']);
		const found_order = await db.order.findFirst({
			where: {
				id,
			},
			include: {
				items: true,
			}
		})
		res.status(200).send(found_order);
	}
}

function getAllOrders(db: PrismaClient): Handler {
	return async (req, res) => {
		const orders = await db.order.findMany({
			include: {
				items: true,
			}
		});
		res.status(200).send(orders)
	}
}

function createOrder(db: PrismaClient): Handler {
	return async (req, res) => {
		const parse_res = OrderValidator.safeParse(req.body)

		if (!parse_res.success) {
			res.status(400).send(parse_res.error.flatten())
			return;
		}

		const safe_order = parse_res.data;
		const created_order = await db.order.create({
			data: {
				...safe_order,
				items: {
					connect: safe_order.items?.map(item => ({ id: item }))
				}
			},
			include: {
				items: true,
			}
		})

		console.log('created order: ', created_order);
		res.status(200).send(created_order);
	}
}

function updateOrder(db: PrismaClient): Handler {
	return async (req, res) => {
		const parse_res = PartialOrderValidator.safeParse(req.body)

		if (!parse_res.success) {
			res.status(400).send(parse_res.error.format())
			return;
		}

		const safe_order = parse_res.data;
		const id = req.params['id'];
		const updated_order = await db.order.update({
			where: {
				id: Number(id),
			},
			data: {
				...safe_order,
				items: {
					set: safe_order.items?.map(item => ({ id: item }))
				}
			}
		})

		console.log("update order: ", id, updated_order);
		res.status(200).send(updated_order);
	}
}


function deleteOrder(db: PrismaClient): Handler {
	return async (req, res) => {
		const id = Number(req.params['id']);
		const deleted = await db.order.delete({
			where: {
				id,
			}
		})

		console.log("delete order: ", id, deleted);

		res.status(200).send(deleted)
	}
}


export {
	deleteOrder,
	getAllOrders,
	createOrder,
	updateOrder,
	getOrderById,
}
