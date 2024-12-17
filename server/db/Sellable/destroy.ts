"use server";

import { DestroyOptions, InferAttributes } from "sequelize";

import { Sellable } from "@/db";

/**
 * Destroys a sellable item based on the provided options.
 *
 * @param {DestroyOptions<InferAttributes<Sellable>>} options - The options to destroy the sellable item.
 * @returns {Promise<void>} A promise that resolves when the sellable item is destroyed.
 */
export async function destroySellable(
  options: DestroyOptions<InferAttributes<Sellable>>,
): Promise<void> {
  await Sellable.destroy(options);
}
