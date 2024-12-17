"use server";

import { DestroyOptions, InferAttributes } from "sequelize";

import { JobPosition } from "@/db";

/**
 * Function to destroy a JobPosition based on destroy options.
 *
 * @param options - Destroy options.
 * @returns A promise that resolves when the JobPosition is destroyed.
 */
export async function destroyJobPosition(
  options: DestroyOptions<InferAttributes<JobPosition>>,
): Promise<void> {
  await JobPosition.destroy(options);
}
