"use server";

import { CreationAttributes, InferAttributes, WhereOptions } from "sequelize";

import { Item, SoldItem } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  ItemJson,
  parseItem,
  parseSoldSellable,
  SoldSellableJson,
} from "@/server/db/types";
import { safeParseFloat } from "@/utils";

/**
 * Interface representing the JSON structure of a SoldItem.
 */
export interface SoldItemJson extends InferAttributes<SoldItem> {
  Item?: ItemJson;
  SoldSellable?: SoldSellableJson;
}

/**
 * Interface for creating a SoldItem with optional related entities.
 */
export interface SoldItemCreationAttributes
  extends Omit<CreationAttributes<SoldItem>, "ItemId" | "SoldSellableId"> {
  Item?: WhereOptions<Item>;
  ItemId?: number;
  SoldSellableId?: number; // used internally
}

/**
 * Parses a SoldItem or its JSON representation.
 * @param si - The SoldItem or its JSON representation.
 * @returns The parsed SoldItemJson.
 */
export const parseSoldItem = async (
  si: SoldItem | StripMemberTypes<SoldItemJson>,
): Promise<SoldItemJson> => {
  if (si instanceof SoldItem) {
    si = si.toJSON() as StripMemberTypes<SoldItemJson>;
  }

  si.amount = safeParseFloat(si.amount);

  if (si.Item) {
    si.Item = await parseItem(si.Item);
  }
  if (si.SoldSellable) {
    si.SoldSellable = await parseSoldSellable(si.SoldSellable);
  }

  return si as SoldItemJson;
};
