"use server";

import { OrderCreationAttributes, parseOrder, OrderJson } from "./types";

import { db } from "@/db";
import { bulkCreateOrders } from "@/server/backend/Order";

/**
 * Creates a new order in the database.
 * @param {OrderCreationAttributes} values - The attributes to create the order with.
 * @returns {Promise<OrderJson>} The created order as a JSON object.
 */
export async function createOrder(
  values: OrderCreationAttributes,
): Promise<OrderJson> {
  return await db
    .transaction((transaction) => bulkCreateOrders([values], { transaction }))
    .then(([e]) => parseOrder(e));
}

/**
 * Creates multiple new orders in the database.
 * @param {OrderCreationAttributes[]} values - The attributes to create the orders with.
 * @returns {Promise<OrderJson[]>} The created orders as JSON objects.
 */
export async function createOrders(
  values: OrderCreationAttributes[],
): Promise<OrderJson[]> {
  return await db
    .transaction((transaction) => bulkCreateOrders(values, { transaction }))
    .then((es) => Promise.all(es.map(parseOrder)));
}
