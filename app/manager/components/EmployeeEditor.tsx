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
import React, { useEffect } from "react";
import * as Yup from "yup";

import { useEmployees } from "@/components/contexts/EmployeesContext";
import { useJobPositions } from "@/components/contexts/JobPositionsContext";
import { ColumnInfo, EditorTable } from "@/components/EditorTable";
import { MyField } from "@/components/MyField";
import {
  createEmployee,
  EmployeeCreationAttributes,
  EmployeeUpdateAttributes,
} from "@/server/db";
import { EmployeeJson, destroyEmployee } from "@/server/db";
import { updateEmployee } from "@/server/db/Employee/update";

/**
 * EmployeeEditor component allows for the creation, editing, and deletion of employees.
 * It fetches and displays a list of employees and their job positions, and provides
 * a modal form for editing or creating employee records.
 *
 * @component
 * @example
 * // Usage example:
 * <EmployeeEditor />
 *
 * @returns {React.FC} A React functional component.
 *
 * @remarks
 * This component uses several hooks to manage state and side effects:
 * - `useEmployees` to fetch and manage employee data.
 * - `useJobPositions` to fetch and manage job position data.
 * - `useDisclosure` to manage the state of the modal editor.
 *
 * The component also defines several state variables:
 * - `employee` to hold the current employee being edited or created.
 * - `order` to manage the sorting order of the employee list.
 * - `search` to manage the search query for filtering employees.
 * - `includedJobPositions` and `excludedJobPositions` to manage job position filters.
 *
 * The `columns` array defines the structure of the employee table, including headers,
 * content, sorting, and filtering logic.
 *
 * The `useEffect` hook is used to refresh the employee list whenever the filters,
 * sorting order, or search query changes.
 *
 * The component renders an `EditorTable` for displaying the employee list and a `Modal`
 * for editing or creating employees. The modal form is managed using Formik for form
 * state and validation.
 *
 * @dependencies
 * - `useEmployees` hook for fetching and managing employee data.
 * - `useJobPositions` hook for fetching and managing job position data.
 * - `useDisclosure` hook for managing modal state.
 * - `Formik` for form state management and validation.
 * - `EditorTable`, `Modal`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter`,
 *   `MyField`, `Select`, `SelectItem`, `Chip`, `Button`, `Spinner`, `Spacer`, `ErrorMessage`
 *   for UI components.
 */
export const EmployeeEditor: React.FC = () => {
  const { employees, employeesLoading, refreshEmployees } = useEmployees();
  const { jobPositions, jobPositionsLoading } = useJobPositions();

  const {
    isOpen: editorOpen,
    onOpen: openEditor,
    onClose: closeEditor,
  } = useDisclosure();
  const [employee, setEmployee] = React.useState<EmployeeJson | undefined>(
    undefined,
  );

  const [order, setOrder] = React.useState<[string, string][]>([["id", "ASC"]]);
  const [search, setSearch] = React.useState("");

  const [includedJobPositions, setIncludedJobPositions] = React.useState<
    string[]
  >([]);
  const [excludedJobPositions, setExcludedJobPositions] = React.useState<
    string[]
  >([]);

  const defaultEmployee = {} as EmployeeJson;

  const columns: ColumnInfo<EmployeeJson>[] = (
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
        header: "Email",
        content: "email",
      },
      {
        header: "Job Position",
        toKey: (employee: EmployeeJson) => employee.JobPosition?.name || "",
        render: (v) => {
          switch (v) {
            case "Manager":
              return <Chip color="primary">Manager</Chip>;
            case "Employee":
              return <Chip color="secondary">Employee</Chip>;
            default:
              return <Chip variant="flat">{v}</Chip>;
          }
        },
        filter: (v?: string) => {
          if (!v) {
            setIncludedJobPositions([]);
            setExcludedJobPositions([]);
          } else if (includedJobPositions.includes(v)) {
            setIncludedJobPositions(
              includedJobPositions.filter((i) => i !== v),
            );
            setExcludedJobPositions([...excludedJobPositions, v]);
          } else if (excludedJobPositions.includes(v)) {
            setIncludedJobPositions(
              includedJobPositions.filter((i) => i !== v),
            );
            setExcludedJobPositions(
              excludedJobPositions.filter((i) => i !== v),
            );
          } else {
            setExcludedJobPositions(
              excludedJobPositions.filter((i) => i !== v),
            );
            setIncludedJobPositions([...includedJobPositions, v]);
          }
        },
        includedKeys: includedJobPositions,
        excludedKeys: excludedJobPositions,
        possibleKeys: jobPositions.map((jp) => jp.name),
      },
    ] as ColumnInfo<EmployeeJson>[]
  ).map((c) => ({
    ...c,
    sort:
      c.sort || typeof c.content === "string"
        ? (o) => setOrder([[c.content as string, o]])
        : undefined,
  }));

  useEffect(() => {
    refreshEmployees({
      include: [
        {
          model: "JobPosition",
          where: {
            name:
              includedJobPositions.length || excludedJobPositions.length
                ? {
                    "Op.and": [
                      ...(includedJobPositions.length
                        ? [{ "Op.in": includedJobPositions }]
                        : []),
                      ...(excludedJobPositions.length
                        ? [{ "Op.notIn": excludedJobPositions }]
                        : []),
                    ],
                  }
                : undefined,
          },
        },
      ],
      order,
      where: {
        name: search.length ? { "Op.iLike": `%${search}%` } : undefined,
      },
    });
  }, [includedJobPositions, excludedJobPositions, order, search]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    JobPositionId: Yup.string().required("Job Position is required"),
  });

  return (
    <>
      <EditorTable
        columns={columns}
        isLoading={employeesLoading}
        items={employees}
        search={setSearch}
        onCreate={() => {
          setEmployee(undefined);
          openEditor();
        }}
        onDelete={async ({ id }: EmployeeJson) => {
          await destroyEmployee({
            where: { id },
          });
          refreshEmployees();
        }}
        onEdit={(employee?: EmployeeJson) => {
          setEmployee(employee);
          openEditor();
        }}
      />
      <Modal
        disableAnimation
        isOpen={editorOpen}
        onClose={() => {
          refreshEmployees();
          closeEditor();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <Formik
              initialValues={employee || defaultEmployee}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  if (employee) {
                    await updateEmployee(values as EmployeeUpdateAttributes);
                  } else {
                    await createEmployee(values as EmployeeCreationAttributes);
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
                    {employee ? "Edit Employee" : "Create Employee"}
                  </ModalHeader>
                  <ModalBody>
                    <MyField required label="Name" name="name" />
                    <ErrorMessage component="div" name="name" />
                    <MyField required label="Email" name="email" type="email" />
                    <ErrorMessage component="div" name="email" />

                    <Spacer y={1} />

                    {jobPositionsLoading ? (
                      <Spinner />
                    ) : (
                      <Select
                        disableAnimation
                        items={jobPositions}
                        label="Job Position"
                        name="JobPositionId"
                        selectedKeys={
                          values.JobPositionId ? [values.JobPositionId] : []
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
                        {(jp) => (
                          <SelectItem key={jp.id} value={jp.id}>
                            {jp.name}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                    <ErrorMessage component="div" name="JobPositionId" />
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
