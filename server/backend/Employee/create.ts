"use server";

import {
  BulkCreateOptions,
  CreationAttributes,
  InferAttributes,
} from "sequelize";

import { Employee, JobPosition, Thumbnail } from "@/db";
import { place, throwIfNotUnique } from "@/server/backend/utils";
import { EmployeeCreationAttributes } from "@/server/db/types";

// Function to bulk create employees
/**
 * Bulk creates employees with associated job positions and thumbnails.
 *
 * @param values - An array of employee creation attributes.
 * @param options - Bulk create options including transaction.
 * @returns A promise that resolves to an array of created employees.
 *
 * @remarks
 * - If `ThumbnailId` is specified in the employee creation attributes, the `Thumbnail` information will be ignored.
 * - If `JobPositionId` is specified in the employee creation attributes, the `JobPosition` information will be ignored.
 * - Thumbnails are created in bulk and their IDs are assigned to the respective employees.
 * - Job positions are cached to avoid duplicate entries and their IDs are assigned to the respective employees.
 *
 * @example
 * ```typescript
 * const employees = await bulkCreateEmployees(employeeData, { transaction });
 * console.log(employees);
 * ```
 */
export async function bulkCreateEmployees(
  values: EmployeeCreationAttributes[],
  { transaction, ...options }: BulkCreateOptions<InferAttributes<Employee>>,
): Promise<Employee[]> {
  let jobPositionIds: Map<string, Promise<number>> = new Map(); // cache

  const tInfos = values.map(({ Thumbnail: tInfo, ...v }) => {
    if (v.ThumbnailId) {
      if (tInfo) {
        console.warn(
          `bulkCreateItems: ThumbnailId specified, ignoring Thumbnail (${tInfo})`,
        );
      }
    }

    return tInfo;
  });
  const pThumbnailIds = Thumbnail.bulkCreate(
    tInfos.filter((t) => t) as CreationAttributes<Thumbnail>[],
    { returning: ["id"], transaction },
  ).then((ts) =>
    place(
      tInfos,
      ts.map((t) => t.id),
    ),
  );

  const pEmployeeInfos = Promise.all(
    values.map(
      async ({ JobPosition: jInfo, Thumbnail: _tInfo, ...eInfo }, eIdx) => {
        if (eInfo.JobPositionId) {
          if (jInfo) {
            console.warn(
              `bulkCreateEmployees: JobPositionId specified, ignoring JobPosition (${jInfo})`,
            );
          }
        } else if (jInfo) {
          const key = JSON.stringify(jInfo);

          if (jobPositionIds.has(key)) {
            eInfo.JobPositionId = await jobPositionIds.get(key);
          } else {
            const pJobPositionId = JobPosition.findAll({
              attributes: ["id"],
              where: jInfo,
              transaction,
            })
              .then(throwIfNotUnique("JobPosition", jInfo))
              .then(({ id }) => id);

            jobPositionIds.set(key, pJobPositionId);
            eInfo.JobPositionId = await pJobPositionId;
          }
        }

        return {
          ...eInfo,
          ThumbnailId: (await pThumbnailIds)[eIdx],
        } as CreationAttributes<Employee>;
      },
    ),
  );

  const employees = await Employee.bulkCreate(await pEmployeeInfos, {
    transaction,
    ...options,
  });

  return employees;
}

// Function to find an employee by email
export async function findEmployeeByEmail(
  email: string,
): Promise<Employee | null> {
  if (!email) {
    throw new Error("Email must be provided to find an employee.");
  }

  try {
    const employee = await Employee.findOne({
      where: { email },
    });

    return employee;
  } catch (error) {
    console.error("Error finding employee by email:", error);
    throw error;
  }
}
