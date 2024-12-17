import { EmployeeCreationAttributes } from "@/server/db/types";

/**
 * A list of employees to populate the database.
 * Each employee has a name, start date, job position, and optionally an email.
 *
 * @constant
 * @type {EmployeeCreationAttributes[]}
 *
 * @property {string} name - The name of the employee.
 * @property {Date} startDate - The start date of the employee.
 * @property {Object} JobPosition - The job position of the employee.
 * @property {string} JobPosition.name - The name of the job position.
 * @property {string} [email] - The optional email of the employee.
 */
export const employees: EmployeeCreationAttributes[] = [
  {
    name: "Marcel Reed",
    startDate: new Date("2024-09-14"),
    JobPosition: {
      name: "Manager",
    },
  },
  {
    name: "Mike Elko",
    startDate: new Date("2023-11-27"),
    JobPosition: {
      name: "Employee",
    },
  },
  {
    name: "John Helldiver",
    startDate: new Date("2024-02-08"),
    JobPosition: {
      name: "Employee",
    },
  },
  {
    name: "Daniel Manning",
    startDate: new Date("2024-02-08"),
    JobPosition: {
      name: "Manager",
    },
    email: "damanning911@tamu.edu",
  },
  {
    name: "Alex Kelley",
    startDate: new Date("2024-08-13"),
    JobPosition: {
      name: "Manager",
    },
    email: "arkelley77@gmail.com",
  },
];
