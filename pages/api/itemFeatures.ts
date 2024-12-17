// pages/api/itemFeatures.ts

import type { NextApiRequest, NextApiResponse } from "next";

import { findAllItemFeatures } from "../../server/db";

/**
 * API handler to fetch all item features from the database.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 *
 * @remarks
 * This function handles GET requests to retrieve item features from the database.
 * It uses the `findAllItemFeatures` function to fetch the data.
 *
 * @returns A JSON response containing the item features or an error message.
 *
 * @throws Will return a 500 status code if there is an error fetching item features.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Fetch all item features from the database
    const itemFeatures = await findAllItemFeatures(); // Implement this function in your db module

    res.status(200).json(itemFeatures);
  } catch (error) {
    console.error("Error fetching item features:", error);
    res.status(500).json({ error: "Failed to fetch item features" });
  }
}
