// pages/api/items.ts

import type { NextApiRequest, NextApiResponse } from "next";

import { findAllItems } from "../../server/db";

export interface Item {
  id?: number;
  name: string;
  additionalPrice: number;
  calories: number;
  seasonalStart: Date | null;
  seasonalEnd: Date | null;
  deletedAt?: Date;
  ItemFeatures?: { name: string }[] | null;
}

/**
 * API handler to fetch and filter items based on query parameters.
 *
 * This handler supports filtering items by including or excluding specific features.
 * Query parameters:
 * - `includeFeatures`: A comma-separated list of features to include.
 * - `excludeFeatures`: A comma-separated list of features to exclude.
 *
 * The handler performs the following steps:
 * 1. Extracts `includeFeatures` and `excludeFeatures` from the query parameters.
 * 2. Converts the query parameters into arrays of strings.
 * 3. Fetches all items including their features.
 * 4. Filters the items based on the included and excluded features.
 * 5. Returns the filtered items as a JSON response.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A JSON response containing the filtered items or an error message.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Extract 'includeFeatures' and 'excludeFeatures' from query parameters
    const includeFeaturesParam = req.query.includeFeatures;
    const excludeFeaturesParam = req.query.excludeFeatures;

    // Convert query parameters into arrays of strings
    const includeFeatures = includeFeaturesParam
      ? (Array.isArray(includeFeaturesParam)
          ? includeFeaturesParam
          : [includeFeaturesParam]
        ).flatMap((f) => f.split(","))
      : [];
    const excludeFeatures = excludeFeaturesParam
      ? (Array.isArray(excludeFeaturesParam)
          ? excludeFeaturesParam
          : [excludeFeaturesParam]
        ).flatMap((f) => f.split(","))
      : [];

    // Fetch all items including their features
    const items: Item[] = await findAllItems({
      include: [
        {
          model: "ItemFeature",
          as: "ItemFeatures",
          attributes: ["name"],
        },
      ],
    });

    // Filter items based on included and excluded features
    const filteredItems = items.filter((item) => {
      const itemFeatures = item.ItemFeatures || [];
      const itemFeatureNames = itemFeatures.map((f) => f.name);

      // Check for included features
      const hasAllIncludeFeatures =
        includeFeatures.length === 0 ||
        includeFeatures.every((feature) => itemFeatureNames.includes(feature));

      // Check for excluded features
      const hasAnyExcludeFeatures = excludeFeatures.some((feature) =>
        itemFeatureNames.includes(feature),
      );

      return hasAllIncludeFeatures && !hasAnyExcludeFeatures;
    });

    res.status(200).json(filteredItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
}
