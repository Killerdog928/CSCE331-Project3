"use client";

import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import WeatherDisplay from "@/components/weatherDisplay.tsx";
import { findAllOrders } from "@/server/db";
import { updateRecentOrderByOrderId } from "@/server/db/RecentOrder/update";

// Define the structure for each order and its nested contents
type SellableItem = {
  itemName: string;
};

type Sellable = {
  sellableName: string;
  sellableItems: SellableItem[];
};

type Order = {
  id: number;
  orderStatus: number; // 0: Pending, 1: In Progress, 2: Completed, 3: Delivered, 4: Cancelled
  customerName: string;
  contents: Sellable[];
  timePlaced: string; // ISO string for time order was placed
  updatedAt: string; // ISO string for when the order status was last updated
};

// Helper function to sort orders
const sortOrders = (orders: Order[]) => {
  return orders.sort((a, b) => {
    if (a.orderStatus === b.orderStatus) {
      if (a.orderStatus === 1) {
        return (
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      }

      return (
        new Date(a.timePlaced).getTime() - new Date(b.timePlaced).getTime()
      );
    }

    return a.orderStatus - b.orderStatus;
  });
};

/**
 * KitchenPage component is responsible for displaying the current orders in the kitchen.
 * It fetches orders from the server, transforms and filters them, and displays them in two categories:
 * "In Progress" and "Pending". It also allows advancing the status of an order.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <KitchenPage />
 *
 * @remarks
 * - Orders are fetched every 5 seconds.
 * - Orders are sorted by their status and update time.
 * - The component displays the last update time.
 * - The component includes a weather display at the top-left corner.
 *
 * @function
 * @name KitchenPage
 *
 * @typedef {Object} Order
 * @property {number} id - The unique identifier of the order.
 * @property {number} orderStatus - The current status of the order.
 * @property {string} updatedAt - The last update time of the order.
 * @property {string} customerName - The name of the customer who placed the order.
 * @property {string} timePlaced - The time when the order was placed.
 * @property {Array<Sellable>} contents - The contents of the order.
 *
 * @typedef {Object} Sellable
 * @property {string} sellableName - The name of the sellable item.
 * @property {Array<Item>} sellableItems - The items included in the sellable.
 *
 * @typedef {Object} Item
 * @property {string} itemName - The name of the item.
 *
 * @hook
 * @name useState
 * @description Manages the state of current orders and the last update time.
 *
 * @hook
 * @name useEffect
 * @description Fetches orders from the server and sets up an interval to fetch orders every 5 seconds.
 *
 * @async
 * @function fetchOrders
 * @description Fetches orders from the server, transforms and filters them, and updates the state.
 *
 * @async
 * @function incrementOrderStatus
 * @description Advances the status of an order and updates the state.
 *
 * @param {number} orderId - The unique identifier of the order to be updated.
 *
 * @returns {void}
 */
const KitchenPage: React.FC = () => {
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const os = await findAllOrders({
          include: [
            {
              model: "RecentOrder",
            },
            {
              model: "SoldSellable",
              include: [
                {
                  model: "Sellable",
                },
                {
                  model: "SoldItem",
                  include: [
                    {
                      model: "Item",
                    },
                  ],
                },
              ],
            },
          ],
          order: [["orderDate", "DESC"]], // Sort orders by date
        });

        const transformedOrders = os.map((order: any) => ({
          id: order.id,
          orderStatus: order.RecentOrder?.orderStatus ?? 3,
          updatedAt: order.RecentOrder?.updatedAt ?? -1,
          customerName: order.customerName,
          timePlaced: order.orderDate,
          contents: order.SoldSellables.map((sellable: any) => ({
            sellableName: sellable.Sellable?.name ?? "Unknown Sellable",
            sellableItems: sellable.SoldItems.sort(
              (a: any, b: any) => a.ItemId - b.ItemId,
            ).map((item: any) => ({
              itemName: item.Item?.name ?? "Unknown Item",
            })),
          })),
        }));

        const filteredOrders = transformedOrders.filter(
          (order) =>
            order.orderStatus !== 2 &&
            order.orderStatus !== 3 &&
            order.orderStatus !== 4,
        );

        setCurrentOrders(sortOrders(filteredOrders));
        setLastUpdateTime(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  const incrementOrderStatus = async (orderId: number) => {
    try {
      const currentOrder = currentOrders.find((order) => order.id === orderId);

      if (!currentOrder) {
        console.error(`Order with ID ${orderId} not found.`);

        return;
      }

      const newStatus = currentOrder.orderStatus + 1;

      if (newStatus > 2) {
        console.warn(`Order #${orderId} is already in its final status.`);

        return;
      }

      console.log(`Updating Order #${orderId} to status ${newStatus}...`);

      console.log("right here");

      await updateRecentOrderByOrderId(orderId, newStatus);

      console.log("ran it");

      setCurrentOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order,
        );

        const inProgressOrders = updatedOrders.filter(
          (order) => order.orderStatus === 1,
        );
        const nonInProgressOrders = updatedOrders.filter(
          (order) => order.orderStatus !== 1,
        );

        inProgressOrders.sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        );

        const updatedOrder = updatedOrders.find(
          (order) => order.id === orderId,
        );

        if (!updatedOrder) {
          console.error(`Updated order with ID ${orderId} not found.`);

          return prevOrders;
        }

        const newInProgressOrders = [
          ...inProgressOrders.filter((order) => order.id !== orderId),
          updatedOrder,
        ];

        return [...nonInProgressOrders, ...newInProgressOrders];
      });
    } catch (error) {
      console.error(
        `Failed to update order status for order #${orderId}:`,
        error,
      );
    }
  };

  const inProgressOrders = currentOrders.filter(
    (order) => order.orderStatus === 1,
  );

  const pendingOrders = currentOrders.filter(
    (order) => order.orderStatus === 0,
  );

  return (
    <div className="pt-10 px-5">
      <div className="text-center mb-6">
        <div className="inline-block px-4 py-2 border rounded bg-gray-100">
          <p className="text-sm text-gray-600">Last Update: {lastUpdateTime}</p>
        </div>
      </div>
      {/* In Progress Orders */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-2">
          In Progress
        </h2>
        <div className="flex overflow-x-auto space-x-4 w-full">
          {inProgressOrders.length > 0 ? (
            inProgressOrders.map((order) => (
              <div
                key={order.id}
                className="flex-none w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    Name: {order.customerName}
                  </p>
                  <ul className="list-disc ml-4 text-sm text-gray-700">
                    {order.contents.map((sellable, sellableIndex) => (
                      <li key={sellableIndex}>
                        <strong>{sellable.sellableName}</strong>
                        <ul className="list-disc ml-4">
                          {sellable.sellableItems.map((item, itemIndex) => (
                            <li key={itemIndex}>{item.itemName}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-600">
                    Time Placed:{" "}
                    {new Date(order.timePlaced).toLocaleTimeString()}
                  </p>
                </div>
                <Button
                  className="mt-4 w-full bg-gray-100 border border-blue-500 text-blue-500 hover:bg-gray-200"
                  size="lg"
                  onPress={() => incrementOrderStatus(order.id)}
                >
                  Advance Status
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No orders in progress.</p>
          )}
        </div>
      </div>
      {/* Barrier */}
      <hr className="my-4 border-gray-300" />
      {/* Pending Orders */}
      <div>
        <h2 className="text-lg font-semibold text-yellow-600 mb-2">Pending</h2>
        <div className="flex overflow-x-auto space-x-4 w-full">
          {pendingOrders.length > 0 ? (
            pendingOrders.map((order) => (
              <div
                key={order.id}
                className="flex-none w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    Name: {order.customerName}
                  </p>
                  <ul className="list-disc ml-4 text-sm text-gray-700">
                    {order.contents.map((sellable, sellableIndex) => (
                      <li key={sellableIndex}>
                        <strong>{sellable.sellableName}</strong>
                        <ul className="list-disc ml-4">
                          {sellable.sellableItems.map((item, itemIndex) => (
                            <li key={itemIndex}>{item.itemName}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-600">
                    Time Placed:{" "}
                    {new Date(order.timePlaced).toLocaleTimeString()}
                  </p>
                </div>
                <Button
                  className="mt-4 w-full bg-gray-100 border border-yellow-600 text-yellow-600 hover:bg-gray-200"
                  size="lg"
                  onPress={() => incrementOrderStatus(order.id)}
                >
                  Start Order
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No pending orders.</p>
          )}
        </div>
      </div>
      {/* Weather Display at the Top-Left Corner */}
      <div className="absolute top-12 left-4">
        <WeatherDisplay />
      </div>
    </div>
  );
};

export default KitchenPage;
