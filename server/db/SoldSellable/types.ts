"use server";

import { CreationAttributes, InferAttributes, WhereOptions } from "sequelize";

import { Sellable, SoldSellable } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  ItemJson,
  OrderJson,
  parseItem,
  parseOrder,
  parseSellable,
  parseSoldItem,
  SellableJson,
  SoldItemCreationAttributes,
  SoldItemJson,
} from "@/server/db/types";

/**
 * Interface representing the attributes required to create a SoldSellable.
 */
export interface SoldSellableCreationAttributes
  extends CreationAttributes<SoldSellable> {
  Sellable?: WhereOptions<Sellable>;
  SoldItems: SoldItemCreationAttributes[];
}

/**
 * Interface representing the JSON structure of a SoldSellable.
 */
export interface SoldSellableJson extends InferAttributes<SoldSellable> {
  Order?: OrderJson;
  Sellable?: SellableJson;
  SoldItems?: SoldItemJson[];
  Items?: (ItemJson & { SoldItem?: SoldItemJson })[];
}

/**
 * Parses a SoldSellable instance or JSON structure into a SoldSellableJson.
 * @param ss - The SoldSellable instance or JSON structure to parse.
 * @returns The parsed SoldSellableJson.
 */
export const parseSoldSellable = async (
  ss: SoldSellable | StripMemberTypes<SoldSellableJson>,
): Promise<SoldSellableJson> => {
  if (ss instanceof SoldSellable) {
    ss = ss.toJSON() as StripMemberTypes<SoldSellableJson>;
  }

  if (ss.Order) {
    ss.Order = await parseOrder(ss.Order);
  }
  if (ss.Sellable) {
    ss.Sellable = await parseSellable(ss.Sellable);
  }
  if (ss.SoldItems) {
    ss.SoldItems = await Promise.all(ss.SoldItems.map(parseSoldItem));
  }
  if (ss.Items) {
    ss.Items = await Promise.all(
      ss.Items.map(
        async ({
          SoldItem: si,
          ...i
        }: StripMemberTypes<ItemJson & { SoldItem?: SoldItemJson }>) => ({
          ...parseItem(i),
          SoldItem: si ? await parseSoldItem(si) : undefined,
        }),
      ),
    );
  }

  return ss as SoldSellableJson;
};
