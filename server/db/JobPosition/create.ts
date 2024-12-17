"use server";

import { CreationAttributes } from "sequelize";

import { parseJobPosition, JobPositionJson } from "./types";

import { db, JobPosition } from "@/db";

/**
 * Function to create a single JobPosition.
 *
 * @param values - Creation attributes for the JobPosition.
 * @returns A promise that resolves to the created JobPosition JSON object.
 */
export async function createJobPosition(
  values: CreationAttributes<JobPosition>,
): Promise<JobPositionJson> {
  return await db
    .transaction((transaction) => JobPosition.create(values, { transaction }))
    .then(parseJobPosition);
}

/**
 * Function to create multiple JobPositions.
 *
 * @param values - Array of creation attributes for the JobPositions.
 * @returns A promise that resolves to an array of created JobPosition JSON objects.
 */
export async function createJobPositions(
  values: CreationAttributes<JobPosition>[],
): Promise<JobPositionJson[]> {
  return await db
    .transaction((transaction) =>
      JobPosition.bulkCreate(values, { transaction }),
    )
    .then((jps) => Promise.all(jps.map(parseJobPosition)));
}
