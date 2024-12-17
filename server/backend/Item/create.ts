"use server";

import {
  BulkCreateOptions,
  CreationAttributes,
  InferAttributes,
} from "sequelize";

import { InventoryItem, Item, ItemFeature, Thumbnail } from "@/db";
import { place, throwIfNotUnique } from "@/server/backend/utils";
import { ItemCreationAttributes } from "@/server/db/types";

/**
 * Bulk creates items along with their associated InventoryItems, ItemFeatures, and Thumbnails.
 *
 * @param values - An array of item creation attributes, each containing optional InventoryItem, ItemFeatures, ItemFeatureIds, and Thumbnail.
 * @param options - Bulk create options including a transaction.
 * @returns A promise that resolves to an array of created items.
 *
 * @remarks
 * - If both ItemFeatureIds and ItemFeatures are provided, ItemFeatureIds will be used and ItemFeatures will be ignored with a warning.
 * - If both ThumbnailId and Thumbnail are provided, ThumbnailId will be used and Thumbnail will be ignored with a warning.
 * - InventoryItems, ItemFeatures, and Thumbnails are created in bulk and their IDs are associated with the respective items.
 * - ItemFeatures are cached to avoid duplicate creation.
 *
 * @throws Will throw an error if the creation of any associated entity fails.
 */
export async function bulkCreateItems(
  values: ItemCreationAttributes[],
  { transaction, ...options }: BulkCreateOptions<InferAttributes<Item>>,
): Promise<Item[]> {
  let itemFeatureIds = new Map<string, Promise<number>>();

  const iiInfos = values.map(({ InventoryItem: iiInfo, ...v }) => {
    if (!iiInfo) {
      console.warn(`bulkCreateItems: No InventoryItem specified for ${v}`);
    }

    return (
      iiInfo &&
      ({ ...iiInfo, name: v.name } as CreationAttributes<InventoryItem>)
    );
  });
  const pInventoryItemIds = InventoryItem.bulkCreate(
    iiInfos.filter((ii) => ii) as CreationAttributes<InventoryItem>[],
    { returning: ["id"], transaction },
  ).then((iis) =>
    place(
      iiInfos,
      iis.map((ii) => ii.id),
    ),
  );

  const pItemFeatureIds = Promise.all(
    values.map(async ({ ItemFeatures: ifInfos, ItemFeatureIds: ifIds }) => {
      if (ifIds) {
        if (ifInfos) {
          console.warn(
            `bulkCreateItems: ItemFeatureIds specified, ignoring ItemFeatures (${ifInfos})`,
          );
        }

        return ifIds;
      } else if (ifInfos) {
        return await Promise.all(
          ifInfos.map(async (ifInfo) => {
            const key = JSON.stringify(ifInfo);

            if (itemFeatureIds.has(key)) {
              return await itemFeatureIds.get(key)!;
            } else {
              const pItemFeatureId = ItemFeature.findAll({
                attributes: ["id"],
                where: ifInfo,
                transaction,
              })
                .then(throwIfNotUnique("ItemFeature", ifInfo))
                .then(({ id }) => id as number);

              itemFeatureIds.set(key, pItemFeatureId);

              return await pItemFeatureId;
            }
          }),
        );
      } else {
        return [];
      }
    }),
  );

  const tInfos = values.map(({ Thumbnail: tInfo, ...v }) => {
    if (v.ThumbnailId) {
      if (tInfo) {
        console.warn(
          `bulkCreateItems: ThumbnailId specified, ignoring Thumbnail (${tInfo})`,
        );
      }
    }

    return tInfo;
  });
  const pThumbnailIds = Thumbnail.bulkCreate(
    tInfos.filter((t) => t) as CreationAttributes<Thumbnail>[],
    { returning: ["id"], transaction },
  ).then((ts) =>
    place(
      tInfos,
      ts.map((t) => t.id),
    ),
  );

  const [iiIds, tIds] = await Promise.all([pInventoryItemIds, pThumbnailIds]);

  const items = await Item.bulkCreate(
    values.map(
      (
        {
          InventoryItem: _iiInfo,
          ItemFeatures: _ifInfo,
          ItemFeatureIds: _ifIds,
          Thumbnail: _tInfo,
          ...iInfo
        },
        i,
      ) => ({
        ...iInfo,
        InventoryItemId: iiIds[i],
        ThumbnailId: tIds[i],
      }),
    ),
    { transaction, ...options },
  );

  await Promise.all(
    (await pItemFeatureIds)
      .filter((ifIds) => ifIds)
      .map((ifIds, i) => items[i].setItemFeatures(ifIds, { transaction })),
  );

  return items;
}
