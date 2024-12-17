"use server";

import { DestroyOptions, InferAttributes } from "sequelize";

import { Order } from "@/db";

/**
 * Destroys an order in the database.
 * @param {DestroyOptions<InferAttributes<Order>>} options - Options to filter the order to be destroyed.
 * @returns {Promise<void>} A promise that resolves when the order is destroyed.
 */
export async function destroyOrder(
  options: DestroyOptions<InferAttributes<Order>>,
): Promise<void> {
  await Order.destroy(options);
}
