import React, { ReactNode } from "react";

import { useAsyncMemo } from "@/components/react-hooks";
import { Order } from "@/db";
import { countOrders, findAllOrders, OrderJson } from "@/server/db";
import { ClientFindOptions } from "@/server/db/types";

export interface OrderFetchContextProps {
  contextValid: boolean;
  numOrders: number;
  orders: OrderJson[];
  ordersLoading: boolean;
  refreshOrders: (options?: ClientFindOptions<Order>) => void;
}

export interface OrderFetchContextProviderProps {
  children: ReactNode;
  options?: ClientFindOptions<Order>;
}

const OrdersContext = React.createContext<OrderFetchContextProps>({
  contextValid: false,
  numOrders: 0,
  orders: [],
  ordersLoading: true,
  refreshOrders: (_?: ClientFindOptions<Order>) => {},
});

/**
 * OrdersContextProvider is a React functional component that provides context for managing orders.
 * It uses the useAsyncMemo hook to fetch and count orders based on the provided options and state.
 *
 * @param {OrderFetchContextProviderProps} props - The properties for the OrdersContextProvider component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider.
 * @param {ClientFindOptions<Order>} [props.options={ limit: 100 }] - The options for fetching orders, with a default limit of 100.
 *
 * @returns {JSX.Element} The OrdersContext.Provider component with the fetched orders and related context values.
 *
 * @typedef {Object} OrderFetchContextProviderProps
 * @property {React.ReactNode} children - The child components to be rendered within the provider.
 * @property {ClientFindOptions<Order>} [options] - The options for fetching orders.
 *
 * @typedef {Object} ClientFindOptions
 * @property {number} [limit] - The limit for the number of orders to fetch.
 *
 * @typedef {Object} Order - The order object type.
 */
export const OrdersContextProvider: React.FC<
  OrderFetchContextProviderProps
> = ({ children, options = { limit: 100 } }) => {
  const [opt, setOpt] = React.useState({} as ClientFindOptions<Order>);

  const { value, loading } = useAsyncMemo(
    () =>
      Promise.all([
        findAllOrders({
          ...options,
          ...opt,
        }),
        countOrders({
          ...options,
          ...opt,
          limit: undefined,
        }),
      ]),
    [[], 0],
    [opt],
  );

  return (
    <OrdersContext.Provider
      value={{
        contextValid: true,
        numOrders: value[1],
        orders: value[0],
        ordersLoading: loading,
        refreshOrders: (o) => setOpt(o || {}),
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = React.useContext(OrdersContext);

  if (!ctx.contextValid) {
    throw new Error("useOrders must be used within an OrdersContextProvider");
  }

  return ctx;
};
