// pages/api/itemFeatures/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";

import { findUniqueItemFeature } from "../../../server/db/ItemFeature"; // Adjust the import path as necessary

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Item Feature ID is required" });
  }

  try {
    const itemFeature = await findUniqueItemFeature({
      where: { id: Number(id) },
    });

    if (!itemFeature) {
      return res.status(404).json({ error: "Item Feature not found" });
    }

    res.status(200).json({ id: itemFeature.id, name: itemFeature.name });
  } catch (error) {
    console.error("Error fetching item feature:", error);
    res.status(500).json({ error: "Failed to fetch item feature" });
  }
}
