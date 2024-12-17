"use server";

import { InferAttributes } from "sequelize";

import { JobPosition } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import { EmployeeJson, parseEmployee } from "@/server/db/types";

/**
 * Interface representing the JSON structure of a JobPosition, including optional Employees.
 */
export interface JobPositionJson extends InferAttributes<JobPosition> {
  Employees?: EmployeeJson[];
}

/**
 * Interface for updating JobPosition attributes, requiring an id.
 */
export interface JobPositionUpdateAttributes
  extends Partial<InferAttributes<JobPosition>> {
  id: number;
}

/**
 * Function to parse a JobPosition or its JSON representation.
 *
 * @param jp - The JobPosition instance or its JSON representation.
 * @returns The parsed JobPosition JSON.
 */
export const parseJobPosition = async (
  jp: JobPosition | StripMemberTypes<JobPositionJson>,
): Promise<JobPositionJson> => {
  if (jp instanceof JobPosition) {
    jp = jp.toJSON() as StripMemberTypes<JobPositionJson>;
  }

  if (jp.Employees) {
    jp.Employees = await Promise.all(jp.Employees.map(parseEmployee));
  }

  return jp as JobPositionJson;
};
