"use server";

import {
  EmployeeCreationAttributes,
  parseEmployee,
  EmployeeJson,
} from "./types";

import { db } from "@/db";
import { bulkCreateEmployees } from "@/server/backend/Employee";

/**
 * Creates a new employee record in the database.
 *
 * @param values - The attributes required to create a new employee.
 * @returns A promise that resolves to the JSON representation of the created employee.
 */
export async function createEmployee(
  values: EmployeeCreationAttributes,
): Promise<EmployeeJson> {
  return await db
    .transaction((transaction) =>
      bulkCreateEmployees([values], { transaction }),
    )
    .then(([e]) => parseEmployee(e));
}

/**
 * Creates multiple employees in the database.
 *
 * @param values - An array of employee creation attributes.
 * @returns A promise that resolves to an array of employee JSON objects.
 */
export async function createEmployees(
  values: EmployeeCreationAttributes[],
): Promise<EmployeeJson[]> {
  return await db
    .transaction((transaction) => bulkCreateEmployees(values, { transaction }))
    .then((es) => Promise.all(es.map(parseEmployee)));
}
