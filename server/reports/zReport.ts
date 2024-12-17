"use server";

import { StripMemberTypes } from "../backend/utils";

import { db, RecentOrder } from "@/db";

/**
 * Interface representing the JSON structure of the Z report.
 * @interface
 */
export interface ZReportJson {
  orderCount: number;
  total: number;
}

/**
 * Generates a Z report.
 * @returns {Promise<ZReportJson>} The Z report data.
 */
export async function zReport(): Promise<ZReportJson> {
  // Query to get the count of completed orders and their total price
  const [report, _] = await db.query(
    `
    SELECT
      count("Order"."id") AS "orderCount",
      sum("totalPrice") AS "total"
    FROM "Orders" AS "Order"
    INNER JOIN "RecentOrders" AS "RecentOrder"
      ON "Order"."id" = "RecentOrder"."OrderId"
    WHERE "RecentOrder"."orderStatus" = ${RecentOrder.Status.COMPLETED}
    `,
  );

  // Delete completed orders from RecentOrder
  await RecentOrder.destroy({
    where: {
      orderStatus: RecentOrder.Status.COMPLETED,
    },
  });

  const { orderCount, total } = report[0] as StripMemberTypes<ZReportJson>;

  // Return the parsed report data
  return {
    orderCount: orderCount ? parseInt(orderCount) : 0,
    total: total && isFinite(total) ? parseFloat(total) : 0,
  };
}
