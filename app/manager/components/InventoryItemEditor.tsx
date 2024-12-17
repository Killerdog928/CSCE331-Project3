import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";

import { useInventoryItems } from "@/components/contexts/InventoryItemsContext";
import { ColumnInfo, EditorTable } from "@/components/EditorTable";
import { MyField } from "@/components/MyField";
import {
  InventoryItemUpdateAttributes,
  updateInventoryItem,
  InventoryItemJson,
} from "@/server/db";
import { safeParseInt } from "@/utils";

/**
 * InventoryItemEditor component allows users to view, filter, sort, and edit inventory items.
 *
 * @component
 * @example
 * return (
 *   <InventoryItemEditor />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @description
 * This component fetches and displays a list of inventory items, allowing users to filter by name and restock status,
 * sort by various columns, and edit individual inventory items in a modal form.
 *
 * @hook
 * - `useInventoryItems` - Custom hook to fetch inventory items.
 * - `useDisclosure` - Custom hook to manage modal state.
 *
 * @state
 * - `inventoryItem` - The currently selected inventory item for editing.
 * - `order` - The current sorting order for the inventory items.
 * - `search` - The current search query for filtering inventory items by name.
 * - `needsRestock` - The current filter state for items that need restocking.
 *
 * @dependencies
 * - `refreshInventoryItems` - Function to refresh the list of inventory items.
 * - `updateInventoryItem` - Function to update an inventory item.
 *
 * @param {Object} props - The props for the component.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const InventoryItemEditor: React.FC = () => {
  const { inventoryItems, inventoryItemsLoading, refreshInventoryItems } =
    useInventoryItems();

  const {
    isOpen: editorOpen,
    onOpen: openEditor,
    onClose: closeEditor,
  } = useDisclosure();
  const [inventoryItem, setInventoryItem] = React.useState<InventoryItemJson>(
    {} as InventoryItemJson,
  );

  const [order, setOrder] = React.useState<[string, string][]>([]);
  const [search, setSearch] = React.useState("");
  const [needsRestock, setNeedsRestock] = React.useState<boolean | undefined>(
    undefined,
  );

  const columns: ColumnInfo<InventoryItemJson>[] = (
    [
      {
        header: "ID",
        content: "id",
      },
      {
        header: "Name",
        content: "name",
      },
      {
        header: "Current Stock",
        content: "currentStock",
      },
      {
        header: "Needs Restock",
        toKey: (ii) =>
          ii.Item && ii.currentStock < ii.minStock ? "Yes" : "No",
        render: (v) =>
          v === "Yes" ? (
            <Chip color="danger" size="sm">
              Yes
            </Chip>
          ) : (
            <Chip size="sm" variant="flat">
              No
            </Chip>
          ),
        filter: (v?: string) => {
          if (!v) {
            setNeedsRestock(undefined);
          } else {
            setNeedsRestock(v === "Yes");
          }
        },
        includedKeys:
          needsRestock === undefined ? [] : [needsRestock ? "Yes" : "No"],
        possibleKeys: ["Yes", "No"],
      },
      {
        header: "Restock Threshold",
        content: "minStock",
      },
      {
        header: "Restock Target",
        content: "maxStock",
      },
    ] as ColumnInfo<InventoryItemJson>[]
  ).map((c) => ({
    ...c,
    sort:
      c.sort || typeof c.content === "string"
        ? (o) => setOrder([[c.content as string, o]])
        : undefined,
  }));

  useEffect(() => {
    refreshInventoryItems({
      include: [
        {
          model: "Item",
        },
      ],
      order,
      where: {
        name: search.length ? { "Op.iLike": `%${search}%` } : undefined,
        ...(needsRestock === undefined
          ? undefined
          : needsRestock
            ? {
                "Op.and": [
                  { currentStock: { "Op.lt": "$InventoryItem.minStock$" } },
                  { "$Item.id$": { "Op.not": null } },
                ],
              }
            : {
                "Op.or": [
                  { currentStock: { "Op.gte": "$InventoryItem.minStock$" } },
                  { "$Item.id$": { "Op.is": null } },
                ],
              }),
      },
    });
  }, [order, search, needsRestock]);

  useEffect(() => {
    console.log(inventoryItems);
  }, [inventoryItems]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    servingsPerStock: Yup.number()
      .required("Servings per Stock is required")
      .integer("Must be an integer")
      .min(1, "Must be at least 1"),
    currentStock: Yup.number()
      .required("Current Stock is required")
      .integer("Must be an integer")
      .min(0, "Cannot be negative"),
    minStock: Yup.number()
      .required("Restock Threshold is required")
      .integer("Must be an integer")
      .min(0, "Cannot be negative"),
    maxStock: Yup.number()
      .required("Restock Target is required")
      .integer("Must be an integer")
      .min(1, "Must be at least 1"),
  });

  return (
    <>
      <EditorTable
        columns={columns}
        disabledKeys={inventoryItems
          .map((ii, i) => ({ ii, i }))
          .filter(({ ii }) => ii.Item === undefined)
          .map(({ i }) => `${i}`)}
        isLoading={inventoryItemsLoading}
        items={inventoryItems}
        search={setSearch}
        onEdit={(item?: InventoryItemJson) => {
          setInventoryItem(item!);
          openEditor();
        }}
      />
      <Modal
        disableAnimation
        isOpen={editorOpen}
        onClose={() => {
          refreshInventoryItems();
          closeEditor();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <Formik
              initialValues={inventoryItem}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  await updateInventoryItem(
                    values as InventoryItemUpdateAttributes,
                  );
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
                // values,
                // handleChange,
                isValid,
                submitForm,
                isSubmitting,
              }) => (
                <Form>
                  <ModalHeader>Edit Inventory Item</ModalHeader>
                  <ModalBody>
                    <MyField required label="Name" name="name" />
                    <ErrorMessage component="div" name="name" />
                    <MyField
                      required
                      label="Servings per Stock"
                      name="servingsPerStock"
                      parse={safeParseInt}
                    />
                    <ErrorMessage component="div" name="servingsPerStock" />
                    <MyField
                      required
                      label="Current Stock"
                      name="currentStock"
                      parse={safeParseInt}
                    />
                    <ErrorMessage component="div" name="currentStock" />
                    <MyField
                      required
                      label="Restock Threshold"
                      name="minStock"
                      parse={safeParseInt}
                    />
                    <ErrorMessage component="div" name="minStock" />
                    <MyField
                      required
                      label="Restock Target"
                      name="maxStock"
                      parse={safeParseInt}
                    />
                    <ErrorMessage component="div" name="maxStock" />
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
