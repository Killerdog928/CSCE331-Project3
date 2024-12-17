"use server";

import {
  SellableCreationAttributes,
  parseSellable,
  SellableJson,
} from "./types";

import { db } from "@/db";
import { bulkCreateSellables } from "@/server/backend/Sellable";

/**
 * Creates a new sellable item in the database.
 *
 * @param {SellableCreationAttributes} values - The attributes to create the sellable item with.
 * @returns {Promise<SellableJson>} The created sellable item as a JSON object.
 */
export async function createSellable(
  values: SellableCreationAttributes,
): Promise<SellableJson> {
  return await db
    .transaction((transaction) =>
      bulkCreateSellables([values], { transaction }),
    )
    .then(([e]) => parseSellable(e));
}

/**
 * Creates multiple new sellable items in the database.
 *
 * @param {SellableCreationAttributes[]} values - The attributes to create the sellable items with.
 * @returns {Promise<SellableJson[]>} A list of created sellable items as JSON objects.
 */
export async function createSellables(
  values: SellableCreationAttributes[],
): Promise<SellableJson[]> {
  return await db
    .transaction((transaction) => bulkCreateSellables(values, { transaction }))
    .then((es) => Promise.all(es.map(parseSellable)));
}
