import {
  useDisclosure,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ChipProps,
  ModalBody,
  Button,
  ModalFooter,
  Select,
  SelectItem,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { Formik, Form, ErrorMessage } from "formik";
import React from "react";
import * as Yup from "yup";

import { useSellableCategories } from "@/components/contexts/SellableCategoriesContext";
import { useSellables } from "@/components/contexts/SellablesContext";
import { ColumnInfo, EditorTable } from "@/components/EditorTable";
import { MyField } from "@/components/MyField";
import {
  createSellable,
  updateSellable,
  destroySellable,
  SellableCategoryJson,
} from "@/server/db";
import {
  SellableJson,
  SellableUpdateAttributes,
  SellableCreationAttributes,
} from "@/server/db";
import { safeParseFloat } from "@/utils";

/**
 * SellableEditor component allows users to view, create, edit, and delete sellable items.
 * It provides a table view of sellables with sorting, searching, and filtering capabilities.
 * Users can open a modal to create or edit a sellable item.
 *
 * @component
 * @example
 * return (
 *   <SellableEditor />
 * )
 *
 * @returns {JSX.Element} The rendered SellableEditor component.
 *
 * @remarks
 * This component uses several hooks to manage state and side effects:
 * - `useSellables` to fetch and manage sellable items.
 * - `useSellableCategories` to fetch and manage sellable categories.
 * - `useDisclosure` to manage the state of the modal.
 *
 * The component also uses the `Formik` library for form handling within the modal.
 *
 * @hook {function} useSellables - Hook to fetch and manage sellable items.
 * @hook {function} useSellableCategories - Hook to fetch and manage sellable categories.
 * @hook {function} useDisclosure - Hook to manage the state of the modal.
 *
 * @typedef {Object} SellableJson - The JSON representation of a sellable item.
 * @typedef {Object} SellableCategoryJson - The JSON representation of a sellable category.
 * @typedef {Object} ColumnInfo - Information about a column in the table.
 * @typedef {Object} ChipProps - Properties for the Chip component.
 *
 * @state {SellableJson | undefined} sellable - The current sellable item being edited or created.
 * @state {Array<[string, string]>} order - The current sorting order of the table.
 * @state {string} search - The current search query.
 * @state {Array<string>} includedSellableCategories - The categories to include in the filter.
 * @state {Array<string>} excludedSellableCategories - The categories to exclude in the filter.
 *
 * @function openEditor - Opens the modal for creating or editing a sellable item.
 * @function closeEditor - Closes the modal for creating or editing a sellable item.
 * @function setSellable - Sets the current sellable item being edited or created.
 * @function setOrder - Sets the sorting order of the table.
 * @function setSearch - Sets the search query.
 * @function setIncludedSellableCategories - Sets the categories to include in the filter.
 * @function setExcludedSellableCategories - Sets the categories to exclude in the filter.
 * @function refreshSellables - Refreshes the list of sellable items.
 * @function destroySellable - Deletes a sellable item.
 * @function updateSellable - Updates a sellable item.
 * @function createSellable - Creates a new sellable item.
 */
export const SellableEditor: React.FC = () => {
  const { sellables, sellablesLoading, refreshSellables } = useSellables();
  const { sellableCategories } = useSellableCategories();

  const {
    isOpen: editorOpen,
    onOpen: openEditor,
    onClose: closeEditor,
  } = useDisclosure();
  const [sellable, setSellable] = React.useState<SellableJson | undefined>(
    undefined,
  );

  const defaultSellable = {
    price: 0,
  } as SellableJson;

  const [order, setOrder] = React.useState<[string, string][]>([["id", "ASC"]]);
  const [search, setSearch] = React.useState("");

  const [includedSellableCategories, setIncludedSellableCategories] =
    React.useState<string[]>([]);
  const [excludedSellableCategories, setExcludedSellableCategories] =
    React.useState<string[]>([]);

  const columns: ColumnInfo<SellableJson>[] = (
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
        header: "Price",
        content: "price",
      },
      {
        header: "Categories",
        toKey: (sellable) => sellable.SellableCategories || [],
        render: (scs: SellableCategoryJson[]) => (
          <div className="flex flex-wrap gap-2">
            {scs.map((cat, i) => {
              let props: ChipProps = {
                size: "sm",
              };

              switch (cat.importance) {
                case 0:
                  props = { ...props, color: "primary" };
                  break;
                case 1:
                  props = { ...props, color: "success" };
                  break;
                case 2:
                  props = { ...props, color: "secondary" };
                  break;
              }

              return (
                <Chip key={i} {...props}>
                  {cat.name}
                </Chip>
              );
            })}
          </div>
        ),
        filter: (v?: string) => {
          if (!v) {
            setIncludedSellableCategories([]);
            setExcludedSellableCategories([]);
          } else if (includedSellableCategories.includes(v)) {
            setIncludedSellableCategories(
              includedSellableCategories.filter((i) => i !== v),
            );
            setExcludedSellableCategories([...excludedSellableCategories, v]);
          } else if (excludedSellableCategories.includes(v)) {
            setIncludedSellableCategories(
              includedSellableCategories.filter((i) => i !== v),
            );
            setExcludedSellableCategories(
              excludedSellableCategories.filter((i) => i !== v),
            );
          } else {
            setExcludedSellableCategories(
              excludedSellableCategories.filter((i) => i !== v),
            );
            setIncludedSellableCategories([...includedSellableCategories, v]);
          }
        },
        includedKeys: includedSellableCategories,
        excludedKeys: excludedSellableCategories,
        possibleKeys: sellableCategories.map((cat) => [cat]),
      },
    ] as ColumnInfo<SellableJson>[]
  ).map((c) => ({
    ...c,
    sort:
      c.sort || typeof c.content === "string"
        ? (o) => setOrder([[c.content as string, o]])
        : undefined,
  }));

  React.useEffect(() => {
    refreshSellables({
      include: [
        {
          model: "SellableCategory",
        },
      ],
      order,
      where: {
        "Op.and": [
          ...(search.length ? [{ name: { "Op.iLike": `%${search}%` } }] : []),
          ...(includedSellableCategories.length
            ? [
                `$$
            (
              SELECT COUNT(*) FROM "SellableCategories"
                INNER JOIN "SellableCategoryLink" ON
                  "SellableCategories"."id" = "SellableCategoryLink"."SellableCategoryId"
                  AND "Sellable"."id" = "SellableCategoryLink"."SellableId"
                  ${
                    includedSellableCategories.length
                      ? `
                    AND ("SellableCategories"."name" IN (${includedSellableCategories.map((name) => `'${name}'`).join(", ")}))
                  `
                      : ""
                  }
            ) >= ${includedSellableCategories.length}$$`,
              ]
            : []),
          ...(excludedSellableCategories.length
            ? [
                `$$
            (
              SELECT COUNT(*) FROM "SellableCategories"
                INNER JOIN "SellableCategoryLink" ON
                  "SellableCategories"."id" = "SellableCategoryLink"."SellableCategoryId"
                  AND "Sellable"."id" = "SellableCategoryLink"."SellableId"
                  ${
                    excludedSellableCategories.length
                      ? `
                    AND ("SellableCategories"."name" IN (${excludedSellableCategories.map((name) => `'${name}'`).join(", ")}))
                  `
                      : ""
                  }
            ) = 0$$`,
              ]
            : []),
        ],
      },
    });
  }, [order, search, includedSellableCategories, excludedSellableCategories]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be a positive number"),
    SellableCategories: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required(),
      }),
    ),
  });

  return (
    <>
      <EditorTable
        columns={columns}
        isLoading={sellablesLoading}
        items={sellables}
        search={setSearch}
        onCreate={() => {
          setSellable(undefined);
          openEditor();
        }}
        onDelete={async ({ id }: SellableJson) => {
          await destroySellable({
            where: { id },
          });
          refreshSellables();
        }}
        onEdit={(sellable?: SellableJson) => {
          setSellable(sellable);
          openEditor();
        }}
      />
      <Modal
        disableAnimation
        isOpen={editorOpen}
        onClose={() => {
          refreshSellables();
          closeEditor();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <Formik
              initialValues={sellable || defaultSellable}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  values = {
                    ...values,
                    SellableCategoryIds: Array.from(
                      new Set(values.SellableCategories?.map((cat) => cat.id)),
                    ),
                    SellableComponentIds: Array.from(
                      new Set(
                        values.SellableComponents?.map((comp) => comp.id),
                      ),
                    ),
                  } as any;
                  if (sellable) {
                    await updateSellable(values as SellableUpdateAttributes);
                  } else {
                    await createSellable(values as SellableCreationAttributes);
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
                    {sellable ? "Edit Sellable" : "Create Sellable"}
                  </ModalHeader>
                  <ModalBody>
                    <MyField required label="Name" name="name" />
                    <ErrorMessage
                      className="error-message"
                      component="div"
                      name="name"
                    />
                    <MyField
                      format={(v) => (v !== undefined ? v.toFixed(2) : "")}
                      label="Price"
                      name="price"
                      parse={safeParseFloat}
                      startContent="$"
                      type="number"
                    />
                    <ErrorMessage
                      className="error-message"
                      component="div"
                      name="price"
                    />
                    <Spacer y={1} />
                    {sellableCategories.length ? (
                      <Select
                        disableAnimation
                        items={sellableCategories}
                        label="Categories"
                        name="SellableCategories"
                        selectedKeys={
                          values.SellableCategories?.map((cat) => cat.id) || []
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
                        {(cat) => (
                          <SelectItem key={cat.id}>{cat.name}</SelectItem>
                        )}
                      </Select>
                    ) : (
                      <Spinner />
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <ErrorMessage
                      className="error-message"
                      component="div"
                      name="global"
                    />
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
