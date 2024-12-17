"use server";

import { UpdateOptions, InferAttributes, Transaction } from "sequelize";

import { updateInventoryItem } from "../InventoryItem/update";

import { db, Item, Thumbnail } from "@/db";
import { StripMemberTypes } from "@/server/backend/utils";
import { throwIf } from "@/server/backend/utils/then_transformers/throwIf";
import {
  findAllItemFeatures,
  ItemJson,
  ItemUpdateAttributes,
  parseItem,
} from "@/server/db";

/**
 * Updates an item and its related entities in the database.
 * @param itemUpdateAttributes - Attributes to update the item.
 * @param options - Additional options for the update operation.
 * @returns The updated item as a JSON object.
 */
export async function updateItem(
  {
    id,
    InventoryItem: iiInfo,
    InventoryItemId: _iiId,
    ItemFeatures: ifInfos,
    ItemFeatureIds: ifIds,
    Thumbnail: tInfo,
    ThumbnailId: _tId,
    ...iInfo
  }: ItemUpdateAttributes,
  options?: Omit<UpdateOptions<InferAttributes<Item>>, "where">,
): Promise<ItemJson> {
  const updateInTransaction = async (transaction: Transaction) => {
    const pUpdateItem = Item.update(iInfo, {
      ...options,
      where: { id },
      returning: true,
      transaction,
    }).then(([_, is]) => is[0]);

    const pUpdateInventoryItem = iiInfo
      ? updateInventoryItem(iiInfo, { transaction }).then((ii) => ii.id)
      : Promise.resolve(undefined);

    const pUpdateItemFeatures =
      ifIds || ifInfos
        ? pUpdateItem.then(async (i) => {
            const pItemFeatures = findAllItemFeatures({
              where: ifIds ? { id: ifIds } : { "Op.or": ifInfos },
              transaction,
            }).then(
              throwIf(
                (ifs) => ifs.length !== (ifIds || ifInfos)!.length,
                `Couldn't find specific item features: ${ifIds || ifInfos}`,
              ),
            );

            i.setItemFeatures(
              ifIds || (await pItemFeatures).map((if_) => if_.id),
              { transaction },
            );

            return await pItemFeatures;
          })
        : Promise.resolve(undefined);

    const pUpdateThumbnail = tInfo
      ? Thumbnail.update(tInfo, {
          where: { id: tInfo.id },
          returning: true,
          transaction,
        }).then(([_, ts]) => ts[0])
      : Promise.resolve(undefined);

    const [i, ii, ifs, t] = await Promise.all([
      pUpdateItem,
      pUpdateInventoryItem,
      pUpdateItemFeatures,
      pUpdateThumbnail,
    ]);

    return {
      ...i.toJSON(),
      InventoryItem: ii,
      ItemFeatures: ifs,
      Thumbnail: t?.toJSON(),
    } as StripMemberTypes<ItemJson>;
  };

  return (
    options && options.transaction
      ? updateInTransaction(options.transaction)
      : db.transaction(updateInTransaction)
  ).then(parseItem);
}
