import { Button } from "@nextui-org/button";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Formik, Form, ErrorMessage } from "formik";
import React from "react";
import * as Yup from "yup";

import { useSellableCategories } from "@/components/contexts/SellableCategoriesContext";
import { EditorTable, ColumnInfo } from "@/components/EditorTable";
import { MyField } from "@/components/MyField";
import {
  SellableCategoryJson,
  SellableCategoryCreationAttributes,
} from "@/server/db";
import { createSellableCategory, destroySellableCategory } from "@/server/db";
import { safeParseInt } from "@/utils";

/**
 * SellableCategoryEditor component allows users to manage sellable categories.
 * It provides functionalities to create, edit, delete, and filter sellable categories.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <SellableCategoryEditor />
 *
 * @remarks
 * This component uses the `useSellableCategories` hook to fetch and manage sellable categories.
 * It also uses `useDisclosure` for managing the state of the editor modal.
 *
 * @hook
 * @name useSellableCategories
 * @description Fetches and manages sellable categories.
 *
 * @hook
 * @name useDisclosure
 * @description Manages the state of the editor modal.
 *
 * @typedef {Object} SellableCategoryJson
 * @property {string} id - The ID of the sellable category.
 * @property {string} name - The name of the sellable category.
 * @property {string} importance - The importance level of the sellable category.
 *
 * @typedef {Object} SellableCategoryCreationAttributes
 * @property {string} name - The name of the sellable category.
 * @property {string} importance - The importance level of the sellable category.
 *
 * @typedef {Object} ColumnInfo
 * @property {string} header - The header of the column.
 * @property {string} content - The content of the column.
 * @property {function} [filter] - The filter function for the column.
 * @property {string[]} [includedKeys] - The included keys for filtering.
 * @property {string[]} [excludedKeys] - The excluded keys for filtering.
 * @property {string[]} [possibleKeys] - The possible keys for filtering.
 * @property {function} [sort] - The sort function for the column.
 *
 * @param {Object} props - The props for the component.
 *
 * @state {SellableCategoryJson | undefined} sellableCategory - The current sellable category being edited.
 * @state {Array.<[string, string]>} order - The order of the columns.
 * @state {string} search - The search term for filtering categories.
 * @state {string[]} includedImportances - The included importance levels for filtering.
 * @state {string[]} excludedImportances - The excluded importance levels for filtering.
 *
 * @effect Refreshes the sellable categories when the order, search term, includedImportances, or excludedImportances change.
 *
 * @function openEditor - Opens the editor modal.
 * @function closeEditor - Closes the editor modal.
 * @function setSellableCategory - Sets the current sellable category being edited.
 * @function setOrder - Sets the order of the columns.
 * @function setSearch - Sets the search term for filtering categories.
 * @function setIncludedImportances - Sets the included importance levels for filtering.
 * @function setExcludedImportances - Sets the excluded importance levels for filtering.
 * @function refreshSellableCategories - Refreshes the sellable categories.
 * @function destroySellableCategory - Deletes a sellable category.
 * @function createSellableCategory - Creates a new sellable category.
 */
export const SellableCategoryEditor: React.FC = () => {
  const {
    sellableCategories,
    sellableCategoriesLoading,
    refreshSellableCategories,
  } = useSellableCategories();

  const {
    isOpen: editorOpen,
    onOpen: openEditor,
    onClose: closeEditor,
  } = useDisclosure();
  const [sellableCategory, setSellableCategory] = React.useState<
    SellableCategoryJson | undefined
  >(undefined);

  const defaultSellableCategory = {} as SellableCategoryJson;

  const [order, setOrder] = React.useState<[string, string][]>([["id", "ASC"]]);
  const [search, setSearch] = React.useState("");

  const [includedImportances, setIncludedImportances] = React.useState<
    string[]
  >([]);
  const [excludedImportances, setExcludedImportances] = React.useState<
    string[]
  >([]);

  const columns: ColumnInfo<SellableCategoryJson>[] = (
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
        header: "Importance",
        content: "importance",
        filter: (v?: string) => {
          if (!v) {
            setIncludedImportances([]);
            setExcludedImportances([]);
          } else if (includedImportances.includes(v)) {
            setIncludedImportances(includedImportances.filter((i) => i !== v));
            setExcludedImportances([...excludedImportances, v]);
          } else if (excludedImportances.includes(v)) {
            setIncludedImportances(includedImportances.filter((i) => i !== v));
            setExcludedImportances(excludedImportances.filter((i) => i !== v));
          } else {
            setExcludedImportances(excludedImportances.filter((i) => i !== v));
            setIncludedImportances([...includedImportances, v]);
          }
        },
        includedKeys: includedImportances,
        excludedKeys: excludedImportances,
        possibleKeys: ["0", "1", "2", "3"],
      },
    ] as ColumnInfo<SellableCategoryJson>[]
  ).map((c) => ({
    ...c,
    sort:
      c.sort ||
      (typeof c.content === "string"
        ? (o) => setOrder([[c.content as string, o]])
        : undefined),
  }));

  React.useEffect(() => {
    refreshSellableCategories({
      order,
      where: {
        name: search.length ? { "Op.iLike": `%${search}%` } : undefined,
        importance:
          includedImportances.length || excludedImportances.length
            ? {
                "Op.and": [
                  ...(includedImportances.length
                    ? [{ "Op.in": includedImportances }]
                    : []),
                  ...(excludedImportances.length
                    ? [{ "Op.notIn": excludedImportances }]
                    : []),
                ],
              }
            : undefined,
      },
    });
  }, [order, search, includedImportances, excludedImportances]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    importance: Yup.number()
      .required("Importance is required")
      .integer("Importance must be an integer")
      .min(0, "Importance must be at least 0")
      .max(3, "Importance must be at most 3"),
  });

  return (
    <>
      <EditorTable
        columns={columns}
        isLoading={sellableCategoriesLoading}
        items={sellableCategories}
        search={setSearch}
        onCreate={() => {
          setSellableCategory(undefined);
          openEditor();
        }}
        onDelete={async ({ id }: SellableCategoryJson) => {
          await destroySellableCategory({
            where: { id },
          });
          refreshSellableCategories();
        }}
        onEdit={(sellableCategory?: SellableCategoryJson) => {
          setSellableCategory(sellableCategory);
          openEditor();
        }}
      />
      <Modal
        disableAnimation
        isOpen={editorOpen}
        onClose={() => {
          refreshSellableCategories();
          closeEditor();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <Formik
              initialValues={sellableCategory || defaultSellableCategory}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  await createSellableCategory(
                    values as SellableCategoryCreationAttributes,
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
              {({ isValid, submitForm, isSubmitting }) => (
                <Form>
                  <ModalHeader>Edit Sellable Category</ModalHeader>
                  <ModalBody>
                    <MyField required label="Name" name="name" />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="name"
                    />
                    <MyField
                      required
                      label="Importance"
                      name="importance"
                      parse={safeParseInt}
                    />
                    <ErrorMessage
                      className="error"
                      component="div"
                      name="importance"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <ErrorMessage
                      className="error"
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
