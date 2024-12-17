"use server";

import { ItemCreationAttributes, parseItem, ItemJson } from "./types";

import { db } from "@/db";
import { bulkCreateItems } from "@/server/backend/Item";

/**
 * Creates a new item in the database.
 * @param values - Attributes to create the item.
 * @returns The created item as a JSON object.
 */
export async function createItem(
  values: ItemCreationAttributes,
): Promise<ItemJson> {
  return await db
    .transaction((transaction) => bulkCreateItems([values], { transaction }))
    .then(([i]) => parseItem(i));
}

/**
 * Creates multiple new items in the database.
 * @param values - Array of attributes to create the items.
 * @returns An array of created items as JSON objects.
 */
export async function createItems(
  values: ItemCreationAttributes[],
): Promise<ItemJson[]> {
  return await db.transaction((transaction) =>
    bulkCreateItems(values, { transaction }).then((is) =>
      Promise.all(is.map(parseItem)),
    ),
  );
}
