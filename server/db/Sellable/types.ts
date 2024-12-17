"use server";

import { CreationAttributes, InferAttributes, WhereOptions } from "sequelize";

import {
  Sellable,
  Thumbnail,
  SellableComponent,
  ItemFeature,
  SellableCategory,
} from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  ItemFeatureJson,
  parseItemFeature,
  parseSellableCategory,
  parseSellableComponent,
  parseSoldSellable,
  SellableCategoryJson,
  SellableComponentJson,
  SoldSellableJson,
  ThumbnailUpdateAttributes,
} from "@/server/db/types";
import { safeParseFloat } from "@/utils";

/**
 * Represents a sellable item as a JSON object.
 */
export interface SellableJson extends InferAttributes<Sellable> {
  SellableComponents?: SellableComponentJson[];
  SoldSellables?: SoldSellableJson[];
  ItemFeatures?: (ItemFeatureJson & {
    SellableComponent?: SellableComponentJson;
  })[];
  SellableCategories?: SellableCategoryJson[];
  Thumbnail?: InferAttributes<Thumbnail>;
}

/**
 * Attributes required to create a new sellable item.
 */
export interface SellableCreationAttributes
  extends CreationAttributes<Sellable> {
  SellableCategories?: WhereOptions<SellableCategory>[];
  SellableCategoryIds?: number[];
  SellableComponents: (CreationAttributes<SellableComponent> & {
    ItemFeature?: WhereOptions<ItemFeature>;
  })[];
  Thumbnail?: CreationAttributes<Thumbnail>;
}

/**
 * Attributes required to update an existing sellable item.
 */
export interface SellableUpdateAttributes
  extends Partial<InferAttributes<Sellable>> {
  id: number;
  SellableCategories?: WhereOptions<SellableCategory>[];
  SellableCategoryIds?: number[];
  SellableComponents: (CreationAttributes<SellableComponent> & {
    ItemFeature?: WhereOptions<ItemFeature>;
  })[];
  Thumbnail?: ThumbnailUpdateAttributes;
}

/**
 * Parses a sellable item and its related entities.
 *
 * @param {Sellable | StripMemberTypes<SellableJson>} s - The sellable item to parse.
 * @returns {Promise<SellableJson>} The parsed sellable item as a JSON object.
 */
export const parseSellable = async (
  s: Sellable | StripMemberTypes<SellableJson>,
) => {
  if (s instanceof Sellable) {
    s = s.toJSON() as StripMemberTypes<SellableJson>;
  }

  s.price = safeParseFloat(s.price);

  if (s.SellableComponents) {
    s.SellableComponents = await Promise.all(
      s.SellableComponents.map(parseSellableComponent),
    );
  }
  if (s.SoldSellables) {
    s.SoldSellables = await Promise.all(s.SoldSellables.map(parseSoldSellable));
  }
  if (s.ItemFeatures) {
    s.ItemFeatures = await Promise.all(
      s.ItemFeatures.map(
        async ({
          SellableComponent: sc,
          ...if_
        }: StripMemberTypes<
          ItemFeatureJson & { SellableComponent?: SellableComponentJson }
        >) => ({
          ...(await parseItemFeature(if_)),
          SellableComponent: sc ? await parseSellableComponent(sc) : undefined,
        }),
      ),
    );
  }
  if (s.SellableCategories) {
    s.SellableCategories = await Promise.all(
      s.SellableCategories.map(parseSellableCategory),
    );
  }

  return s as SellableJson;
};
