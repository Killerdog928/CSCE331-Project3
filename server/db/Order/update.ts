"use server";

import { UpdateOptions, InferAttributes, Transaction } from "sequelize";

import { db, Order, SoldSellable } from "@/db";
import {
  OrderUpdateAttributes,
  OrderJson,
  findUniqueEmployee,
  parseOrder,
  updateRecentOrder,
} from "@/server/db";

/**
 * Updates an order in the database.
 * @param {OrderUpdateAttributes} orderAttributes - The attributes to update the order with.
 * @param {Omit<UpdateOptions<InferAttributes<Order>>, "where">} [options] - Additional options for the update operation.
 * @returns {Promise<OrderJson>} The updated order as a JSON object.
 */
export async function updateOrder(
  {
    id,
    Employee: eInfo,
    RecentOrder: roInfo,
    SoldSellables: ssInfos,
    ...oInfo
  }: OrderUpdateAttributes,
  options?: Omit<UpdateOptions<InferAttributes<Order>>, "where">,
): Promise<OrderJson> {
  const updateInTransaction = async (transaction: Transaction) => {
    // Find the unique employee ID if employee info is provided
    const pEmployeeId = eInfo
      ? findUniqueEmployee({
          attributes: ["id"],
          where: eInfo,
          transaction,
        }).then((e) => e.id)
      : Promise.resolve(undefined);

    // Update the order with the provided attributes
    const pUpdateOrder = pEmployeeId.then((eId) =>
      Order.update(
        {
          ...oInfo,
          EmployeeId: eId,
        },
        {
          ...options,
          where: { id },
          returning: true,
          transaction,
        },
      ).then(([_, os]) => os[0]),
    );

    // Update the recent order if recent order info is provided
    const pUpdateRecentOrder = roInfo
      ? updateRecentOrder(roInfo, { transaction })
      : Promise.resolve(undefined);

    // Update the sold sellables if sold sellables info is provided
    const pUpdateSoldSellables = ssInfos
      ? pUpdateOrder.then(async (o) => {
          const pSoldSellables = SoldSellable.bulkCreate(
            ssInfos.map((ss) => ({
              ...ss,
              OrderId: o.id,
            })),
            { transaction },
          );

          o.setSoldSellables(
            (await pSoldSellables).map((ss) => ss.id as number),
            { transaction },
          );

          return await pSoldSellables;
        })
      : Promise.resolve(undefined);

    // Wait for all updates to complete
    const [o, ro, sss] = await Promise.all([
      pUpdateOrder,
      pUpdateRecentOrder,
      pUpdateSoldSellables,
    ]);

    // Return the updated order as a JSON object
    return {
      ...o.toJSON(),
      RecentOrder: ro,
      SoldSellables: sss?.map((ss) => ss.toJSON()),
    } as OrderJson;
  };

  // Execute the update in a transaction
  return (
    options && options.transaction
      ? updateInTransaction(options.transaction)
      : db.transaction(updateInTransaction)
  ).then(parseOrder);
}
