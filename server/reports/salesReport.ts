"use server";

import { StripMemberTypes } from "../backend/utils";

import { db } from "@/db";

export interface SalesReportJson {
  itemName: string;
  totalSold: number;
  totalRevenue: number;
}

export async function salesReport(
  timeRange: "daily" | "weekly" | "monthly",
): Promise<SalesReportJson[]> {
  let interval: string;

  switch (timeRange) {
    case "daily":
      interval = "day";
      break;
    case "weekly":
      interval = "week";
      break;
    case "monthly":
      interval = "month";
      break;
    default:
      throw new Error("Invalid time range");
  }

  const [report, _] = await db.query(
    `
    SELECT
      "Sellables"."name" AS "itemName",
      COUNT("SoldItem"."ItemId") AS "totalSold",
      COALESCE(SUM("Sellables"."price"), 0) AS "totalRevenue",
      date_trunc('${interval}', "SoldItem"."createdAt") AS "timePeriod"
    FROM "SoldItem"
    INNER JOIN "SoldSellables"
      ON "SoldItem"."SoldSellableId" = "SoldSellables"."id"
    INNER JOIN "Sellables"
      ON "SoldSellables"."SellableId" = "Sellables"."id"
    WHERE "Sellables"."deletedAt" IS NULL  -- Exclude deleted items
    GROUP BY "timePeriod", "Sellables"."id", "Sellables"."name"
    ORDER BY "timePeriod" ASC, "totalSold" DESC
    `,
  );

  return report.map((item) => {
    const { itemName, totalSold, totalRevenue } =
      item as StripMemberTypes<SalesReportJson>;

    return {
      itemName: String(itemName),
      totalSold: totalSold ? parseInt(totalSold) : 0,
      totalRevenue:
        totalRevenue && isFinite(totalRevenue) ? parseFloat(totalRevenue) : 0,
    };
  });
}
