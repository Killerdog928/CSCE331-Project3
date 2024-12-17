"use server";

import { CreationAttributes } from "sequelize";

import { parseItemFeature, ItemFeatureJson } from "./types";

import { db, ItemFeature } from "@/db";

/**
 * Creates a new ItemFeature record.
 * @param values - The values to create the ItemFeature with.
 * @returns A promise that resolves to the created ItemFeatureJson object.
 */
export async function createItemFeature(
  values: CreationAttributes<ItemFeature>,
): Promise<ItemFeatureJson> {
  return await db
    .transaction((transaction) => ItemFeature.create(values, { transaction }))
    .then(parseItemFeature);
}

/**
 * Creates multiple new ItemFeature records.
 * @param values - The values to create the ItemFeatures with.
 * @returns A promise that resolves to an array of created ItemFeatureJson objects.
 */
export async function createItemFeatures(
  values: CreationAttributes<ItemFeature>[],
): Promise<ItemFeatureJson[]> {
  return await db.transaction((transaction) =>
    ItemFeature.bulkCreate(values, { transaction }).then((is) =>
      Promise.all(is.map(parseItemFeature)),
    ),
  );
}
