import React, { ReactNode } from "react";

import { useAsyncMemo } from "@/components/react-hooks";
import { SellableCategory } from "@/db";
import { findAllSellableCategories, SellableCategoryJson } from "@/server/db";
import { ClientFindOptions } from "@/server/db/types";

export interface SellableCategoryFetchContextProps {
  contextValid: boolean;
  sellableCategories: SellableCategoryJson[];
  sellableCategoriesLoading: boolean;
  refreshSellableCategories: (
    options?: ClientFindOptions<SellableCategory>,
  ) => void;
}

export interface SellableCategoryFetchContextProviderProps {
  children: ReactNode;
  options?: ClientFindOptions<SellableCategory>;
}

const SellableCategoriesContext =
  React.createContext<SellableCategoryFetchContextProps>({
    contextValid: false,
    sellableCategories: [],
    sellableCategoriesLoading: true,
    refreshSellableCategories: (_?: ClientFindOptions<SellableCategory>) => {},
  });

/**
 * SellableCategoriesContextProvider is a React functional component that provides
 * a context for managing sellable categories.
 *
 * @param {SellableCategoryFetchContextProviderProps} props - The properties for the context provider.
 * @param {React.ReactNode} props.children - The child components that will be wrapped by this provider.
 * @param {ClientFindOptions<SellableCategory>} [props.options={}] - Optional initial options for fetching sellable categories.
 *
 * @returns {JSX.Element} The context provider component.
 *
 * @example
 * <SellableCategoriesContextProvider options={{ someOption: true }}>
 *   <YourComponent />
 * </SellableCategoriesContextProvider>
 *
 * @remarks
 * This component uses the `useAsyncMemo` hook to fetch sellable categories asynchronously
 * and provides the fetched data, loading state, and a method to refresh the categories
 * through the context.
 */
export const SellableCategoriesContextProvider: React.FC<
  SellableCategoryFetchContextProviderProps
> = ({ children, options = {} }) => {
  const [opt, setOpt] = React.useState(
    {} as ClientFindOptions<SellableCategory>,
  );

  const { value, loading } = useAsyncMemo(
    () =>
      findAllSellableCategories({
        ...options,
        ...opt,
      }),
    [],
    [opt],
  );

  return (
    <SellableCategoriesContext.Provider
      value={{
        contextValid: true,
        sellableCategories: value,
        sellableCategoriesLoading: loading,
        refreshSellableCategories: (o) => setOpt(o || {}),
      }}
    >
      {children}
    </SellableCategoriesContext.Provider>
  );
};

export const useSellableCategories = () => {
  const ctx = React.useContext(SellableCategoriesContext);

  if (!ctx.contextValid) {
    throw new Error(
      "useSellableCategories must be used within a SellableCategoriesContextProvider",
    );
  }

  return ctx;
};
