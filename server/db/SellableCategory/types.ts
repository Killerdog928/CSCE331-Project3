"use server";

import { CreationAttributes, InferAttributes } from "sequelize";

import { SellableCategory, Thumbnail } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  parseSellable,
  SellableJson,
  ThumbnailUpdateAttributes,
} from "@/server/db/types";

/**
 * Interface representing the JSON structure of a SellableCategory.
 */
export interface SellableCategoryJson
  extends InferAttributes<SellableCategory> {
  Sellables?: SellableJson[];
  Thumbnail?: InferAttributes<Thumbnail>;
}

/**
 * Interface for creating a SellableCategory with optional related entities.
 */
export interface SellableCategoryCreationAttributes
  extends CreationAttributes<SellableCategory> {
  Thumbnail?: CreationAttributes<Thumbnail>;
}

/**
 * Interface for updating a SellableCategory with optional related entities.
 */
export interface SellableCategoryUpdateAttributes
  extends Partial<InferAttributes<SellableCategory>> {
  id: number;
  Thumbnail?: ThumbnailUpdateAttributes;
}

/**
 * Parses a SellableCategory or its JSON representation.
 * @param sc - The SellableCategory or its JSON representation.
 * @returns The parsed SellableCategoryJson.
 */
export const parseSellableCategory = async (
  sc: SellableCategory | StripMemberTypes<SellableCategoryJson>,
): Promise<SellableCategoryJson> => {
  if (sc instanceof SellableCategory) {
    sc = sc.toJSON() as StripMemberTypes<SellableCategoryJson>;
  }

  if (sc.Sellables) {
    sc.Sellables = await Promise.all(sc.Sellables.map(parseSellable));
  }

  return sc as SellableCategoryJson;
};
