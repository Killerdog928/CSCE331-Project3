"use server";

import { SellableCategory } from "@/db";
import {
  parseOptionalFindOptions,
  throwIfNotFound,
  parseFindOptions,
  throwIfNotUnique,
  throwIf,
} from "@/server/backend/utils";
import {
  ClientFindOptions,
  ClientWhereOptions,
  parseSellableCategory,
  SellableCategoryJson,
} from "@/server/db/types";

/**
 * Finds all SellableCategories based on the given options.
 * @param options - The options to filter the SellableCategories.
 * @returns A list of SellableCategoryJson.
 */
export async function findAllSellableCategories(
  options?: ClientFindOptions<SellableCategory>,
): Promise<SellableCategoryJson[]> {
  return await SellableCategory.findAll(parseOptionalFindOptions(options)).then(
    (is) => Promise.all(is.map(parseSellableCategory)),
  );
}

/**
 * Finds one SellableCategory based on the given options.
 * @param options - The options to filter the SellableCategory.
 * @returns The found SellableCategoryJson.
 */
export async function findOneSellableCategory(
  options?: ClientFindOptions<SellableCategory>,
): Promise<SellableCategoryJson> {
  return await SellableCategory.findOne(parseOptionalFindOptions(options))
    .then(throwIfNotFound("SellableCategory", options))
    .then(parseSellableCategory);
}

/**
 * Finds a unique SellableCategory based on the given options.
 * @param options - The options to filter the SellableCategory.
 * @returns The found SellableCategoryJson.
 */
export async function findUniqueSellableCategory(
  options: ClientFindOptions<SellableCategory>,
): Promise<SellableCategoryJson> {
  return await SellableCategory.findAll(parseFindOptions(options))
    .then(throwIfNotUnique("SellableCategory", options))
    .then(parseSellableCategory);
}

/**
 * Finds specific SellableCategories based on the given IDs or where options.
 * @param where - The IDs or where options to filter the SellableCategories.
 * @param options - Additional options for the find operation.
 * @returns A list of SellableCategoryJson.
 */
export async function findSpecificSellableCategories(
  where: number[] | ClientWhereOptions<SellableCategory>[],
  options?: ClientFindOptions<SellableCategory>,
): Promise<SellableCategoryJson[]> {
  return await SellableCategory.findAll(
    parseFindOptions({
      ...options,
      where,
    }),
  )
    .then(
      throwIf(
        (is) => is.length !== where.length,
        `Couldn't find specific sellable categories: ${where}`,
      ),
    )
    .then((is) => Promise.all(is.map(parseSellableCategory)));
}
