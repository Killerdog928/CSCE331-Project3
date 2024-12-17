"use server";

import {
  BulkCreateOptions,
  CreationAttributes,
  InferAttributes,
} from "sequelize";

import {
  ItemFeature,
  Sellable,
  SellableCategory,
  SellableComponent,
  Thumbnail,
} from "@/db";
import { place, throwIfNotUnique } from "@/server/backend/utils";
import { SellableCreationAttributes } from "@/server/db/types";

/**
 * Creates multiple sellable items in bulk, including their associated components, categories, and thumbnails.
 *
 * @param values - An array of sellable creation attributes.
 * @param options - Bulk create options including transaction and other options.
 * @returns A promise that resolves to an array of created sellable items.
 *
 * @throws Will throw an error if ItemFeature is not specified in SellableComponent.
 *
 * The function performs the following steps:
 * 1. Processes ItemFeatureIds and SellableCategoryIds for each sellable item.
 * 2. Creates thumbnails in bulk and maps them to the corresponding sellable items.
 * 3. Creates sellable items in bulk.
 * 4. Sets sellable categories for each created sellable item.
 * 5. Creates sellable components in bulk and associates them with the created sellable items.
 */
export async function bulkCreateSellables(
  values: SellableCreationAttributes[],
  { transaction, ...options }: BulkCreateOptions<InferAttributes<Sellable>>,
): Promise<Sellable[]> {
  let itemFeatureIds = new Map<string, Promise<number>>();
  let sellableCategoryIds = new Map<string, Promise<number>>();

  const pItemFeatureIds = Promise.all(
    values.map(({ SellableComponents: scInfos }) =>
      Promise.all(
        scInfos.map(
          async ({ ItemFeature: ifInfo, ItemFeatureId: ifId, ...v }) => {
            if (ifId) {
              if (ifInfo) {
                console.warn(
                  `bulkCreateSellables: ItemFeatureId specified, ignoring ItemFeature (${v})`,
                );
              }

              return ifId;
            } else if (ifInfo) {
              const key = JSON.stringify(ifInfo);

              if (itemFeatureIds.has(key)) {
                return await itemFeatureIds.get(key)!;
              } else {
                const pIfId = ItemFeature.findAll({
                  attributes: ["id"],
                  where: ifInfo,
                  transaction,
                })
                  .then(throwIfNotUnique("ItemFeature", ifInfo))
                  .then(({ id }) => id as number);

                itemFeatureIds.set(key, pIfId);

                return await pIfId;
              }
            } else {
              throw new Error(
                `bulkCreateSellables: ItemFeature not specified in SellableComponent`,
              );
            }
          },
        ),
      ),
    ),
  );

  const pSellableCategoryIds = Promise.all(
    values.map(
      async ({
        SellableCategories: scInfos,
        SellableCategoryIds: scIds,
        ...v
      }) => {
        if (scIds) {
          if (scInfos) {
            console.warn(
              `bulkCreateSellables: SellableCategoryIds specified, ignoring SellableCategories (${v})`,
            );
          }

          return scIds;
        } else if (scInfos) {
          return await Promise.all(
            scInfos.map(async (scInfo) => {
              const key = JSON.stringify(scInfo);

              if (sellableCategoryIds.has(key)) {
                return await sellableCategoryIds.get(key)!;
              } else {
                const pScId = SellableCategory.findAll({
                  attributes: ["id"],
                  where: scInfo,
                  transaction,
                })
                  .then(throwIfNotUnique("SellableCategory", scInfo))
                  .then(({ id }) => id);

                sellableCategoryIds.set(key, pScId);

                return await pScId;
              }
            }),
          );
        } else {
          return [];
        }
      },
    ),
  );

  const tInfos = values.map(({ Thumbnail: tInfo }) => tInfo);
  const pThumbnailIds = Thumbnail.bulkCreate(
    tInfos.filter((t) => t) as CreationAttributes<Thumbnail>[],
    { returning: ["id"], transaction },
  ).then((ts) =>
    place(
      tInfos,
      ts.map((t) => t.id as number),
    ),
  );

  const thumbnailIds = await pThumbnailIds;

  const sellables = await Sellable.bulkCreate(
    values.map(
      (
        {
          SellableCategories: _scatInfos,
          SellableCategoryIds: _scatIds,
          SellableComponents: _scompInfos,
          Thumbnail: _tInfo,
          ...v
        },
        idx,
      ) => ({
        ...v,
        ThumbnailId: thumbnailIds[idx],
      }),
    ),
    { transaction, ...options },
  );

  const pSetSellableCategories = pSellableCategoryIds.then((scIds) =>
    Promise.all(
      scIds.map((scIds, idx) =>
        sellables[idx].setSellableCategories(scIds, { transaction }),
      ),
    ),
  );
  const pCreateSellableComponents = pItemFeatureIds.then(async (ifIds) => {
    return await SellableComponent.bulkCreate(
      await Promise.all(
        ifIds
          .map((ifIds, sIdx) =>
            ifIds.map((ifId, scIdx) => {
              const { ItemFeature: _ifInfo, ...scInfo } =
                values[sIdx].SellableComponents[scIdx];

              return {
                ...scInfo,
                ItemFeatureId: ifId,
                SellableId: sellables[sIdx].id,
              };
            }),
          )
          .flat(),
      ),
      { transaction },
    );
  });

  await Promise.all([pSetSellableCategories, pCreateSellableComponents]);

  return sellables;
}
