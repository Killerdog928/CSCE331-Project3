import React, { ReactNode } from "react";

import { useAsyncMemo } from "@/components/react-hooks";
import { JobPosition } from "@/db";
import { findAllJobPositions, JobPositionJson } from "@/server/db";
import { ClientFindOptions } from "@/server/db/types";

export interface JobPositionFetchContextProps {
  contextValid: boolean;
  jobPositions: JobPositionJson[];
  jobPositionsLoading: boolean;
  refreshJobPositions: (options?: ClientFindOptions<JobPosition>) => void;
}

export interface JobPositionFetchContextProviderProps {
  children: ReactNode;
  options?: ClientFindOptions<JobPosition>;
}

const JobPositionsContext = React.createContext<JobPositionFetchContextProps>({
  contextValid: false,
  jobPositions: [],
  jobPositionsLoading: true,
  refreshJobPositions: (_?: ClientFindOptions<JobPosition>) => {},
});

/**
 * JobPositionsContextProvider component provides a context for job positions.
 * It fetches job positions based on the provided options and makes them available
 * to the children components through the context.
 *
 * @param {JobPositionFetchContextProviderProps} props - The props for the provider.
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @param {ClientFindOptions<JobPosition>} [props.options] - Optional initial options for fetching job positions.
 *
 * @returns {JSX.Element} The provider component that wraps the children with the job positions context.
 */
export const JobPositionsContextProvider: React.FC<
  JobPositionFetchContextProviderProps
> = ({ children, options = {} }) => {
  const [opt, setOpt] = React.useState({} as ClientFindOptions<JobPosition>);

  const { value, loading } = useAsyncMemo(
    () =>
      findAllJobPositions({
        ...options,
        ...opt,
      }),
    [],
    [opt],
  );

  return (
    <JobPositionsContext.Provider
      value={{
        contextValid: true,
        jobPositions: value,
        jobPositionsLoading: loading,
        refreshJobPositions: (o) => setOpt(o || {}),
      }}
    >
      {children}
    </JobPositionsContext.Provider>
  );
};

export const useJobPositions = () => {
  const ctx = React.useContext(JobPositionsContext);

  if (!ctx.contextValid) {
    throw new Error(
      "useJobPositions must be used within a JobPositionsContextProvider",
    );
  }

  return ctx;
};
