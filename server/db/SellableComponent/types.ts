"use server";

import { InferAttributes, WhereOptions } from "sequelize";

import { ItemFeature, SellableComponent } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import { ItemFeatureJson, parseItemFeature, SellableJson } from "@/server/db";
import { safeParseFloat } from "@/utils";

/**
 * Interface representing the JSON structure of a SellableComponent.
 */
export interface SellableComponentJson
  extends InferAttributes<SellableComponent> {
  ItemFeature?: ItemFeatureJson;
  Sellable?: SellableJson;
}

/**
 * Interface for updating a SellableComponent with optional related entities.
 */
export interface SellableComponentUpdateAttributes
  extends Partial<InferAttributes<SellableComponent>> {
  id: number;
  ItemFeature?: WhereOptions<ItemFeature>;
}

/**
 * Parses a SellableComponent or its JSON representation.
 * @param sc - The SellableComponent or its JSON representation.
 * @returns The parsed SellableComponentJson.
 */
export const parseSellableComponent = async (
  sc: SellableComponent | StripMemberTypes<SellableComponentJson>,
): Promise<SellableComponentJson> => {
  if (sc instanceof SellableComponent) {
    sc = sc.toJSON() as StripMemberTypes<SellableComponentJson>;
  }

  sc.amount = safeParseFloat(sc.amount);

  if (sc.ItemFeature) {
    sc.ItemFeature = await parseItemFeature(sc.ItemFeature);
  }

  return sc as SellableComponentJson;
};
