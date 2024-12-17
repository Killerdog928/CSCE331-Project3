"use server";

import { DestroyOptions, InferAttributes } from "sequelize";

import { ItemFeature } from "@/db";

/**
 * Destroys ItemFeature records that match the given options.
 * @param options - Options to filter which records to destroy.
 * @returns A promise that resolves when the operation is complete.
 */
export async function destroyItemFeature(
  options: DestroyOptions<InferAttributes<ItemFeature>>,
): Promise<void> {
  await ItemFeature.destroy(options);
}
