"use server";

import { StripMemberTypes } from "../backend/utils";

import { db, Order, RecentOrder } from "@/db";

/**
 * Interface representing an item in the X report.
 * @interface
 */
export interface XReportItem {
  hour: Date;
  orderCount: number;
  total: number;
}

/**
 * Generates an X report.
 * @returns {Promise<XReportItem[]>} The X report data.
 */
export async function xReport(): Promise<XReportItem[]> {
  // Query to get the count of completed orders and their total price grouped by hour
  const [report, _] = await db.query(
    `
    SELECT
      date_trunc('hour', "orderDate") AS "hour",
      count("RecentOrder"."id") AS "orderCount",
      sum("totalPrice") AS "total"
    FROM "Orders" AS "Order"
    INNER JOIN "RecentOrders" AS "RecentOrder"
      ON "Order"."id" = "RecentOrder"."OrderId"
    WHERE "RecentOrder"."orderStatus" = ${RecentOrder.Status.COMPLETED}
    GROUP BY "hour"
    ORDER BY "hour" ASC
    `,
  );

  // Log the recent orders for debugging purposes
  console.log(
    (
      await RecentOrder.findAll({ include: [{ model: Order, required: true }] })
    ).map((o) => o.toJSON()),
  );

  // Return the parsed report data
  return report.map((item) => {
    const { hour, orderCount, total } = item as StripMemberTypes<XReportItem>;

    return {
      hour: new Date(hour),
      orderCount: orderCount ? parseInt(orderCount) : 0,
      total: total && isFinite(total) ? parseFloat(total) : 0,
    };
  });
}
