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
import { CreationAttributes } from "sequelize";
import * as Yup from "yup";

import { useItemFeatures } from "@/components/contexts/ItemFeaturesContext";
import { ColumnInfo, EditorTable } from "@/components/EditorTable";
import { MyField } from "@/components/MyField";
import { ItemFeature } from "@/db";
import {
  createItemFeature,
  destroyItemFeature,
  ItemFeatureJson,
} from "@/server/db";
import { safeParseInt } from "@/utils";

/**
 * ItemFeatureEditor component allows users to view, create, edit, and delete item features.
 *
 * This component uses the following hooks:
 * - `useItemFeatures`: Fetches item features and provides loading state and refresh function.
 * - `useDisclosure`: Manages the state of the editor modal.
 *
 * State variables:
 * - `itemFeature`: Holds the current item feature being edited or created.
 * - `defaultItemFeature`: Default values for a new item feature.
 * - `order`: Sorting order for the item features table.
 * - `search`: Search query for filtering item features by name.
 * - `includedImportances`: List of importance levels to include in the filter.
 * - `excludedImportances`: List of importance levels to exclude from the filter.
 * - `isPrimary`: Filter for primary item features.
 *
 * Columns configuration for the `EditorTable`:
 * - `ID`: Displays the ID of the item feature.
 * - `Name`: Displays the name of the item feature with a color-coded chip based on importance.
 * - `Importance`: Displays and filters item features by importance.
 * - `Primary?`: Displays and filters item features by primary status.
 *
 * Effects:
 * - Refreshes item features based on sorting order, search query, and filters.
 *
 * Renders:
 * - `EditorTable`: Displays the list of item features with sorting, searching, and filtering capabilities.
 * - `Modal`: Provides a form for creating or editing an item feature.
 *
 * Formik is used for form management within the modal.
 */
export const ItemFeatureEditor: React.FC = () => {
  const { itemFeatures, itemFeaturesLoading, refreshItemFeatures } =
    useItemFeatures();

  const {
    isOpen: editorOpen,
    onOpen: openEditor,
    onClose: closeEditor,
  } = useDisclosure();
  const [itemFeature, setItemFeature] = React.useState<
    ItemFeatureJson | undefined
  >(undefined);

  const defaultItemFeature = {
    importance: 0,
    is_primary: false,
  } as ItemFeatureJson;

  const [order, setOrder] = React.useState<[string, string][]>([["id", "ASC"]]);
  const [search, setSearch] = React.useState("");

  const [includedImportances, setIncludedImportances] = React.useState<
    string[]
  >([]);
  const [excludedImportances, setExcludedImportances] = React.useState<
    string[]
  >([]);
  const [isPrimary, setIsPrimary] = React.useState<boolean | undefined>(
    undefined,
  );

  const columns: ColumnInfo<ItemFeatureJson>[] = (
    [
      {
        header: "ID",
        content: "id",
      },
      {
        header: "Name",
        render: (f) => (
          <Chip
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
        ),
        sort: (o) => setOrder([["name", o]]),
      },
      {
        header: "Importance",
        content: "importance",
        filter: (include: string[], exclude: string[]) => {
          setIncludedImportances(include);
          setExcludedImportances(exclude);
        },
        includedKeys: includedImportances,
        excludedKeys: excludedImportances,
        possibleKeys: ["0", "1", "2", "3", "4", "5"],
        sort: (o) => setOrder([["importance", o]]),
      },
      {
        header: "Primary?",
        toKey: (f) => (f.is_primary ? "Yes" : "No"),
        render: (v) =>
          v === "Yes" ? (
            <Chip size="sm">Yes</Chip>
          ) : (
            <Chip variant={"flat"}>No</Chip>
          ),
        filter: (v?: string) => {
          if (!v) {
            setIsPrimary(undefined);
          } else {
            setIsPrimary(v === "Yes");
          }
        },
        includedKeys: isPrimary === undefined ? [] : [isPrimary ? "Yes" : "No"],
        possibleKeys: ["Yes", "No"],
      },
    ] as ColumnInfo<ItemFeatureJson>[]
  ).map((c) => ({
    ...c,
    sort:
      c.sort || typeof c.content === "string"
        ? (o) => setOrder([[c.content as string, o]])
        : undefined,
  }));

  useEffect(() => {
    refreshItemFeatures({
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
        is_primary: isPrimary,
      },
    });
  }, [order, search, includedImportances, excludedImportances, isPrimary]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    importance: Yup.number()
      .min(0, "Importance must be at least 0")
      .max(5, "Importance must be at most 5")
      .required("Importance is required"),
    is_primary: Yup.boolean(),
  });

  return (
    <>
      <EditorTable
        columns={columns}
        isLoading={itemFeaturesLoading}
        items={itemFeatures}
        search={setSearch}
        onCreate={() => {
          setItemFeature(undefined);
          openEditor();
        }}
        onDelete={async ({ id }: ItemFeatureJson) => {
          await destroyItemFeature({
            where: { id },
          });
          refreshItemFeatures();
        }}
      />
      <Modal
        disableAnimation
        isOpen={editorOpen}
        onClose={() => {
          refreshItemFeatures();
          closeEditor();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <Formik
              initialValues={itemFeature || defaultItemFeature}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  await createItemFeature(
                    values as CreationAttributes<ItemFeature>,
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
                  <ModalHeader>
                    {itemFeature ? "Edit Item Feature" : "Create Item Feature"}
                  </ModalHeader>
                  <ModalBody>
                    <MyField required label="Name" name="name" />
                    <ErrorMessage
                      className="error-message"
                      component="div"
                      name="name"
                    />
                    <MyField
                      label="Importance"
                      name="importance"
                      parse={safeParseInt}
                      type="number"
                    />
                    <ErrorMessage
                      className="error-message"
                      component="div"
                      name="importance"
                    />
                    <MyField
                      label="Is Primary"
                      name="is_primary"
                      type="checkbox"
                    />
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
