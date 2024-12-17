import type { NextApiRequest, NextApiResponse } from "next";

import { createOrder } from "../../server/db"; // Ensure this points to your DB logic
/**
 * API handler to create a new order.
 *
 * This function handles POST requests to create a new order. It expects the request body
 * to contain `customerName`, `totalPrice`, and `SoldSellables`. If the request method is
 * not POST, it responds with a 405 status code. If the `totalPrice` is invalid or missing,
 * it responds with a 400 status code. On successful order creation, it responds with a 200
 * status code and the created order. If an error occurs during order creation, it responds
 * with a 500 status code.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 *
 * @returns A promise that resolves to void.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { customerName, totalPrice, SoldSellables } = req.body;

    if (typeof totalPrice !== "number" || totalPrice <= 0) {
      return res.status(400).json({ error: "Invalid or missing totalPrice." });
    }

    const createdOrder = await createOrder({
      customerName,
      totalPrice,
      SoldSellables,
    });

    res.status(200).json({ success: true, order: createdOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
}
