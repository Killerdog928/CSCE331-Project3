"use server";
import {
  BulkCreateOptions,
  CreationAttributes,
  InferAttributes,
} from "sequelize";

import {
  Employee,
  Item,
  Order,
  RecentOrder,
  Sellable,
  SoldItem,
  SoldSellable,
} from "@/db";
import { throwIfNotUnique } from "@/server/backend/utils";
import { OrderCreationAttributes } from "@/server/db/types";

/**
 * Creates multiple orders in bulk, along with their associated entities such as RecentOrders, SoldSellables, and SoldItems.
 *
 * @param values - An array of order creation attributes.
 * @param options - Bulk create options including transaction and other options.
 * @returns A promise that resolves to an array of created orders.
 *
 * The function performs the following steps:
 * 1. Finds or creates EmployeeIds for the orders.
 * 2. Creates the orders in bulk.
 * 3. Creates RecentOrders associated with the created orders.
 * 4. Flattens and creates SoldSellables associated with the orders.
 * 5. Creates SoldItems associated with the SoldSellables.
 *
 * Caches are used to avoid redundant database queries for EmployeeIds, SellableIds, and ItemIds.
 *
 * @throws Will throw an error if any of the entities are not unique.
 */
export async function bulkCreateOrders(
  values: OrderCreationAttributes[],
  { transaction, ...options }: BulkCreateOptions<InferAttributes<Order>>,
): Promise<Order[]> {
  let employeeIds: Map<string, Promise<number>> = new Map(); // cache
  let itemIds: Map<string, Promise<number>> = new Map(); // cache
  let sellableIds: Map<string, Promise<number>> = new Map(); // cache

  // find the EmployeeIds
  values = await Promise.all(
    values.map(async ({ Employee: eInfo, ...v }) => {
      if (v.EmployeeId) {
        if (eInfo) {
          console.warn(
            `bulkCreateOrders: EmployeeId specified, ignoring Employee (${eInfo})`,
          );
        }
      } else if (eInfo) {
        const key = JSON.stringify(eInfo);

        if (employeeIds.has(key)) {
          v.EmployeeId = await employeeIds.get(key);
        } else {
          const pEmployeeId = Employee.findAll({
            attributes: ["id"],
            where: eInfo,
            transaction,
          })
            .then(throwIfNotUnique("Employee", eInfo))
            .then(({ id }) => id);

          employeeIds.set(key, pEmployeeId);
          v.EmployeeId = await pEmployeeId;
        }
      }

      return v;
    }),
  );

  const orders = await Order.bulkCreate(values, { transaction, ...options });

  const pCreateRecentOrders = RecentOrder.bulkCreate(
    values
      .map(({ RecentOrder: roInfo }, i) =>
        roInfo
          ? {
              ...roInfo,
              OrderId: orders[i].id,
            }
          : undefined,
      )
      .filter((roInfo) => roInfo) as CreationAttributes<RecentOrder>[],
    { returning: false, transaction },
  );

  // flatten the SoldSellable infos
  const ssInfos = values
    .map(({ SoldSellables: ssInfos }, orderIdx) =>
      ssInfos.map((ssInfo) => ({ orderIdx, ...ssInfo })),
    )
    .flat();

  // create the SoldSellables
  const soldSellables = await SoldSellable.bulkCreate(
    await Promise.all(
      ssInfos.map(
        async ({
          orderIdx,
          Sellable: sInfo,
          SoldItems: _siInfos,
          ...ssInfo
        }) => {
          ssInfo.OrderId = orders[orderIdx].id;

          {
            if (ssInfo.SellableId) {
              if (sInfo) {
                console.warn(
                  `bulkCreateOrders: SellableId specified, ignoring Sellable (${sInfo})`,
                );
              }
            } else if (sInfo) {
              const key = JSON.stringify(sInfo);

              if (sellableIds.has(key)) {
                ssInfo.SellableId = await sellableIds.get(key);
              } else {
                const pSellableId = Sellable.findAll({
                  attributes: ["id"],
                  where: sInfo,
                  transaction,
                })
                  .then(throwIfNotUnique("Sellable", sInfo))
                  .then(({ id }) => id);

                sellableIds.set(key, pSellableId);
                ssInfo.SellableId = await pSellableId;
              }
            }
          }

          return ssInfo;
        },
      ),
    ),
    { returning: ["id"], transaction },
  );

  // create the SoldItems
  await SoldItem.bulkCreate(
    await Promise.all(
      ssInfos.map(({ SoldItems: siInfos }, ssIdx) =>
        Promise.all(
          siInfos.map(async ({ Item: iInfo, ...siInfo }) => {
            siInfo.SoldSellableId = soldSellables[ssIdx].id;

            if (siInfo.ItemId) {
              if (iInfo) {
                console.warn(
                  `bulkCreateOrders: ItemId specified, ignoring Item (${iInfo})`,
                );
              }
            } else if (siInfo) {
              const key = JSON.stringify(iInfo);

              if (itemIds.has(key)) {
                siInfo.ItemId = await itemIds.get(key);
              } else {
                const pItemId = Item.findAll({
                  attributes: ["id"],
                  where: iInfo,
                  transaction,
                })
                  .then(throwIfNotUnique("Item", iInfo))
                  .then(({ id }) => id as number);

                itemIds.set(key, pItemId);
                siInfo.ItemId = await pItemId;
              }
            }

            return siInfo as CreationAttributes<SoldItem>;
          }),
        ),
      ),
    ).then((ssInfos) => ssInfos.flat()),
    { returning: false, transaction },
  );

  await pCreateRecentOrders;

  return orders;
}
