import React, { ReactNode } from "react";

import { useAsyncMemo } from "@/components/react-hooks";
import { Employee } from "@/db";
import { findAllEmployees, EmployeeJson } from "@/server/db";
import { ClientFindOptions } from "@/server/db/types";

export interface EmployeeFetchContextProps {
  contextValid: boolean;
  employees: EmployeeJson[];
  employeesLoading: boolean;
  refreshEmployees: (options?: ClientFindOptions<Employee>) => void;
}

export interface EmployeeFetchContextProviderProps {
  children: ReactNode;
  options?: ClientFindOptions<Employee>;
}

const EmployeesContext = React.createContext<EmployeeFetchContextProps>({
  contextValid: false,
  employees: [],
  employeesLoading: true,
  refreshEmployees: (_?: ClientFindOptions<Employee>) => {},
});

/**
 * EmployeesContextProvider is a React functional component that provides
 * an EmployeesContext to its children. It fetches employee data and manages
 * the loading state and refresh functionality.
 *
 * @param {EmployeeFetchContextProviderProps} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components that will have access to the EmployeesContext.
 * @param {ClientFindOptions<Employee>} [props.options={ include: [{ model: "JobPosition" }] }] - The options for fetching employees, with a default value that includes the JobPosition model.
 *
 * @returns {JSX.Element} The EmployeesContext.Provider component with the provided context values.
 */
export const EmployeesContextProvider: React.FC<
  EmployeeFetchContextProviderProps
> = ({ children, options = { include: [{ model: "JobPosition" }] } }) => {
  const [opt, setOpt] = React.useState({} as ClientFindOptions<Employee>);

  const { value, loading } = useAsyncMemo(
    () =>
      findAllEmployees({
        ...options,
        ...opt,
      }),
    [],
    [opt],
  );

  return (
    <EmployeesContext.Provider
      value={{
        contextValid: true,
        employees: value,
        employeesLoading: loading,
        refreshEmployees: (o) => setOpt(o || {}),
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => {
  const ctx = React.useContext(EmployeesContext);

  if (!ctx.contextValid) {
    throw new Error(
      "useEmployees must be used within a EmployeesContextProvider",
    );
  }

  return ctx;
};
