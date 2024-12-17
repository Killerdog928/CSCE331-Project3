"use server";

import { InferAttributes } from "sequelize";

import { InventoryItem } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  InventoryHistoryJson,
  InventoryHistoryUpdateAttributes,
  ItemJson,
  ItemUpdateAttributes,
  parseInventoryHistory,
  parseItem,
  ThumbnailJson,
  ThumbnailUpdateAttributes,
} from "@/server/db/types";

// Interface representing the JSON structure of an InventoryItem
export interface InventoryItemJson extends InferAttributes<InventoryItem> {
  InventoryHistory?: InventoryHistoryJson;
  Item?: ItemJson;
  Thumbnail?: ThumbnailJson;
}

// Interface for updating InventoryItem attributes
export interface InventoryItemUpdateAttributes
  extends Partial<InferAttributes<InventoryItem>> {
  id: number;
  InventoryHistory?: Omit<InventoryHistoryUpdateAttributes, "InventoryItem">;
  Item?: Omit<ItemUpdateAttributes, "InventoryItem">;
  Thumbnail?: ThumbnailUpdateAttributes;
}

/**
 * Parses an InventoryItem instance or JSON object into a fully populated InventoryItemJson.
 * @param ii - InventoryItem instance or JSON object.
 * @returns Parsed InventoryItemJson.
 */
export const parseInventoryItem = async (
  ii: InventoryItem | StripMemberTypes<InventoryItemJson>,
) => {
  if (ii instanceof InventoryItem) {
    ii = ii.toJSON() as StripMemberTypes<InventoryItemJson>;
  }

  if (ii.InventoryHistory) {
    ii.InventoryHistory = await parseInventoryHistory(ii.InventoryHistory);
  }
  if (ii.Item) {
    ii.Item = await parseItem(ii.Item);
  }

  return ii;
};
