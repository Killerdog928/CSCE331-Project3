import { CreationAttributes } from "sequelize";

import { JobPosition } from "@/db";

/**
 * An array of job positions with their respective access flags.
 *
 * Each job position includes:
 * - `name`: The name of the job position.
 * - `access`: The access level associated with the job position, defined by `JobPosition.AccessFlags`.
 *
 * @constant
 * @type {CreationAttributes<JobPosition>[]}
 *
 * @example
 * // Example usage:
 * const positions = jobPositions.map(position => position.name);
 * console.log(positions); // Output: ["Employee", "Manager", "Goated", "Savior of Humanity", "Super Private"]
 */
export const jobPositions: CreationAttributes<JobPosition>[] = [
  {
    name: "Employee",
    access: JobPosition.AccessFlags.BASIC_ORDERING,
  },
  {
    name: "Manager",
    access: JobPosition.AccessFlags.ALL,
  },
  {
    name: "Goated",
    access: JobPosition.AccessFlags.ALL,
  },
  {
    name: "Savior of Humanity",
    access: JobPosition.AccessFlags.ALL,
  },
  {
    name: "Super Private",
    access: JobPosition.AccessFlags.ALL,
  },
];
