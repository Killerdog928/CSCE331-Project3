"use server";

import { UpdateOptions, InferAttributes, Transaction } from "sequelize";

import { db, InventoryHistory, InventoryItem, Thumbnail } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  InventoryItemJson,
  InventoryItemUpdateAttributes,
  parseInventoryItem,
  updateItem,
} from "@/server/db";

/**
 * Updates an inventory item and its related entities in the database.
 *
 * @param {InventoryItemUpdateAttributes} param0 - The attributes to update.
 * @param {Omit<UpdateOptions<InferAttributes<InventoryItem>>, "where">} [options] - Additional options for the update operation.
 * @returns {Promise<InventoryItemJson>} - The updated inventory item in JSON format.
 */
export async function updateInventoryItem(
  {
    id,
    InventoryHistory: ihInfo,
    Item: iInfo,
    Thumbnail: tInfo,
    ThumbnailId: _tId,
    ...iiInfo
  }: InventoryItemUpdateAttributes,
  options?: Omit<UpdateOptions<InferAttributes<InventoryItem>>, "where">,
): Promise<InventoryItemJson> {
  /**
   * Updates the inventory item and its related entities within a transaction.
   *
   * @param {Transaction} transaction - The transaction to use for the update operations.
   * @returns {Promise<InventoryItemJson>} - The updated inventory item in JSON format.
   */
  const updateInTransaction = async (transaction: Transaction) => {
    // Update the inventory item
    const pUpdateInventoryItem = InventoryItem.update(iiInfo, {
      ...options,
      where: { id },
      returning: true,
      transaction,
    }).then(([_, iis]) => iis[0]);

    // Update the inventory history if provided
    const pUpdateInventoryHistory = ihInfo
      ? InventoryHistory.update(ihInfo, {
          where: { id: ihInfo.id },
          returning: true,
          transaction,
        }).then(([_, ihs]) => ihs[0])
      : Promise.resolve(undefined);

    // Update the item if provided
    const pUpdateItem = iInfo
      ? updateItem(iInfo, {
          transaction,
        })
      : Promise.resolve(undefined);

    // Update the thumbnail if provided
    const pUpdateThumbnail = tInfo
      ? Thumbnail.update(tInfo, {
          where: { id: tInfo.id },
          returning: true,
          transaction,
        }).then(([_, ts]) => ts[0])
      : Promise.resolve(undefined);

    // Wait for all updates to complete
    const [ii, ih, i, t] = await Promise.all([
      pUpdateInventoryItem,
      pUpdateInventoryHistory,
      pUpdateItem,
      pUpdateThumbnail,
    ]);

    // Return the updated inventory item in JSON format
    return {
      ...ii.toJSON(),
      InventoryHistory: ih?.toJSON(),
      Item: i,
      Thumbnail: t?.toJSON(),
    } as StripMemberTypes<InventoryItemJson>;
  };

  // Execute the update within a transaction if provided, otherwise create a new transaction
  return await (
    options && options.transaction
      ? updateInTransaction(options.transaction)
      : db.transaction(updateInTransaction)
  ).then(parseInventoryItem);
}
