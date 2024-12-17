"use server";

import { ItemFeature } from "@/db";
import {
  parseOptionalFindOptions,
  throwIfNotFound,
  parseFindOptions,
  throwIfNotUnique,
  throwIf,
} from "@/server/backend/utils";
import {
  ClientFindOptions,
  parseItemFeature,
  ItemFeatureJson,
  ClientWhereOptions,
} from "@/server/db/types";

/**
 * Finds all ItemFeatures that match the given options.
 * @param options - Optional find options to filter the results.
 * @returns A promise that resolves to an array of ItemFeatureJson objects.
 */
export async function findAllItemFeatures(
  options?: ClientFindOptions<ItemFeature>,
): Promise<ItemFeatureJson[]> {
  return await ItemFeature.findAll(parseOptionalFindOptions(options)).then(
    (is) => Promise.all(is.map(parseItemFeature)),
  );
}

/**
 * Finds a single ItemFeature that matches the given options.
 * @param options - Optional find options to filter the results.
 * @returns A promise that resolves to an ItemFeatureJson object.
 */
export async function findOneItemFeature(
  options?: ClientFindOptions<ItemFeature>,
): Promise<ItemFeatureJson> {
  return await ItemFeature.findOne(parseOptionalFindOptions(options))
    .then(throwIfNotFound("ItemFeature", options))
    .then(parseItemFeature);
}

/**
 * Finds a unique ItemFeature that matches the given options.
 * @param options - Find options to filter the results.
 * @returns A promise that resolves to an ItemFeatureJson object.
 */
export async function findUniqueItemFeature(
  options: ClientFindOptions<ItemFeature>,
): Promise<ItemFeatureJson> {
  return await ItemFeature.findAll(parseFindOptions(options))
    .then(throwIfNotUnique("ItemFeature", options))
    .then(parseItemFeature);
}

/**
 * Finds specific ItemFeatures based on the given where conditions.
 * @param where - Array of IDs or where conditions to filter the results.
 * @param options - Optional find options to filter the results.
 * @returns A promise that resolves to an array of ItemFeatureJson objects.
 */
export async function findSpecificItemFeatures(
  where: number[] | ClientWhereOptions<ItemFeature>[],
  options?: ClientFindOptions<ItemFeature>,
): Promise<ItemFeatureJson[]> {
  return await ItemFeature.findAll(
    parseFindOptions({
      ...options,
      where,
    }),
  )
    .then(
      throwIf(
        (is) => is.length !== where.length,
        `Couldn't find specific item features: ${where}`,
      ),
    )
    .then((is) => Promise.all(is.map(parseItemFeature)));
}
