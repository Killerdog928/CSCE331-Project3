"use server";

import { Item } from "@/db";
import {
  parseOptionalFindOptions,
  throwIfNotFound,
  parseFindOptions,
  throwIfNotUnique,
  throwIf,
} from "@/server/backend/utils";
import {
  ClientFindOptions,
  parseItem,
  ItemJson,
  ClientWhereOptions,
} from "@/server/db/types";

/**
 * Finds all items based on the provided options.
 * @param options - Options to filter the items.
 * @returns An array of items as JSON objects.
 */
export async function findAllItems(
  options?: ClientFindOptions<Item>,
): Promise<ItemJson[]> {
  return await Item.findAll(parseOptionalFindOptions(options)).then((is) =>
    Promise.all(is.map(parseItem)),
  );
}

/**
 * Finds one item based on the provided options.
 * @param options - Options to filter the item.
 * @returns The found item as a JSON object.
 */
export async function findOneItem(
  options?: ClientFindOptions<Item>,
): Promise<ItemJson> {
  return await Item.findOne(parseOptionalFindOptions(options))
    .then(throwIfNotFound("Item", options))
    .then(parseItem);
}

/**
 * Finds a unique item based on the provided options.
 * @param options - Options to filter the item.
 * @returns The found unique item as a JSON object.
 */
export async function findUniqueItem(
  options: ClientFindOptions<Item>,
): Promise<ItemJson> {
  return await Item.findAll(parseFindOptions(options))
    .then(throwIfNotUnique("Item", options))
    .then(parseItem);
}

/**
 * Finds specific items based on the provided where conditions.
 * @param where - Conditions to filter the items.
 * @param options - Additional options to filter the items.
 * @returns An array of specific items as JSON objects.
 */
export async function findSpecificItems(
  where: number[] | ClientWhereOptions<Item>[],
  options?: ClientFindOptions<Item>,
): Promise<ItemJson[]> {
  return await Item.findAll(
    parseFindOptions({
      ...options,
      where,
    }),
  )
    .then(
      throwIf(
        (is) => is.length !== where.length,
        `Couldn't find specific items: ${where}`,
      ),
    )
    .then((is) => Promise.all(is.map(parseItem)));
}
