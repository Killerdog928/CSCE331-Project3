import React, { ReactNode } from "react";

import { useAsyncMemo } from "@/components/react-hooks";
import { ItemFeature } from "@/db";
import { findAllItemFeatures, ItemFeatureJson } from "@/server/db";
import { ClientFindOptions } from "@/server/db/types";

export interface ItemFeatureFetchContextProps {
  contextValid: boolean;
  itemFeatures: ItemFeatureJson[];
  itemFeaturesLoading: boolean;
  refreshItemFeatures: (options?: ClientFindOptions<ItemFeature>) => void;
}

export interface ItemFeatureFetchContextProviderProps {
  children: ReactNode;
  options?: ClientFindOptions<ItemFeature>;
}

const ItemFeaturesContext = React.createContext<ItemFeatureFetchContextProps>({
  contextValid: false,
  itemFeatures: [],
  itemFeaturesLoading: true,
  refreshItemFeatures: (_?: ClientFindOptions<ItemFeature>) => {},
});

/**
 * Provides the context for item features with the ability to fetch and refresh item features.
 *
 * @param {ItemFeatureFetchContextProviderProps} props - The properties for the context provider.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @param {ClientFindOptions<ItemFeature>} [props.options] - The options for fetching item features, with default ordering by importance and name in ascending order.
 *
 * @returns {JSX.Element} The context provider component.
 */
export const ItemFeaturesContextProvider: React.FC<
  ItemFeatureFetchContextProviderProps
> = ({
  children,
  options = {
    order: [
      ["importance", "ASC"],
      ["name", "ASC"],
    ],
  },
}) => {
  const [opt, setOpt] = React.useState({} as ClientFindOptions<ItemFeature>);

  const { value, loading } = useAsyncMemo(
    () =>
      findAllItemFeatures({
        ...options,
        ...opt,
      }),
    [],
    [opt],
  );

  return (
    <ItemFeaturesContext.Provider
      value={{
        contextValid: true,
        itemFeatures: value,
        itemFeaturesLoading: loading,
        refreshItemFeatures: (o) => setOpt(o || {}),
      }}
    >
      {children}
    </ItemFeaturesContext.Provider>
  );
};

export const useItemFeatures = () => {
  const ctx = React.useContext(ItemFeaturesContext);

  if (!ctx.contextValid) {
    throw new Error(
      "useItemFeatures must be used within an ItemFeaturesContextProvider",
    );
  }

  return ctx;
};
