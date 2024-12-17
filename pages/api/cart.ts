import type { NextApiRequest, NextApiResponse } from "next";

import { findUniqueItem, findUniqueSellable } from "../../server/db";

/**
 * API handler for managing cart operations.
 *
 * This handler processes POST requests to add items to the cart.
 * It expects the request body to contain `selectedSides`, `selectedEntrees`, and `selectedEntreeType`.
 * The handler retrieves the unique items and sellable based on the provided names,
 * constructs an order structure, and responds with a success message.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 *
 * @returns A JSON response indicating the success or failure of the operation.
 *
 * @throws Will respond with a 500 status code and an error message if any error occurs during the process.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { selectedSides, selectedEntrees, selectedEntreeType } = req.body;

      const allItems = [...selectedSides, ...selectedEntrees].filter(Boolean);

      const itemPromises = allItems.map(async (item) => {
        const foundItem = await findUniqueItem({
          where: { name: item.name },
        });

        return foundItem ? { id: foundItem.id } : { name: item.name };
      });

      const sellable = await findUniqueSellable({
        where: { name: selectedEntreeType },
      });

      const itemsWithIds = await Promise.all(itemPromises);

      const _orderStructure = {
        customerName: "Placeholder Customer Name",
        totalPrice: 0,
        Employee: { id: 1 },
        SoldSellables: [
          {
            Items: itemsWithIds,
            Sellable: sellable
              ? { id: sellable.id }
              : { name: selectedEntreeType },
          },
        ],
      };

      res.status(200).json({ message: "Items added to cart successfully!" });
    } catch (error) {
      console.error("Error assembling order structure:", error);
      res.status(500).json({ error: "Failed to add items to cart" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
