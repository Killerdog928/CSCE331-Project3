"use server";

import { Order } from "@/db";
import {
  parseFindOptions,
  parseOptionalFindOptions,
  throwIf,
  throwIfNotFound,
  throwIfNotUnique,
} from "@/server/backend/utils";
import {
  ClientFindOptions,
  parseOrder,
  OrderJson,
  ClientWhereOptions,
} from "@/server/db/types";

/**
 * Counts the number of orders in the database.
 * @param {ClientFindOptions<Order>} [options] - Options to filter the orders.
 * @returns {Promise<number>} The count of orders.
 */
export async function countOrders(
  options?: ClientFindOptions<Order>,
): Promise<number> {
  return await Order.count(parseOptionalFindOptions(options));
}

/**
 * Finds all orders in the database.
 * @param {ClientFindOptions<Order>} [options] - Options to filter the orders.
 * @returns {Promise<OrderJson[]>} The list of orders as JSON objects.
 */
export async function findAllOrders(
  options?: ClientFindOptions<Order>,
): Promise<OrderJson[]> {
  return await Order.findAll(parseOptionalFindOptions(options)).then((es) =>
    Promise.all(es.map(parseOrder)),
  );
}

/**
 * Finds one order in the database.
 * @param {ClientFindOptions<Order>} [options] - Options to filter the order.
 * @returns {Promise<OrderJson>} The found order as a JSON object.
 */
export async function findOneOrder(
  options?: ClientFindOptions<Order>,
): Promise<OrderJson> {
  return await Order.findOne(parseOptionalFindOptions(options))
    .then(throwIfNotFound("Order", options))
    .then(parseOrder);
}

/**
 * Finds a unique order in the database.
 * @param {ClientFindOptions<Order>} options - Options to filter the order.
 * @returns {Promise<OrderJson>} The found order as a JSON object.
 */
export async function findUniqueOrder(
  options: ClientFindOptions<Order>,
): Promise<OrderJson> {
  return await Order.findAll(parseFindOptions(options))
    .then(throwIfNotUnique("Order", options))
    .then(parseOrder);
}

/**
 * Finds specific orders in the database.
 * @param {number[] | ClientWhereOptions<Order>[]} where - The conditions to filter the orders.
 * @param {ClientFindOptions<Order>} [options] - Additional options to filter the orders.
 * @returns {Promise<OrderJson[]>} The list of found orders as JSON objects.
 */
export async function findSpecificOrders(
  where: number[] | ClientWhereOptions<Order>[],
  options?: ClientFindOptions<Order>,
): Promise<OrderJson[]> {
  return await Order.findAll(
    parseFindOptions({
      ...options,
      where,
    }),
  )
    .then(
      throwIf(
        (os) => os.length !== where.length,
        `Couldn't find specific orders: ${where}`,
      ),
    )
    .then((os) => Promise.all(os.map(parseOrder)));
}
