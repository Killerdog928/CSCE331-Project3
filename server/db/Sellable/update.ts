"use server";

import { InferAttributes, Transaction, UpdateOptions } from "sequelize";

import { db, Sellable, SellableComponent, Thumbnail } from "@/db";
import {
  findSpecificSellableCategories,
  parseSellable,
  SellableJson,
  SellableUpdateAttributes,
} from "@/server/db";

/**
 * Updates a sellable item and its related entities in the database.
 *
 * @param {SellableUpdateAttributes} attributes - The attributes to update the sellable item with.
 * @param {Omit<UpdateOptions<InferAttributes<Sellable>>, "where">} [options] - Optional update options.
 * @returns {Promise<SellableJson>} The updated sellable item as a JSON object.
 */
export async function updateSellable(
  {
    id,
    SellableCategories: scatInfos,
    SellableCategoryIds: scatIds,
    SellableComponents: scompInfos,
    Thumbnail: tInfo,
    ...sInfo
  }: SellableUpdateAttributes,
  options?: Omit<UpdateOptions<InferAttributes<Sellable>>, "where">,
): Promise<SellableJson> {
  const updateInTransaction = async (transaction: Transaction) => {
    const pUpdateSellable = Sellable.update(
      {
        ...sInfo,
      },
      {
        where: { id },
        returning: true,
        transaction,
      },
    ).then(([_, ss]) => ss[0]);

    const pUpdateSellableCategories =
      scatIds || scatInfos
        ? pUpdateSellable.then(async (s) => {
            const pSellableCategories = findSpecificSellableCategories(
              (scatIds || scatInfos)!,
              { transaction },
            );

            s.setSellableCategories(
              scatIds || (await pSellableCategories).map((scat) => scat.id),
              { transaction },
            );

            return await pSellableCategories;
          })
        : Promise.resolve(undefined);

    const pUpdateSellableComponents = scompInfos
      ? pUpdateSellable.then(async (s) => {
          const pSellableComponents = SellableComponent.bulkCreate(
            scompInfos.map((sc) => ({ ...sc, sellableId: s.id })),
            { returning: true, transaction },
          );

          s.setSellableComponents(
            (await pSellableComponents).map((sc) => sc.id),
            { transaction },
          );

          return await pSellableComponents;
        })
      : Promise.resolve(undefined);

    const pUpdateThumbnail = tInfo
      ? Thumbnail.update(tInfo, {
          where: { id: tInfo.id },
          returning: true,
          transaction,
        }).then(([_, ts]) => ts[0])
      : Promise.resolve(undefined);

    const [s, scats, scomps, t] = await Promise.all([
      pUpdateSellable,
      pUpdateSellableCategories,
      pUpdateSellableComponents,
      pUpdateThumbnail,
    ]);

    return {
      ...s.toJSON(),
      SellableCategories: scats,
      SellableComponents: scomps?.map((sc) => sc.toJSON()),
      Thumbnail: t?.toJSON(),
    } as SellableJson;
  };

  return (
    options && options.transaction
      ? updateInTransaction(options.transaction)
      : db.transaction(updateInTransaction)
  ).then(parseSellable);
}
