"use server";

import { DestroyOptions, InferAttributes } from "sequelize";

import { Item } from "@/db";

/**
 * Destroys an item based on the provided options.
 * @param options - Options to filter the item to be destroyed.
 */
export async function destroyItem(
  options: DestroyOptions<InferAttributes<Item>>,
): Promise<void> {
  await Item.destroy(options);
}
