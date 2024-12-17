// pages/api/closest-item.ts

import type { NextApiRequest, NextApiResponse } from "next";

import stringSimilarity from "string-similarity-js"; // New string similarity package

import { findAllItems } from "../../server/db";

export interface Item {
  id: number;
  name: string;
  additionalPrice: number;
  calories: number;
  seasonalStart: Date | null;
  seasonalEnd: Date | null;
  deletedAt?: Date;
}

/**
 * API handler to find the closest matching item based on a given name.
 *
 * This function extracts the `name` query parameter from the request, fetches all items from the database,
 * and calculates the similarity between the given name and each item name in the database. It then returns
 * the item with the highest similarity score.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 *
 * @returns A JSON response containing the closest matching item or an error message.
 *
 * @throws Will return a 400 status code if the `name` parameter is missing.
 * @throws Will return a 404 status code if no items are found in the database or if no close match is found.
 * @throws Will return a 500 status code if there is an error during the process.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Extract the `name` query parameter and ensure it's a string
    const name = req.query.name as string;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Missing required 'name' parameter." });
    }

    // Fetch all items from the database
    const items: Item[] = await findAllItems();

    if (!items.length) {
      return res.status(404).json({ error: "No items found in the database." });
    }

    // Extract item names
    const itemNames = items.map((item) => item.name);

    // Initialize variables to track the best match
    let bestMatchScore = 0;
    let closestItem: Item | undefined = items.find(
      (item) => itemNames[0] === item.name,
    );

    // Loop through all item names and calculate the similarity
    itemNames.forEach((itemName) => {
      const score = stringSimilarity(name, itemName);

      // Update best match if current score is higher
      if (score > bestMatchScore) {
        bestMatchScore = score;
        closestItem = items.find((item) => item.name === itemName);
      }
    });

    // If closest item is not found, return an error
    if (!closestItem) {
      return res.status(404).json({ error: "Closest match not found." });
    }

    // Replace the input name with the closest item's name
    req.query.name = closestItem.name;

    // Return the closest item with the corrected name
    res.status(200).json(closestItem);
  } catch (error) {
    console.error("Error finding closest item:", error);
    res.status(500).json({ error: "Failed to fetch the closest item." });
  }
}
