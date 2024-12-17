"use server";

import { CreationAttributes, InferAttributes, WhereOptions } from "sequelize";

import { Employee, JobPosition, Thumbnail } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  JobPositionJson,
  OrderJson,
  parseJobPosition,
  parseOrder,
  ThumbnailJson,
  ThumbnailUpdateAttributes,
} from "@/server/db/types";

// Interface representing the JSON structure of an Employee
export interface EmployeeJson extends InferAttributes<Employee> {
  JobPosition?: JobPositionJson;
  Orders?: OrderJson[];
  Thumbnail?: ThumbnailJson;
}

// Interface for creating a new Employee
export interface EmployeeCreationAttributes
  extends CreationAttributes<Employee> {
  JobPosition?: WhereOptions<JobPosition>;
  Thumbnail?: CreationAttributes<Thumbnail>;
}

// Interface for updating Employee attributes
export interface EmployeeUpdateAttributes
  extends Partial<InferAttributes<Employee>> {
  id: number;
  JobPosition?: WhereOptions<JobPosition>;
  Thumbnail?: ThumbnailUpdateAttributes;
}

/**
 * Parses an Employee instance or JSON object into a fully populated EmployeeJson.
 * @param e - Employee instance or JSON object.
 * @returns Parsed EmployeeJson.
 */
export const parseEmployee = async (
  e: Employee | StripMemberTypes<EmployeeJson>,
) => {
  if (e instanceof Employee) {
    e = e.toJSON() as StripMemberTypes<EmployeeJson>;
  }

  if (e.JobPosition) {
    e.JobPosition = await parseJobPosition(e.JobPosition);
  }
  if (e.Orders) {
    e.Orders = await Promise.all(e.Orders.map(parseOrder));
  }

  return e as EmployeeJson;
};
