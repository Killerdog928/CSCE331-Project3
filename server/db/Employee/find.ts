"use server";

import { Employee } from "@/db";
import {
  parseFindOptions,
  parseOptionalFindOptions,
  throwIf,
  throwIfNotFound,
  throwIfNotUnique,
} from "@/server/backend/utils";
import {
  ClientFindOptions,
  parseEmployee,
  EmployeeJson,
  ClientWhereOptions,
} from "@/server/db/types";

/**
 * Finds all employees based on the provided options.
 * @param options - Options for finding employees.
 * @returns Array of EmployeeJson.
 */
export async function findAllEmployees(
  options?: ClientFindOptions<Employee>,
): Promise<EmployeeJson[]> {
  return await Employee.findAll(parseOptionalFindOptions(options)).then((es) =>
    Promise.all(es.map(parseEmployee)),
  );
}

/**
 * Finds one employee based on the provided options.
 * @param options - Options for finding an employee.
 * @returns EmployeeJson.
 */
export async function findOneEmployee(
  options?: ClientFindOptions<Employee>,
): Promise<EmployeeJson> {
  return await Employee.findOne(parseOptionalFindOptions(options))
    .then(throwIfNotFound("Employee", options))
    .then(parseEmployee);
}

/**
 * Finds a unique employee based on the provided options.
 * @param options - Options for finding a unique employee.
 * @returns EmployeeJson.
 */
export async function findUniqueEmployee(
  options: ClientFindOptions<Employee>,
): Promise<EmployeeJson> {
  return await Employee.findAll(parseFindOptions(options))
    .then(throwIfNotUnique("Employee", options))
    .then(parseEmployee);
}

/**
 * Finds specific employees based on the provided where conditions and options.
 * @param where - Conditions to find specific employees.
 * @param options - Options for finding employees.
 * @returns Array of EmployeeJson.
 */
export async function findSpecificEmployees(
  where: number[] | ClientWhereOptions<Employee>[],
  options?: ClientFindOptions<Employee>,
): Promise<EmployeeJson[]> {
  return await Employee.findAll(
    parseFindOptions({
      ...options,
      where,
    }),
  )
    .then(
      throwIf(
        (es) => es.length !== where.length,
        `Couldn't find specific employees: ${where}`,
      ),
    )
    .then((es) => Promise.all(es.map(parseEmployee)));
}
