"use server";

import { InferAttributes } from "sequelize";

import { ItemFeature } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import {
  parseSellable,
  SellableJson,
  ThumbnailJson,
  ThumbnailUpdateAttributes,
} from "@/server/db/types";
import {
  parseSellableComponent,
  SellableComponentJson,
} from "@/server/db/types";
import { ItemJson, parseItem } from "@/server/db/types";

/**
 * Interface representing the JSON structure of an ItemFeature.
 */
export interface ItemFeatureJson extends InferAttributes<ItemFeature> {
  Items?: ItemJson[];
  SellableComponents?: SellableComponentJson[];
  Sellables?: (SellableJson & { SellableComponent?: SellableComponentJson })[];
  Thumbnail?: ThumbnailJson;
}

/**
 * Interface representing the attributes for updating an ItemFeature.
 */
export interface ItemFeatureUpdateAttributes
  extends Partial<InferAttributes<ItemFeature>> {
  Thumbnail?: ThumbnailUpdateAttributes;
}

/**
 * Parses an ItemFeature or its JSON representation into a fully populated ItemFeatureJson object.
 * @param if_ - The ItemFeature or its JSON representation to parse.
 * @returns A promise that resolves to an ItemFeatureJson object.
 */
export const parseItemFeature = async (
  if_: ItemFeature | StripMemberTypes<ItemFeatureJson>,
): Promise<ItemFeatureJson> => {
  if (if_ instanceof ItemFeature) {
    if_ = if_.toJSON() as StripMemberTypes<ItemFeatureJson>;
  }

  if (if_.Items) {
    if_.Items = await Promise.all(if_.Items.map(parseItem));
  }
  if (if_.SellableComponents) {
    if_.SellableComponents = await Promise.all(
      if_.SellableComponents.map(parseSellableComponent),
    );
  }
  if (if_.Sellables) {
    if_.Sellables = await Promise.all(
      if_.Sellables.map(
        async ({
          SellableComponent: sc,
          ...s
        }: StripMemberTypes<
          SellableJson & { SellableComponent?: SellableComponentJson }
        >) => ({
          ...(await parseSellable(s)),
          SellableComponent: sc ? await parseSellableComponent(sc) : undefined,
        }),
      ),
    );
  }

  return if_ as ItemFeatureJson;
};
