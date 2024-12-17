import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import { Formik, ErrorMessage } from "formik";
import React, { useEffect } from "react";
import { Form } from "react-router-dom";
import { Order as SqlOrder } from "sequelize";
import * as Yup from "yup";

import { useEmployees } from "@/components/contexts/EmployeesContext";
import { useOrders } from "@/components/contexts/OrdersContext";
import { ColumnInfo, EditorTable } from "@/components/EditorTable";
import { MyField } from "@/components/MyField";

/**
 * OrderHistoryTable component displays a table of order history with various functionalities
 * such as sorting, filtering, and editing orders.
 *
 * @component
 * @example
 * return (
 *   <OrderHistoryTable />
 * )
 *
 * @returns {JSX.Element} The rendered OrderHistoryTable component.
 *
 * @remarks
 * This component uses several hooks to manage state and data fetching:
 * - `useOrders` to fetch and manage orders data.
 * - `useEmployees` to fetch and manage employees data.
 * - `useDisclosure` to manage the state of the modal editor.
 *
 * The table columns include:
 * - Order ID
 * - Employee Name
 * - Customer Name
 * - Order Date
 * - Order Total
 * - Status
 *
 * The component also includes a modal for creating and editing orders, which uses Formik for form handling.
 *
 * @hook {useOrders} - Fetches and manages orders data.
 * @hook {useEmployees} - Fetches and manages employees data.
 * @hook {useDisclosure} - Manages the state of the modal editor.
 *
 * @state {number} queryIdx - The current index for querying orders.
 * @state {boolean} editorOpen - The state of the modal editor.
 * @state {OrderJson | undefined} order - The current order being edited or created.
 * @state {SqlOrder} orderBy - The current order by which the table is sorted.
 * @state {string} search - The current search query.
 * @state {string[]} includedOrderStatuses - The list of included order statuses for filtering.
 * @state {string[]} excludedOrderStatuses - The list of excluded order statuses for filtering.
 *
 * @param {OrderJson} defaultOrder - The default order object used for initializing new orders.
 * @param {ColumnInfo<OrderJson>[]} columns - The columns configuration for the table.
 *
 * @function refreshOrders - Function to refresh the orders data.
 * @function setQueryIdx - Function to set the query index.
 * @function openEditor - Function to open the modal editor.
 * @function closeEditor - Function to close the modal editor.
 * @function setOrder - Function to set the current order being edited or created.
 * @function setOrderBy - Function to set the order by which the table is sorted.
 * @function setSearch - Function to set the search query.
 * @function setIncludedOrderStatuses - Function to set the included order statuses for filtering.
 * @function setExcludedOrderStatuses - Function to set the excluded order statuses for filtering.
 * @function destroyOrder - Function to delete an order.
 * @function updateOrder - Function to update an order.
 * @function createOrder - Function to create a new order.
 */
import {
  destroyOrder,
  OrderJson,
  createOrder,
  updateOrder,
  OrderCreationAttributes,
  OrderUpdateAttributes,
} from "@/server/db";
export const OrderHistoryTable: React.FC = () => {
  const { numOrders, orders, ordersLoading, refreshOrders } = useOrders();
  const { employees, employeesLoading } = useEmployees();

  const [queryIdx, setQueryIdx] = React.useState(0);

  const {
    isOpen: editorOpen,
    onOpen: openEditor,
    onClose: closeEditor,
  } = useDisclosure();
  const [order, setOrder] = React.useState<OrderJson | undefined>(undefined);

  const [orderBy, setOrderBy] = React.useState<SqlOrder>([["id", "ASC"]]);
  const [search, setSearch] = React.useState("");

  const [includedOrderStatuses, setIncludedOrderStatuses] = React.useState<
    string[]
  >([]);
  const [excludedOrderStatuses, setExcludedOrderStatuses] = React.useState<
    string[]
  >([]);
  const defaultOrder = {} as OrderJson;

  const columns: ColumnInfo<OrderJson>[] = (
    [
      {
        header: "Order ID",
        content: "id",
      },
      {
        header: "Employee Name",
        render: (order: OrderJson) => order.Employee?.name || "",
        sort: (o) => setOrderBy([["Employee", "name", o]]),
      },
      {
        header: "Customer Name",
        content: "customerName",
      },
      {
        header: "Order Date",
        render: (order: OrderJson) =>
          new Date(order.orderDate).toLocaleString(),
        sort: (o) => setOrderBy([["orderDate", o]]),
      },
      {
        header: "Order Total",
        render: (order: OrderJson) => `$${order.totalPrice.toFixed(2)}`,
        sort: (o) => setOrderBy([["totalPrice", o]]),
      },
      {
        header: "Status",
        render: (order: OrderJson) =>
          !order.RecentOrder || order.RecentOrder!.orderStatus === 2 ? (
            <Chip color="success" size="sm">
              Completed
            </Chip>
          ) : order.RecentOrder!.orderStatus === 1 ? (
            <Chip color="warning" size="sm">
              In Progress
            </Chip>
          ) : order.RecentOrder!.orderStatus === 0 ? (
            <Chip color="danger" size="sm">
              Pending
            </Chip>
          ) : (
            <Chip size="sm" variant="flat">
              Cancelled
            </Chip>
          ),
        filter: (v?: string) => {
          if (!v) {
            setIncludedOrderStatuses([]);
            setExcludedOrderStatuses([]);
          } else if (includedOrderStatuses.includes(`${v}`)) {
            setIncludedOrderStatuses(
              includedOrderStatuses.filter((i) => i !== `${v}`),
            );
            setExcludedOrderStatuses([...excludedOrderStatuses, `${v}`]);
          } else if (excludedOrderStatuses.includes(`${v}`)) {
            setExcludedOrderStatuses(
              excludedOrderStatuses.filter((i) => i !== `${v}`),
            );
          } else {
            setExcludedOrderStatuses(
              excludedOrderStatuses.filter((i) => i !== `${v}`),
            );
            setIncludedOrderStatuses([...includedOrderStatuses, `${v}`]);
          }
        },
        includedValues: includedOrderStatuses,
        excludedValues: excludedOrderStatuses,
        possibleValues: ["0", "1", "2", "3"],
      },
    ] as ColumnInfo<OrderJson>[]
  ).map((c) => ({
    ...c,
    sort:
      c.sort ||
      (typeof c.content === "string"
        ? (o) => setOrderBy([[c.content as string, o]])
        : undefined),
  }));

  useEffect(() => {
    console.log("refreshOrders");
    refreshOrders({
      include: [
        {
          model: "Employee",
        },
        {
          model: "RecentOrder",
        },
      ],
      order: orderBy,
      where: {
        customerName: search.length ? { "Op.iLike": `%${search}%` } : undefined,
        ...(includedOrderStatuses.length || excludedOrderStatuses.length
          ? {
              "Op.or": [
                {
                  "$RecentOrder.orderStatus$": {
                    "Op.and": [
                      ...(includedOrderStatuses.length
                        ? [{ "Op.in": includedOrderStatuses }]
                        : []),
                      ...(excludedOrderStatuses.length
                        ? [{ "Op.notIn": excludedOrderStatuses }]
                        : []),
                    ],
                  },
                },
                ...((includedOrderStatuses.length === 0 ||
                  includedOrderStatuses.includes("2")) &&
                (excludedOrderStatuses.length === 0 ||
                  !excludedOrderStatuses.includes("2"))
                  ? [{ "$RecentOrder.id$": { "Op.is": null } }]
                  : []),
              ],
            }
          : undefined),
      },
      limit: 150,
      offset: queryIdx,
    });
  }, [orderBy, queryIdx, search, includedOrderStatuses, excludedOrderStatuses]);

  const validationSchema = Yup.object().shape({
    customerName: Yup.string().required("Customer Name is required"),
    orderDate: Yup.date().required("Order Date is required"),
    totalPrice: Yup.number()
      .required("Order Total is required")
      .min(0, "Order Total must be a positive number"),
    status: Yup.string().required("Status is required"),
    EmployeeId: Yup.number().required("Employee is required"),
  });

  return (
    <>
      <EditorTable
        columns={columns}
        disabledKeys={orders
          .filter((o) => o.RecentOrder?.orderStatus === 3)
          .map((o) => `${o.id}`)}
        isLoading={ordersLoading}
        items={orders}
        numItems={numOrders}
        search={setSearch}
        sliceItems={(start, end) => {
          console.log("sliceItems");
          if (queryIdx <= start && end <= queryIdx + orders.length) {
            return orders.slice(start - queryIdx, end - queryIdx);
          } else {
            const qIdx = Math.max(start - 50, 0);

            setQueryIdx(qIdx);

            return orders.slice(start - qIdx, end - qIdx);
          }
        }}
        onCreate={() => {
          setOrder(undefined);
          openEditor();
        }}
        onDelete={async ({ id }: OrderJson) => {
          await destroyOrder({
            where: { id },
          });
          refreshOrders();
        }}
        onEdit={(order?: OrderJson) => {
          setOrder(order);
          openEditor();
        }}
      />
      <Modal
        disableAnimation
        isOpen={editorOpen}
        onClose={() => {
          refreshOrders();
          closeEditor();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <Formik
              initialValues={order || defaultOrder}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  if (order) {
                    await updateOrder(values as OrderUpdateAttributes);
                  } else {
                    await createOrder(values as OrderCreationAttributes);
                  }
                  onClose();
                } catch (e) {
                  setFieldError("global", JSON.stringify(e));
                  console.error(e);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                values,
                handleChange,
                isValid,
                submitForm,
                isSubmitting,
              }) => (
                <Form>
                  <ModalHeader>
                    {order ? "Edit Order" : "Create Order"}
                  </ModalHeader>
                  <ModalBody>
                    <MyField
                      required
                      label="Customer Name"
                      name="customerName"
                    />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="customerName"
                    />
                    <MyField
                      required
                      label="Order Date"
                      name="orderDate"
                      type="date"
                    />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="orderDate"
                    />
                    <MyField
                      required
                      label="Order Total"
                      name="totalPrice"
                      prefix="$"
                      type="number"
                    />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="totalPrice"
                    />
                    <MyField required label="Status" name="status" />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="status"
                    />

                    <Spacer y={1} />

                    {employeesLoading ? (
                      <Spinner />
                    ) : (
                      <Select
                        disableAnimation
                        items={employees}
                        label="Employee"
                        name="EmployeeId"
                        selectedKeys={
                          values.EmployeeId ? [values.EmployeeId] : []
                        }
                        onChange={(e) =>
                          handleChange({
                            ...e,
                            target: {
                              ...e.target,
                              value: e.target.value,
                            },
                          })
                        }
                      >
                        {(employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="EmployeeId"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <ErrorMessage name="global" />
                    <Button variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button
                      isDisabled={!isValid}
                      isLoading={isSubmitting}
                      type="submit"
                      onPress={submitForm}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
