"use server";

import { UpdateOptions, InferAttributes, Transaction } from "sequelize";

import { db, Employee, Thumbnail } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  EmployeeJson,
  EmployeeUpdateAttributes,
  parseEmployee,
} from "@/server/db";
import { findUniqueJobPosition } from "@/server/db";

/**
 * Updates an employee's information in the database.
 * @param employeeUpdateAttributes - Attributes to update the employee.
 * @param options - Options for updating the employee.
 * @returns Updated EmployeeJson.
 */
export async function updateEmployee(
  {
    id,
    JobPosition: jpInfo,
    Thumbnail: tInfo,
    ...eInfo
  }: EmployeeUpdateAttributes,
  options?: Omit<UpdateOptions<InferAttributes<Employee>>, "where">,
): Promise<EmployeeJson> {
  const updateInTransaction = async (transaction: Transaction) => {
    // Find the job position if provided
    const pJobPosition =
      jpInfo || eInfo.JobPositionId
        ? findUniqueJobPosition({
            where: jpInfo || eInfo.JobPositionId,
            attributes: ["id"],
            transaction,
          })
        : Promise.resolve(undefined);

    // Update the thumbnail if provided
    const pUpdateThumbnail = tInfo
      ? Thumbnail.update(tInfo, {
          where: { id: tInfo.id },
          returning: true,
          transaction,
        }).then(([_, ts]) => ts[0])
      : Promise.resolve(undefined);

    const jp = await pJobPosition;

    // Update the employee information
    const pUpdateEmployee = Employee.update(
      {
        ...eInfo,
        JobPositionId: jp?.id,
      },
      {
        ...options,
        where: { id },
        returning: true,
        transaction,
      },
    ).then(([_, es]) => es[0]);

    const [e, t] = await Promise.all([pUpdateEmployee, pUpdateThumbnail]);

    if (!jp) {
      e.setJobPosition(undefined, { transaction });
    }

    return {
      ...e.toJSON(),
      JobPosition: jp,
      Thumbnail: t?.toJSON(),
    } as StripMemberTypes<EmployeeJson>;
  };

  return (
    options && options.transaction
      ? updateInTransaction(options.transaction)
      : db.transaction(updateInTransaction)
  ).then(parseEmployee);
}
