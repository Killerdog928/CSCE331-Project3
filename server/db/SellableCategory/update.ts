"use server";

import { UpdateOptions, InferAttributes, Transaction } from "sequelize";

import { db, SellableCategory } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  SellableCategoryJson,
  SellableCategoryUpdateAttributes,
  parseSellableCategory,
} from "@/server/db";

/**
 * Updates a SellableCategory with the given attributes.
 * @param id - The ID of the SellableCategory to update.
 * @param scInfo - The attributes to update.
 * @param options - Additional options for the update operation.
 * @returns The updated SellableCategoryJson.
 */
export async function updateSellableCategory(
  { id, ...scInfo }: SellableCategoryUpdateAttributes,
  options?: Omit<UpdateOptions<InferAttributes<SellableCategory>>, "where">,
): Promise<SellableCategoryJson> {
  const updateInTransaction = async (transaction: Transaction) => {
    const pUpdateSellableCategory = SellableCategory.update(scInfo, {
      ...options,
      where: { id },
      returning: true,
      transaction,
    }).then(([_, scs]) => scs[0]);

    const sc = await pUpdateSellableCategory;

    return {
      ...sc.toJSON(),
    } as StripMemberTypes<SellableCategoryJson>;
  };

  return await (
    options && options.transaction
      ? updateInTransaction(options.transaction)
      : db.transaction(updateInTransaction)
  ).then(parseSellableCategory);
}
