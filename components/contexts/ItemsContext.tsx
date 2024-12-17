import React, { ReactNode } from "react";

import { useAsyncMemo } from "@/components/react-hooks";
import { Item } from "@/db";
import { findAllItems, ItemJson } from "@/server/db";
import { ClientFindOptions } from "@/server/db/types";

export interface ItemFetchContextProps {
  contextValid: boolean;
  items: ItemJson[];
  itemsLoading: boolean;
  refreshItems: (options?: ClientFindOptions<Item>) => void;
}

export interface ItemFetchContextProviderProps {
  children: ReactNode;
  options?: ClientFindOptions<Item>;
}

const ItemsContext = React.createContext<ItemFetchContextProps>({
  contextValid: false,
  items: [],
  itemsLoading: true,
  refreshItems: (_?: ClientFindOptions<Item>) => {},
});

/**
 * ItemsContextProvider component provides the context for items.
 * It fetches items based on the provided options and makes them available
 * to the children components through the ItemsContext.
 *
 * @param {ItemFetchContextProviderProps} props - The props for the ItemsContextProvider component.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @param {ClientFindOptions<Item>} [props.options] - The options for fetching items, defaulting to include ItemFeature model.
 *
 * @returns {JSX.Element} The ItemsContext.Provider component with the fetched items and loading state.
 */
export const ItemsContextProvider: React.FC<ItemFetchContextProviderProps> = ({
  children,
  options = {
    include: [{ model: "ItemFeature" }],
  },
}) => {
  const [opt, setOpt] = React.useState({} as ClientFindOptions<Item>);

  const { value, loading } = useAsyncMemo(
    () =>
      findAllItems({
        ...options,
        ...opt,
      }),
    [],
    [opt],
  );

  return (
    <ItemsContext.Provider
      value={{
        contextValid: true,
        items: value,
        itemsLoading: loading,
        refreshItems: (o) => setOpt(o || {}),
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const ctx = React.useContext(ItemsContext);

  if (!ctx.contextValid) {
    throw new Error("useItems must be used within a ItemsContextProvider");
  }

  return ctx;
};
