"use server";

import { CreationAttributes, WhereOptions, InferAttributes } from "sequelize";

import { InventoryItem, Item, ItemFeature, Thumbnail } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  InventoryItemJson,
  InventoryItemUpdateAttributes,
  ItemFeatureJson,
  parseInventoryItem,
  parseItemFeature,
  parseSellable,
  parseSoldSellable,
  SellableJson,
  SoldSellableJson,
  ThumbnailJson,
  ThumbnailUpdateAttributes,
} from "@/server/db/types";
import { safeParseFloat } from "@/utils";

/**
 * Interface representing the JSON structure of an item.
 */
export interface ItemJson extends InferAttributes<Item> {
  InventoryItem?: InventoryItemJson;
  ItemFeatures?: ItemFeatureJson[];
  Sellables?: (SellableJson & { SoldSellable?: SoldSellableJson })[];
  SoldSellables?: SoldSellableJson[];
  Thumbnail?: ThumbnailJson;
}

/**
 * Interface representing the attributes required to create an item.
 */
export interface ItemCreationAttributes
  extends Omit<CreationAttributes<Item>, "InventoryItemId"> {
  InventoryItem?: Omit<CreationAttributes<InventoryItem>, "name">;
  ItemFeatures?: WhereOptions<ItemFeature>[];
  ItemFeatureIds?: number[];
  Thumbnail?: CreationAttributes<Thumbnail>;
}

/**
 * Interface representing the attributes required to update an item.
 */
export interface ItemUpdateAttributes extends Partial<InferAttributes<Item>> {
  id: number;
  InventoryItem?: Omit<InventoryItemUpdateAttributes, "Item">;
  ItemFeatures?: WhereOptions<ItemFeature>[];
  ItemFeatureIds?: number[];
  Thumbnail?: ThumbnailUpdateAttributes;
}

/**
 * Parses an item object to its JSON representation.
 * @param i - The item object to parse.
 * @returns The parsed item as a JSON object.
 */
export const parseItem = async (i: Item | StripMemberTypes<ItemJson>) => {
  if (i instanceof Item) {
    i = i.toJSON() as StripMemberTypes<ItemJson>;
  }

  i.additionalPrice = safeParseFloat(i.additionalPrice);

  if (i.InventoryItem) {
    i.InventoryItem = await parseInventoryItem(i.InventoryItem);
  }
  if (i.ItemFeatures) {
    i.ItemFeatures = await Promise.all(i.ItemFeatures.map(parseItemFeature));
  }
  if (i.Sellables) {
    i.Sellables = await Promise.all(
      i.Sellables.map(
        async ({
          SoldSellable: ss,
          ...s
        }: StripMemberTypes<
          SellableJson & { SoldSellable?: SoldSellableJson }
        >) => ({
          ...(await parseSellable(s)),
          SoldSellable: ss ? await parseSoldSellable(ss) : undefined,
        }),
      ),
    );
  }
  if (i.SoldSellables) {
    i.SoldSellables = await Promise.all(i.SoldSellables.map(parseSoldSellable));
  }

  return i as ItemJson;
};
