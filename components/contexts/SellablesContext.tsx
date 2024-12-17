import React, { ReactNode } from "react";

import { useAsyncMemo } from "@/components/react-hooks";
import { Sellable } from "@/db";
import { findAllSellables, SellableJson } from "@/server/db";
import { ClientFindOptions } from "@/server/db/types";

export interface SellableFetchContextProps {
  contextValid: boolean;
  sellables: SellableJson[];
  sellablesLoading: boolean;
  refreshSellables: (options?: ClientFindOptions<Sellable>) => void;
}

export interface SellableFetchContextProviderProps {
  children: ReactNode;
  options?: ClientFindOptions<Sellable>;
}

const SellablesContext = React.createContext<SellableFetchContextProps>({
  contextValid: false,
  sellables: [],
  sellablesLoading: true,
  refreshSellables: (_?: ClientFindOptions<Sellable>) => {},
});

/**
 * SellablesContextProvider component provides a context for managing sellable items.
 * It uses the `useAsyncMemo` hook to fetch sellable items based on the provided options
 * and the internal state `opt`.
 *
 * @param {SellableFetchContextProviderProps} props - The properties for the context provider.
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @param {ClientFindOptions<Sellable>} [props.options={}] - Optional initial options for fetching sellables.
 *
 * @returns {JSX.Element} The context provider component.
 *
 * @component
 * @example
 * ```tsx
 * <SellablesContextProvider options={{ limit: 10 }}>
 *   <YourComponent />
 * </SellablesContextProvider>
 * ```
 */
export const SellablesContextProvider: React.FC<
  SellableFetchContextProviderProps
> = ({ children, options = {} }) => {
  const [opt, setOpt] = React.useState({} as ClientFindOptions<Sellable>);

  const { value, loading } = useAsyncMemo(
    () =>
      findAllSellables({
        ...options,
        ...opt,
      }),
    [],
    [opt],
  );

  return (
    <SellablesContext.Provider
      value={{
        contextValid: true,
        sellables: value,
        sellablesLoading: loading,
        refreshSellables: (o) => setOpt(o || {}),
      }}
    >
      {children}
    </SellablesContext.Provider>
  );
};

export const useSellables = () => {
  const ctx = React.useContext(SellablesContext);

  if (!ctx.contextValid) {
    throw new Error(
      "useSellables must be used within a SellablesContextProvider",
    );
  }

  return ctx;
};
