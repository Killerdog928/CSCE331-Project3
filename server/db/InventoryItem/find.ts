"use server";

import { InventoryItem } from "@/db";
import {
  parseFindOptions,
  parseOptionalFindOptions,
  throwIf,
  throwIfNotFound,
  throwIfNotUnique,
} from "@/server/backend/utils";
import {
  ClientFindOptions,
  parseInventoryItem,
  InventoryItemJson,
  ClientWhereOptions,
} from "@/server/db/types";

/**
 * Finds all inventory items based on the provided options.
 * @param options - Options for finding inventory items.
 * @returns Array of InventoryItemJson.
 */
export async function findAllInventoryItems(
  options?: ClientFindOptions<InventoryItem>,
): Promise<InventoryItemJson[]> {
  return await InventoryItem.findAll(parseOptionalFindOptions(options)).then(
    (items) => Promise.all(items.map(parseInventoryItem)),
  );
}

/**
 * Finds one inventory item based on the provided options.
 * @param options - Options for finding an inventory item.
 * @returns InventoryItemJson.
 */
export async function findOneInventoryItem(
  options?: ClientFindOptions<InventoryItem>,
): Promise<InventoryItemJson> {
  return await InventoryItem.findOne(parseOptionalFindOptions(options))
    .then(throwIfNotFound("InventoryItem", options))
    .then(parseInventoryItem);
}

/**
 * Finds a unique inventory item based on the provided options.
 * @param options - Options for finding a unique inventory item.
 * @returns InventoryItemJson.
 */
export async function findUniqueInventoryItem(
  options: ClientFindOptions<InventoryItem>,
): Promise<InventoryItemJson> {
  return await InventoryItem.findAll(parseFindOptions(options))
    .then(throwIfNotUnique("InventoryItem", options))
    .then(parseInventoryItem);
}

/**
 * Finds specific inventory items based on the provided where conditions and options.
 * @param where - Conditions to find specific inventory items.
 * @param options - Options for finding inventory items.
 * @returns Array of InventoryItemJson.
 */
export async function findSpecificInventoryItems(
  where: number[] | ClientWhereOptions<InventoryItem>[],
  options?: ClientFindOptions<InventoryItem>,
): Promise<InventoryItemJson[]> {
  return await InventoryItem.findAll(
    parseFindOptions({
      ...options,
      where,
    }),
  )
    .then(
      throwIf(
        (items) => items.length !== where.length,
        `Couldn't find specific inventory items: ${where}`,
      ),
    )
    .then((items) => Promise.all(items.map(parseInventoryItem)));
}
