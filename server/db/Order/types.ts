"use server";

import { CreationAttributes, InferAttributes, WhereOptions } from "sequelize";

import { Employee, Order, RecentOrder } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  EmployeeJson,
  parseEmployee,
  parseRecentOrder,
  parseSellable,
  parseSoldSellable,
  RecentOrderJson,
  RecentOrderUpdateAttributes,
  SellableJson,
  SoldSellableCreationAttributes,
  SoldSellableJson,
} from "@/server/db/types";
import { safeParseFloat } from "@/utils";

/**
 * Represents an order as a JSON object.
 */
export interface OrderJson extends InferAttributes<Order> {
  Employee?: EmployeeJson;
  RecentOrder?: RecentOrderJson;
  Sellables?: (SellableJson & { SoldSellable?: SoldSellableJson })[];
  SoldSellables?: SoldSellableJson[];
}

/**
 * Attributes required to create a new order.
 */
export interface OrderCreationAttributes extends CreationAttributes<Order> {
  Employee?: WhereOptions<Employee>;
  RecentOrder?: CreationAttributes<RecentOrder>;
  SoldSellables: SoldSellableCreationAttributes[];
}

/**
 * Attributes required to update an existing order.
 */
export interface OrderUpdateAttributes extends Partial<InferAttributes<Order>> {
  id: number;
  Employee?: WhereOptions<Employee>;
  RecentOrder?: Omit<RecentOrderUpdateAttributes, "Order" | "OrderId">;
  SoldSellables?: SoldSellableCreationAttributes[];
}

/**
 * Parses an order object or JSON representation into a consistent format.
 * @param {Order | StripMemberTypes<OrderJson>} o - The order object or JSON representation to parse.
 * @returns {Promise<OrderJson>} The parsed order as a JSON object.
 */
export const parseOrder = async (o: Order | StripMemberTypes<OrderJson>) => {
  if (o instanceof Order) {
    o = o.toJSON() as StripMemberTypes<OrderJson>;
  }

  o.totalPrice = safeParseFloat(o.totalPrice);

  if (o.Employee) {
    o.Employee = (await parseEmployee(o.Employee)) as EmployeeJson;
  }
  if (o.RecentOrder) {
    o.RecentOrder = (await parseRecentOrder(o.RecentOrder)) as RecentOrderJson;
  }
  if (o.Sellables) {
    o.Sellables = await Promise.all(o.Sellables.map(parseSellable));
  }
  if (o.SoldSellables) {
    o.SoldSellables = await Promise.all(o.SoldSellables.map(parseSoldSellable));
  }

  return o;
};
