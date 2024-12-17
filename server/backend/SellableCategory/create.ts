"use server";

import { CreateOptions, InferAttributes } from "sequelize";

import { SellableCategory, Thumbnail } from "@/db";
import { SellableCategoryCreationAttributes } from "@/server/db/types";

/**
 * Bulk creates sellable categories along with their associated thumbnails.
 *
 * @param values - An array of sellable category creation attributes, each possibly containing a Thumbnail.
 * @param options - Options for creating the sellable categories, including a transaction.
 * @returns A promise that resolves to an array of created SellableCategory instances.
 */
export async function bulkCreateSellableCategories(
  values: SellableCategoryCreationAttributes[],
  { transaction, ...options }: CreateOptions<InferAttributes<SellableCategory>>,
): Promise<SellableCategory[]> {
  const thumbnails = await Thumbnail.bulkCreate(
    values
      .filter(({ Thumbnail }) => Thumbnail)
      .map(({ Thumbnail }) => Thumbnail!),
    { transaction },
  );

  values = values.map(({ Thumbnail, ...scInfo }, i) =>
    Thumbnail ? { ThumbnailId: thumbnails[i].id, ...scInfo } : scInfo,
  );

  return await SellableCategory.bulkCreate(values, { transaction, ...options });
}
