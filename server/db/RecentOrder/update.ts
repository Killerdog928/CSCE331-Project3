"use server";

import { UpdateOptions, InferAttributes, Transaction } from "sequelize";

import { RecentOrder, db } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import { RecentOrderUpdateAttributes, RecentOrderJson } from "@/server/db";
import { updateOrder } from "@/server/db";

/**
 * Updates a recent order and its related entities in the database.
 *
 * @param {RecentOrderUpdateAttributes} attributes - The attributes to update the recent order with.
 * @param {Omit<UpdateOptions<InferAttributes<RecentOrder>>, "where">} [options] - Optional update options.
 * @returns {Promise<RecentOrderJson>} The updated recent order as a JSON object.
 */
export async function updateRecentOrder(
  { id, Order: oInfo, OrderId: _oId, ...roInfo }: RecentOrderUpdateAttributes,
  options?: Omit<UpdateOptions<InferAttributes<RecentOrder>>, "where">,
): Promise<RecentOrderJson> {
  const updateInTransaction = async (transaction: Transaction) => {
    const pUpdateRecentOrder = RecentOrder.update(
      {
        ...roInfo,
      },
      {
        ...options,
        where: { id },
        returning: true,
        transaction,
      },
    ).then(([_, ros]) => ros[0]);

    const pUpdateOrder = oInfo
      ? updateOrder(oInfo, { transaction })
      : Promise.resolve(undefined);

    const [ro, _o] = await Promise.all([pUpdateRecentOrder, pUpdateOrder]);

    return ro.toJSON() as StripMemberTypes<RecentOrderJson>;
  };

  return options && options.transaction
    ? updateInTransaction(options.transaction)
    : db.transaction(updateInTransaction);
}

/**
 * Updates the status of a recent order by its order ID.
 *
 * @param {number} orderId - The ID of the order to update.
 * @param {number} newOrderStatus - The new status of the order.
 * @param {Omit<UpdateOptions<RecentOrder>, "where">} [options] - Optional update options.
 * @returns {Promise<RecentOrderJson | null>} The updated recent order as a JSON object, or null if not found.
 */
export async function updateRecentOrderByOrderId(
  orderId: number,
  newOrderStatus: number,
  options?: Omit<UpdateOptions<RecentOrder>, "where">,
): Promise<RecentOrderJson | null> {
  const updateInTransaction = async (transaction: Transaction) => {
    // Find the RecentOrder record by OrderId
    const recentOrder = await RecentOrder.findOne({
      where: { OrderId: orderId },
      transaction,
    });

    if (!recentOrder) {
      console.error(`No RecentOrder found for OrderId: ${orderId}`);

      return null;
    }

    // Update the orderStatus
    recentOrder.orderStatus = newOrderStatus;

    // Explicitly set the updatedAt field to the current time
    recentOrder.updatedAt = new Date();

    // Save changes to the database
    await recentOrder.save({ transaction });

    return recentOrder.toJSON() as StripMemberTypes<RecentOrderJson>;
  };

  return options && options.transaction
    ? updateInTransaction(options.transaction)
    : db.transaction(updateInTransaction);
}
