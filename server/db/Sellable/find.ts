"use server";

import { Sellable } from "@/db";
import {
  parseFindOptions,
  parseOptionalFindOptions,
  throwIf,
  throwIfNotFound,
  throwIfNotUnique,
} from "@/server/backend/utils";
import {
  ClientFindOptions,
  ClientWhereOptions,
  parseSellable,
  SellableJson,
} from "@/server/db/types";

/**
 * Finds all sellable items based on the provided options.
 *
 * @param {ClientFindOptions<Sellable>} [options] - Optional find options.
 * @returns {Promise<SellableJson[]>} A list of sellable items as JSON objects.
 */
export async function findAllSellables(
  options?: ClientFindOptions<Sellable>,
): Promise<SellableJson[]> {
  return await Sellable.findAll(parseOptionalFindOptions(options)).then((es) =>
    Promise.all(es.map(parseSellable)),
  );
}

/**
 * Finds a single sellable item based on the provided options.
 *
 * @param {ClientFindOptions<Sellable>} [options] - Optional find options.
 * @returns {Promise<SellableJson>} The found sellable item as a JSON object.
 */
export async function findOneSellable(
  options?: ClientFindOptions<Sellable>,
): Promise<SellableJson> {
  return await Sellable.findOne(parseOptionalFindOptions(options))
    .then(throwIfNotFound("Sellable", options))
    .then(parseSellable);
}

/**
 * Finds a unique sellable item based on the provided options.
 *
 * @param {ClientFindOptions<Sellable>} options - Find options.
 * @returns {Promise<SellableJson>} The found unique sellable item as a JSON object.
 */
export async function findUniqueSellable(
  options: ClientFindOptions<Sellable>,
): Promise<SellableJson> {
  return await Sellable.findAll(parseFindOptions(options))
    .then(throwIfNotUnique("Sellable", options))
    .then(parseSellable);
}

/**
 * Finds specific sellable items based on the provided where conditions.
 *
 * @param {number[] | ClientWhereOptions<Sellable>[]} where - The where conditions to find specific sellables.
 * @param {ClientFindOptions<Sellable>} [options] - Optional find options.
 * @returns {Promise<SellableJson[]>} A list of specific sellable items as JSON objects.
 */
export async function findSpecificSellables(
  where: number[] | ClientWhereOptions<Sellable>[],
  options?: ClientFindOptions<Sellable>,
): Promise<SellableJson[]> {
  return await Sellable.findAll(
    parseFindOptions({
      ...options,
      where,
    }),
  )
    .then(
      throwIf(
        (es) => es.length !== where.length,
        `Couldn't find specific sellables: ${where}`,
      ),
    )
    .then((es) => Promise.all(es.map(parseSellable)));
}
