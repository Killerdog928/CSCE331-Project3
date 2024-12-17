"use server";

import { CreationAttributes } from "sequelize";

import {
  parseSellableCategory,
  SellableCategoryCreationAttributes,
  SellableCategoryJson,
} from "./types";

import { db, SellableCategory } from "@/db";
import { bulkCreateSellableCategories } from "@/server/backend/SellableCategory";

/**
 * Creates a new SellableCategory with the given attributes.
 * @param values - The attributes of the SellableCategory to create.
 * @returns The created SellableCategoryJson.
 */
export async function createSellableCategory(
  values: SellableCategoryCreationAttributes,
): Promise<SellableCategoryJson> {
  return await db
    .transaction((transaction) =>
      bulkCreateSellableCategories([values], { transaction }),
    )
    .then(([sc]) => parseSellableCategory(sc));
}

/**
 * Creates multiple SellableCategories with the given attributes.
 * @param values - The attributes of the SellableCategories to create.
 * @returns A list of created SellableCategoryJson.
 */
export async function createSellableCategories(
  values: CreationAttributes<SellableCategory>[],
): Promise<SellableCategoryJson[]> {
  return await db.transaction((transaction) =>
    SellableCategory.bulkCreate(values, { transaction }).then((is) =>
      Promise.all(is.map(parseSellableCategory)),
    ),
  );
}
