"use server";

import { DestroyOptions, InferAttributes } from "sequelize";

import { Employee } from "@/db";

/**
 * Deletes an employee record from the database based on the provided options.
 *
 * @param options - The options to identify which employee record(s) to delete.
 * @returns A promise that resolves when the employee record(s) have been deleted.
 */
export async function destroyEmployee(
  options: DestroyOptions<InferAttributes<Employee>>,
): Promise<void> {
  await Employee.destroy(options);
}
