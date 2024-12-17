import React, { ReactNode } from "react";

import { useAsyncMemo } from "@/components/react-hooks";
import { InventoryItem } from "@/db";
import { findAllInventoryItems, InventoryItemJson } from "@/server/db";
import { ClientFindOptions } from "@/server/db/types";

export interface InventoryItemFetchContextProps {
  contextValid: boolean;
  inventoryItems: InventoryItemJson[];
  inventoryItemsLoading: boolean;
  refreshInventoryItems: (options?: ClientFindOptions<InventoryItem>) => void;
}

export interface InventoryItemFetchContextProviderProps {
  children: ReactNode;
  options?: ClientFindOptions<InventoryItem>;
}

const InventoryItemsContext =
  React.createContext<InventoryItemFetchContextProps>({
    contextValid: false,
    inventoryItems: [],
    inventoryItemsLoading: true,
    refreshInventoryItems: (_?: ClientFindOptions<InventoryItem>) => {},
  });

/**
 * InventoryItemsContextProvider is a React functional component that provides
 * context for inventory items. It uses the useAsyncMemo hook to fetch inventory
 * items based on the provided options and internal state.
 *
 * @param {InventoryItemFetchContextProviderProps} props - The props for the provider.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @param {ClientFindOptions<InventoryItem>} [props.options={ include: [{ model: "Item" }] }] - The options for fetching inventory items.
 *
 * @returns {JSX.Element} The InventoryItemsContext.Provider component with the context value.
 *
 * @context {boolean} contextValid - Indicates if the context is valid.
 * @context {InventoryItem[]} inventoryItems - The fetched inventory items.
 * @context {boolean} inventoryItemsLoading - Indicates if the inventory items are currently being loaded.
 * @context {Function} refreshInventoryItems - Function to refresh the inventory items with new options.
 */
export const InventoryItemsContextProvider: React.FC<
  InventoryItemFetchContextProviderProps
> = ({ children, options = { include: [{ model: "Item" }] } }) => {
  const [opt, setOpt] = React.useState({} as ClientFindOptions<InventoryItem>);

  const { value, loading } = useAsyncMemo(
    () =>
      findAllInventoryItems({
        ...options,
        ...opt,
      }),
    [],
    [opt],
  );

  return (
    <InventoryItemsContext.Provider
      value={{
        contextValid: true,
        inventoryItems: value,
        inventoryItemsLoading: loading,
        refreshInventoryItems: (o) => setOpt(o || {}),
      }}
    >
      {children}
    </InventoryItemsContext.Provider>
  );
};

export const useInventoryItems = () => {
  const ctx = React.useContext(InventoryItemsContext);

  if (!ctx.contextValid) {
    throw new Error(
      "useInventoryItems must be used within a InventoryItemsContextProvider",
    );
  }

  return ctx;
};
