import type { NextApiRequest, NextApiResponse } from "next";

import { findUniqueItem } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Item ID is required" });
  }

  try {
    const item = await findUniqueItem({ where: { id: Number(id) } });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ name: item.name });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ error: "Failed to fetch item" });
  }
}
