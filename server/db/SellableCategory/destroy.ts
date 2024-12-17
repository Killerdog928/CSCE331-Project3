"use server";

import { DestroyOptions, InferAttributes } from "sequelize";

import { SellableCategory } from "@/db";

/**
 * Destroys a SellableCategory based on the given options.
 * @param options - The options to filter the SellableCategory to destroy.
 */
export async function destroySellableCategory(
  options: DestroyOptions<InferAttributes<SellableCategory>>,
): Promise<void> {
  await SellableCategory.destroy(options);
}
