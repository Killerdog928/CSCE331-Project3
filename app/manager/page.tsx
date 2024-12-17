"use client";

import { Tabs, Tab, Button, Spacer } from "@nextui-org/react";
import { useState } from "react";

import { XReport, ZReport, SalesReport } from "./components";
import { EmployeeEditor } from "./components/EmployeeEditor";
import { InventoryItemEditor } from "./components/InventoryItemEditor";
import { ItemEditor } from "./components/ItemEditor";
import { ItemFeatureEditor } from "./components/ItemFeatureEditor";
import { OrderHistoryTable } from "./components/OrderHistoryTable";
import { SellableCategoryEditor } from "./components/SellableCategoryEditor";
import { SellableEditor } from "./components/SellableEditor";

import { EmployeesContextProvider } from "@/components/contexts/EmployeesContext";
import { InventoryItemsContextProvider } from "@/components/contexts/InventoryItemsContext";
import { ItemFeaturesContextProvider } from "@/components/contexts/ItemFeaturesContext";
import { ItemsContextProvider } from "@/components/contexts/ItemsContext";
import { JobPositionsContextProvider } from "@/components/contexts/JobPositionsContext";
import { OrdersContextProvider } from "@/components/contexts/OrdersContext";
import { SellableCategoriesContextProvider } from "@/components/contexts/SellableCategoriesContext";
import { SellablesContextProvider } from "@/components/contexts/SellablesContext";
import WeatherDisplay from "@/components/weatherDisplay.tsx";
import { populateDatabase } from "@/server/populateDatabase";

/**
 * The `ManagerView` component provides a comprehensive interface for managing various aspects of a POS system.
 * It includes tabs for managing orders, generating reports, managing inventory, menu items, employees, and a danger zone for database operations.
 *
 * @component
 * @example
 * return (
 *   <ManagerView />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * This component uses multiple context providers to manage state and data for different sections:
 * - EmployeesContextProvider
 * - InventoryItemsContextProvider
 * - ItemFeaturesContextProvider
 * - ItemsContextProvider
 * - JobPositionsContextProvider
 * - OrdersContextProvider
 * - SellableCategoriesContextProvider
 * - SellablesContextProvider
 *
 * The component includes the following tabs:
 * - Orders: Displays order management interface.
 * - Reports: Allows generation of X and Z reports.
 * - Inventory: Provides inventory management interface.
 * - Menu: Contains sub-tabs for managing sellables, sellable categories, items, and item features.
 * - Employees: Provides employee management interface.
 * - Danger Zone: Contains a button to nuke the database, with a loading state.
 *
 * Additionally, a weather display is positioned at the top-left corner of the view.
 *
 * @hook
 * - `useState`: Manages the state for `databaseBusy` and `zReportGenerated`.
 */
const ManagerView = () => {
  const [databaseBusy, setDatabaseBusy] = useState(false);

  const [zReportGenerated, setZReportGenerated] = useState(false);

  return (
    <EmployeesContextProvider>
      <InventoryItemsContextProvider>
        <ItemFeaturesContextProvider>
          <ItemsContextProvider>
            <JobPositionsContextProvider>
              <OrdersContextProvider>
                <SellableCategoriesContextProvider>
                  <SellablesContextProvider>
                    <div className="text-center pt-10 px-5">
                      {/* Header */}
                      <h1 className="text-4xl text-[#D62300] font-bold">
                        Manager View
                      </h1>
                      <p className="text-lg text-gray-600">
                        Manage your POS system
                      </p>
                      <Spacer y={2} />

                      {/* Tabs */}
                      <Tabs
                        aria-label="Manager Tabs"
                        className="mt-4"
                        color="primary"
                        defaultSelectedKey="1"
                        variant="underlined"
                      >
                        <Tab key="orders" title="Orders">
                          <h2 className="text-2xl font-semibold mb-4">
                            Order Management
                          </h2>
                          <OrderHistoryTable />
                        </Tab>

                        <Tab key="reports" title="Reports">
                          <h2 className="text-2xl font-semibold mb-4">
                            Reports
                          </h2>
                          <div className="flex flex-wrap gap-4 items-start justify-center">
                            <XReport deps={[zReportGenerated]} />
                            <ZReport
                              onGenerate={() => setZReportGenerated((z) => !z)}
                            />
                            <SalesReport />
                          </div>
                        </Tab>

                        <Tab key="inventory" title="Inventory">
                          <h2 className="text-2xl font-semibold mb-4">
                            Inventory Management
                          </h2>
                          <InventoryItemEditor />
                        </Tab>

                        <Tab key="menu-management" title="Menu">
                          <h2 className="text-2xl font-semibold mb-4">
                            Menu Management
                          </h2>
                          <Tabs
                            aria-label="Menu Management Tabs"
                            className="mt-4"
                            color="primary"
                            defaultSelectedKey="1"
                            variant="underlined"
                          >
                            <Tab key="sellables" title="Sellables">
                              <h2 className="text-2xl font-semibold mb-4">
                                Sellable Management
                              </h2>
                              <SellableEditor />
                            </Tab>
                            <Tab
                              key="sellable-categories"
                              title="Sellable Categories"
                            >
                              <h2 className="text-2xl font-semibold mb-4">
                                Sellable Category Management
                              </h2>
                              <SellableCategoryEditor />
                            </Tab>

                            <Tab key="items" title="Items">
                              <h2 className="text-2xl font-semibold mb-4">
                                Item Management
                              </h2>
                              <ItemEditor />
                            </Tab>

                            <Tab key="item-features" title="Item Features">
                              <h2 className="text-2xl font-semibold mb-4">
                                Item Feature Management
                              </h2>
                              <ItemFeatureEditor />
                            </Tab>
                          </Tabs>
                        </Tab>

                        <Tab key="employees" title="Employees">
                          <h2 className="text-2xl font-semibold mb-4">
                            Employee Management
                          </h2>
                          <EmployeeEditor />
                        </Tab>

                        <Tab key="danger-zone" title="Danger Zone">
                          <h2 className="text-2xl font-semibold mb-4">
                            Danger Zone
                          </h2>
                          <Button
                            color="danger"
                            isLoading={databaseBusy}
                            onClick={async () => {
                              setDatabaseBusy(true);
                              try {
                                await populateDatabase();
                              } finally {
                                setDatabaseBusy(false);
                              }
                            }}
                          >
                            Nuke Database
                          </Button>
                        </Tab>
                      </Tabs>

                      {/* Weather Display at the Top-Left Corner */}
                      <div className="absolute top-12 left-4">
                        <WeatherDisplay />
                      </div>
                    </div>
                  </SellablesContextProvider>
                </SellableCategoriesContextProvider>
              </OrdersContextProvider>
            </JobPositionsContextProvider>
          </ItemsContextProvider>
        </ItemFeaturesContextProvider>
      </InventoryItemsContextProvider>
    </EmployeesContextProvider>
  );
};

export default ManagerView;
