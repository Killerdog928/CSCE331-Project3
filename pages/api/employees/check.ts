import { NextApiRequest, NextApiResponse } from "next";

import { findEmployeeByEmail } from "@/server/backend/Employee"; // Adjust the path as necessary

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: "Method Not Allowed", message: "Use GET method" });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Email query parameter is required",
    });
  }

  try {
    // Fetch employee by email
    const employee = await findEmployeeByEmail(email);

    if (employee) {
      return res.status(200).json({
        exists: true,
        employee: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          jobPositionId: employee.JobPositionId, // Only jobPositionId is used
        },
      });
    } else {
      return res.status(200).json({
        exists: false,
        message: "Employee not found in the database",
      });
    }
  } catch (error: any) {
    console.error("Error in /api/employees/check:", error.message);

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
