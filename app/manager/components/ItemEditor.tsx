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
import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import { useItemFeatures } from "@/components/contexts/ItemFeaturesContext";
import { useItems } from "@/components/contexts/ItemsContext";
import { ColumnInfo, EditorTable } from "@/components/EditorTable";
import { MyField } from "@/components/MyField";
import {
  createItem,
  ItemCreationAttributes,
  ItemFeatureJson,
  ItemUpdateAttributes,
} from "@/server/db";
import { ItemJson, destroyItem } from "@/server/db";
import { updateItem } from "@/server/db/Item/update";
import { safeParseFloat, safeParseInt } from "@/utils";

/**
 * ItemEditor component allows users to view, create, edit, and delete items.
 * It fetches items and item features, and provides a table view with sorting,
 * searching, and filtering capabilities.
 *
 * @component
 * @example
 * return (
 *   <ItemEditor />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * This component uses several hooks and state variables to manage the items and their features.
 * It also uses the Formik library for form handling and validation.
 *
 * @hook
 * @name useItems
 * @description Fetches items and provides loading state and refresh function.
 *
 * @hook
 * @name useItemFeatures
 * @description Fetches item features and provides loading state.
 *
 * @hook
 * @name useDisclosure
 * @description Manages the open/close state of the editor modal.
 *
 * @state {ItemJson | undefined} item - The current item being edited or created.
 * @state {[string, string][]} order - The current sorting order of the items.
 * @state {string} search - The current search query.
 * @state {string[]} includedItemFeatures - The list of included item features for filtering.
 * @state {string[]} excludedItemFeatures - The list of excluded item features for filtering.
 *
 * @param {ItemJson[]} items - The list of items.
 * @param {boolean} itemsLoading - The loading state of the items.
 * @param {Function} refreshItems - The function to refresh the items.
 * @param {ItemFeatureJson[]} itemFeatures - The list of item features.
 * @param {boolean} itemFeaturesLoading - The loading state of the item features.
 * @param {boolean} editorOpen - The open state of the editor modal.
 * @param {Function} openEditor - The function to open the editor modal.
 * @param {Function} closeEditor - The function to close the editor modal.
 *
 * @function setItem - Sets the current item being edited or created.
 * @function setOrder - Sets the current sorting order of the items.
 * @function setSearch - Sets the current search query.
 * @function setIncludedItemFeatures - Sets the list of included item features for filtering.
 * @function setExcludedItemFeatures - Sets the list of excluded item features for filtering.
 * @function destroyItem - Deletes an item.
 * @function updateItem - Updates an existing item.
 * @function createItem - Creates a new item.
 *
 * @component EditorTable - Displays the items in a table with sorting, searching, and filtering capabilities.
 * @component Modal - Displays the editor modal for creating or editing items.
 * @component Formik - Handles form state and validation.
 * @component MyField - Custom form field component.
 * @component Select - Custom select component for item features.
 * @component Chip - Displays item features as chips.
 * @component Spinner - Displays a loading spinner.
 * @component Button - Custom button component.
 * @component ErrorMessage - Displays form error messages.
 */
/**
 * ItemEditor component is a React functional component that provides an interface for managing items.
 * It allows users to view, create, edit, and delete items, as well as filter items based on their features.
 *
 * @component
 * @example
 * return (
 *   <ItemEditor />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * This component uses several hooks and components from external libraries:
 * - `useItems` and `useItemFeatures` hooks to fetch items and their features.
 * - `useDisclosure` hook to manage the state of the modal.
 * - `Formik` for form management.
 * - `EditorTable` for displaying the list of items.
 * - `Modal` for displaying the item editor.
 * - `MyField` for form fields.
 * - `Select` for selecting item features.
 * - `Chip` for displaying item features.
 *
 * @todo
 * - Improve error handling and display user-friendly error messages.
 * - Add more validation to the form fields.
 * - Optimize performance for large datasets.
 *
 * @typedef {Object} ItemJson
 * @property {string} id - The unique identifier of the item.
 * @property {string} name - The name of the item.
 * @property {number} additionalPrice - The additional price of the item.
 * @property {ItemFeatureJson[]} ItemFeatures - The features associated with the item.
 *
 * @typedef {Object} ItemFeatureJson
 * @property {string} id - The unique identifier of the item feature.
 * @property {string} name - The name of the item feature.
 * @property {number} importance - The importance level of the item feature.
 *
 * @typedef {Object} ColumnInfo
 * @property {string} header - The header text of the column.
 * @property {string | Function} content - The content of the column, either a string key or a function.
 * @property {Function} [toKey] - A function to generate a key for the column.
 * @property {Function} [render] - A function to render the column content.
 * @property {Function} [filter] - A function to filter the column content.
 * @property {string[]} [includedKeys] - The keys to include in the filter.
 * @property {string[]} [excludedKeys] - The keys to exclude from the filter.
 * @property {string[]} [possibleKeys] - The possible keys for the filter.
 */
export const ItemEditor: React.FC = () => {
  const { items, itemsLoading, refreshItems } = useItems();
  const { itemFeatures, itemFeaturesLoading } = useItemFeatures();

  const {
    isOpen: editorOpen,
    onOpen: openEditor,
    onClose: closeEditor,
  } = useDisclosure();
  const [item, setItem] = React.useState<ItemJson | undefined>(undefined);

  const defaultItem = {
    additionalPrice: 0,
  } as ItemJson;

  const [order, setOrder] = React.useState<[string, string][]>([["id", "ASC"]]);
  const [search, setSearch] = React.useState("");

  const [includedItemFeatures, setIncludedItemFeatures] = React.useState<
    string[]
  >([]);
  const [excludedItemFeatures, setExcludedItemFeatures] = React.useState<
    string[]
  >([]);

  const columns: ColumnInfo<ItemJson>[] = (
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
        header: "Additional Price",
        content: "additionalPrice",
      },
      {
        header: "Features",
        toKey: (item) =>
          item.ItemFeatures?.sort((a, b) =>
            a.importance === b.importance
              ? 0
              : a.importance < b.importance
                ? -1
                : 1,
          ),
        render: (v: ItemFeatureJson[]) => (
          <div className="flex flex-wrap gap-2">
            {v.map((f, i) => (
              <Chip
                key={i}
                color={
                  f.importance === 0
                    ? "primary"
                    : f.importance === 1
                      ? "success"
                      : f.importance === 2
                        ? "secondary"
                        : f.importance === 3
                          ? "warning"
                          : undefined
                }
                size="sm"
              >
                {f.name}
              </Chip>
            ))}
          </div>
        ),
        filter: (v?: string) => {
          if (!v) {
            setIncludedItemFeatures([]);
            setExcludedItemFeatures([]);
          } else if (includedItemFeatures.includes(v)) {
            setIncludedItemFeatures(
              includedItemFeatures.filter((i) => i !== v),
            );
            setExcludedItemFeatures([...excludedItemFeatures, v]);
          } else if (excludedItemFeatures.includes(v)) {
            setIncludedItemFeatures(
              includedItemFeatures.filter((i) => i !== v),
            );
            setExcludedItemFeatures(
              excludedItemFeatures.filter((i) => i !== v),
            );
          } else {
            setExcludedItemFeatures(
              excludedItemFeatures.filter((i) => i !== v),
            );
            setIncludedItemFeatures([...includedItemFeatures, v]);
          }
        },
        includedKeys: includedItemFeatures,
        excludedKeys: excludedItemFeatures,
        possibleKeys: itemFeatures.map((if_) => [if_]),
      },
    ] as ColumnInfo<ItemJson>[]
  ).map((c) => ({
    ...c,
    sort:
      c.sort || typeof c.content === "string"
        ? (o) => setOrder([[c.content as string, o]])
        : undefined,
  }));

  React.useEffect(() => {
    refreshItems({
      include: [
        {
          model: "InventoryItem",
        },
        {
          model: "ItemFeature",
        },
      ],
      order,
      where: {
        "Op.and": [
          ...(search.length ? [{ name: { "Op.iLike": `%${search}%` } }] : []),
          ...(includedItemFeatures.length
            ? [
                `$$
            (
              SELECT COUNT(*) FROM "ItemFeatures"
                INNER JOIN "ItemFeatureLink" ON
                  "ItemFeatures"."id" = "ItemFeatureLink"."ItemFeatureId"
                  AND "Item"."id" = "ItemFeatureLink"."ItemId"
                  ${
                    includedItemFeatures.length
                      ? `
                    AND ("ItemFeatures"."name" IN (${includedItemFeatures.map((name) => `'${name}'`).join(", ")}))
                  `
                      : ""
                  }
            ) >= ${includedItemFeatures.length}$$`,
              ]
            : []),
          ...(excludedItemFeatures.length
            ? [
                `$$
            (
              SELECT COUNT(*) FROM "ItemFeatures"
                INNER JOIN "ItemFeatureLink" ON
                  "ItemFeatures"."id" = "ItemFeatureLink"."ItemFeatureId"
                  AND "Item"."id" = "ItemFeatureLink"."ItemId"
                  ${
                    excludedItemFeatures.length
                      ? `
                    AND ("ItemFeatures"."name" IN (${excludedItemFeatures.map((name) => `'${name}'`).join(", ")}))
                  `
                      : ""
                  }
            ) = 0$$`,
              ]
            : []),
        ],
      },
    });
  }, [order, search, includedItemFeatures, excludedItemFeatures]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    additionalPrice: Yup.number().min(
      0,
      "Additional Price must be a positive number",
    ),
    calories: Yup.number().min(0, "Calories must be a positive number"),
    InventoryItem: Yup.object().shape({
      servingsPerStock: Yup.number()
        .min(0, "Servings per Stock must be a positive number")
        .required("Servings per Stock is required"),
      currentStock: Yup.number()
        .min(0, "Current Stock must be a positive number")
        .required("Current Stock is required"),
      minStock: Yup.number()
        .min(0, "Restock Threshold must be a positive number")
        .required("Restock Threshold is required"),
      maxStock: Yup.number()
        .min(0, "Restock Target must be a positive number")
        .required("Restock Target is required"),
    }),
  });

  return (
    <>
      <EditorTable
        columns={columns}
        isLoading={itemsLoading}
        items={items}
        search={setSearch}
        onCreate={() => {
          setItem(undefined);
          openEditor();
        }}
        onDelete={async ({ id }: ItemJson) => {
          await destroyItem({
            where: { id },
          });
          refreshItems();
        }}
        onEdit={(item?: ItemJson) => {
          setItem(item);
          openEditor();
        }}
      />
      <Modal
        disableAnimation
        isOpen={editorOpen}
        onClose={() => {
          refreshItems();
          closeEditor();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <Formik
              initialValues={item || defaultItem}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  values = {
                    ...values,
                    InventoryItem: values.InventoryItem && {
                      ...values.InventoryItem,
                      name: values.name,
                    },
                    ItemFeatureIds: Array.from(
                      new Set(values.ItemFeatures?.map((f) => f.id)),
                    ),
                  } as any;
                  console.log(values);
                  if (item) {
                    await updateItem(values as ItemUpdateAttributes);
                  } else {
                    await createItem(values as ItemCreationAttributes);
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
                errors,
                touched,
              }) => (
                <Form>
                  <ModalHeader>
                    {item ? "Edit Item" : "Create Item"}
                  </ModalHeader>
                  <ModalBody>
                    <MyField required label="Name" name="name" />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="name"
                    />
                    <MyField
                      format={(v) => (v !== undefined ? v.toFixed(2) : "")}
                      label="Additional Price"
                      name="additionalPrice"
                      parse={safeParseFloat}
                      startContent="$"
                      type="number"
                    />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="additionalPrice"
                    />
                    <MyField
                      endContent="Cal"
                      label="Calories"
                      name="calories"
                      parse={safeParseInt}
                      type="number"
                    />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="calories"
                    />
                    <Spacer y={1} />
                    <h3>Inventory</h3>
                    <MyField
                      required
                      label="Servings per Stock"
                      name="InventoryItem.servingsPerStock"
                      parse={safeParseInt}
                    />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="InventoryItem.servingsPerStock"
                    />
                    <MyField
                      required
                      label="Current Stock"
                      name="InventoryItem.currentStock"
                      parse={safeParseInt}
                    />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="InventoryItem.currentStock"
                    />
                    <MyField
                      required
                      label="Restock Threshold"
                      name="InventoryItem.minStock"
                      parse={safeParseInt}
                    />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="InventoryItem.minStock"
                    />
                    <MyField
                      required
                      label="Restock Target"
                      name="InventoryItem.maxStock"
                      parse={safeParseInt}
                    />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="InventoryItem.maxStock"
                    />
                    <Spacer y={1} />
                    {itemFeaturesLoading ? (
                      <Spinner />
                    ) : (
                      <Select
                        disableAnimation
                        items={itemFeatures}
                        label="Tags"
                        name="ItemFeatures"
                        selectedKeys={
                          values.ItemFeatures?.map((f) => f.id) || []
                        }
                        selectionMode="multiple"
                        onChange={(e) =>
                          handleChange({
                            ...e,
                            target: {
                              ...e.target,
                              value: e.target.value
                                .split(",")
                                .map((id) => ({ id })),
                            },
                          })
                        }
                      >
                        {(f) => <SelectItem key={f.id}>{f.name}</SelectItem>}
                      </Select>
                    )}
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
