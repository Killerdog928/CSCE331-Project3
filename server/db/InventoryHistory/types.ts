"use server";

import { InferAttributes } from "sequelize";

import { InventoryHistory } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import { InventoryItemJson, parseInventoryItem } from "@/server/db/types";

// Interface representing the JSON structure of an InventoryHistory
export interface InventoryHistoryJson
  extends InferAttributes<InventoryHistory> {
  InventoryItem?: InventoryItemJson;
}

// Interface for updating InventoryHistory attributes
export interface InventoryHistoryUpdateAttributes
  extends Partial<InferAttributes<InventoryHistory>> {
  id: number;
  InventoryItem?: InventoryHistoryUpdateAttributes;
}

/**
 * Parses an InventoryHistory instance or JSON object into a fully populated InventoryHistoryJson.
 * @param ih - InventoryHistory instance or JSON object.
 * @returns Parsed InventoryHistoryJson.
 */
export const parseInventoryHistory = async (
  ih: InventoryHistory | StripMemberTypes<InventoryHistoryJson>,
) => {
  if (ih instanceof InventoryHistory) {
    ih = ih.toJSON() as StripMemberTypes<InventoryHistoryJson>;
  }

  if (ih.InventoryItem) {
    ih.InventoryItem = await parseInventoryItem(ih.InventoryItem);
  }

  return ih as InventoryHistoryJson;
};
