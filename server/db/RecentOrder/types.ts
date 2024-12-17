"use server";

import { InferAttributes } from "sequelize";

import { RecentOrder } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  OrderJson,
  OrderUpdateAttributes,
  parseOrder,
} from "@/server/db/types";

/**
 * Represents a recent order as a JSON object.
 */
export interface RecentOrderJson extends InferAttributes<RecentOrder> {
  Order?: OrderJson;
}

/**
 * Attributes required to update an existing recent order.
 */
export interface RecentOrderUpdateAttributes
  extends Partial<InferAttributes<RecentOrder>> {
  id: number;
  Order?: OrderUpdateAttributes;
}

/**
 * Parses a recent order and its related entities.
 *
 * @param {RecentOrder | StripMemberTypes<RecentOrderJson>} ro - The recent order to parse.
 * @returns {Promise<RecentOrderJson>} The parsed recent order as a JSON object.
 */
export const parseRecentOrder = async (
  ro: RecentOrder | StripMemberTypes<RecentOrderJson>,
) => {
  if (ro instanceof RecentOrder) {
    ro = ro.toJSON() as StripMemberTypes<RecentOrderJson>;
  }

  if (ro.Order) {
    ro.Order = await parseOrder(ro.Order);
  }

  return ro as RecentOrderJson;
};
