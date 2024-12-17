import {
  faMagnifyingGlass,
  faEdit,
  faPlus,
  faTrash,
  faChevronDown,
  faFilter,
  faCheck,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
  useDisclosure,
  Input,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  TableRowProps,
  TableProps,
  SortDescriptor,
} from "@nextui-org/react";
import React, { Key, ReactNode, useEffect } from "react";

import { ConfirmationDialog } from "./ConfirmationDialog";

export interface ColumnInfo<T, K = any> {
  header: React.ReactNode;
  content?: keyof T;

  filter?: (value?: K) => void;
  includedKeys?: K[];
  excludedKeys?: K[];
  possibleKeys?: K[];

  sort?: (order: "ASC" | "DESC") => void;
  toKey?: (item: T) => K;
  render?: (v: K) => ReactNode;
}

export interface EditorTableProps<T> extends Omit<TableProps, "children"> {
  items: T[];
  columns: ColumnInfo<T, any>[];

  isLoading?: boolean;
  numItems?: number;

  clearSort?: () => void;

  onCreate?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => Promise<void>;

  sliceItems?: (start: number, end: number) => T[];
  search?: (value: string) => void;

  getRowProps?: (item: T) => Omit<TableRowProps, "children">;
}

/**
 * A generic table component for editing items with various functionalities such as sorting, pagination, searching, and CRUD operations.
 *
 * @template T - The type of the items to be displayed in the table.
 *
 * @param {EditorTableProps<T>} props - The properties for the EditorTable component.
 * @param {T[]} props.items - The items to be displayed in the table.
 * @param {ColumnInfo<T, any>[]} props.columns - The columns configuration for the table.
 * @param {boolean} props.isLoading - Indicates if the table is in a loading state.
 * @param {number} [props.numItems] - The total number of items, used for pagination.
 * @param {() => void} [props.clearSort] - Function to clear the sorting.
 * @param {() => void} [props.onCreate] - Function to handle the creation of a new item.
 * @param {(item: T) => void} [props.onEdit] - Function to handle the editing of an item.
 * @param {(item: T) => void} [props.onDelete] - Function to handle the deletion of an item.
 * @param {(start: number, end: number) => T[]} [props.sliceItems] - Function to slice the items for pagination.
 * @param {(value: string) => void} [props.search] - Function to handle the search functionality.
 * @param {(item: T) => React.HTMLAttributes<HTMLTableRowElement>} [props.getRowProps] - Function to get additional properties for each row.
 * @param {object} [props.props] - Additional properties to be passed to the Table component.
 *
 * @returns {JSX.Element} The rendered EditorTable component.
 */
export function EditorTable<T>({
  items,
  columns,
  isLoading,
  numItems,
  clearSort,
  onCreate,
  onEdit,
  onDelete,
  sliceItems,
  search,
  getRowProps,
  ...props
}: EditorTableProps<T>): JSX.Element {
  const [displayedItems, setDisplayedItems] = React.useState<T[]>(items);
  const [selectedItem, setSelectedItem] = React.useState<T | undefined>(
    undefined,
  );

  const {
    isOpen: confOpen,
    onOpen: openConf,
    onClose: closeConf,
  } = useDisclosure();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "",
    direction: "ascending",
  });

  const pages = Math.ceil((numItems || items.length) / rowsPerPage);

  columns = [
    ...columns,
    ...(onEdit || onDelete
      ? [
          {
            header: "Actions",
            render: (item: T) => (
              <div className="flex justify-center items-center gap-1">
                {onEdit && (
                  <Button isIconOnly size="sm" onPress={() => onEdit(item)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    onPress={() => {
                      setSelectedItem(item);
                      openConf();
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                )}
              </div>
            ),
          } as ColumnInfo<T, any>,
        ]
      : []),
  ].map(({ content, render, toKey, ...column }) => ({
    ...column,
    render: render || ((v) => v as ReactNode),
    toKey:
      toKey || (content ? (item) => item[content! as keyof T] : (item) => item),
  }));

  useEffect(() => {
    const [start, end] = [(page - 1) * rowsPerPage, page * rowsPerPage];

    setDisplayedItems(sliceItems?.(start, end) || items.slice(start, end));
  }, [items, page, rowsPerPage]);

  useEffect(() => {
    if (sortDescriptor.column) {
      columns[Number(sortDescriptor.column)].sort?.(
        sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
      );
    } else {
      clearSort?.();
    }
  }, [sortDescriptor]);

  const onRowsPerPageChange = React.useCallback((value: Key) => {
    if (value) {
      const currentIdx = (page - 1) * rowsPerPage;
      const newRowsPerPage = parseInt(value as string);

      setRowsPerPage(newRowsPerPage);
      setPage(Math.floor(currentIdx / newRowsPerPage) + 1);
    }
  }, []);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      search?.(value);
      setPage(1);
    } else {
      search?.("");
    }
  }, []);

  const onSearchClear = React.useCallback(() => {
    search?.("");
    setPage(1);
  }, []);

  const filterDropdown = (column: ColumnInfo<T, any>) => {
    if (!column.filter || !column.possibleKeys) {
      return undefined;
    }

    return (
      <Dropdown disableAnimation>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <FontAwesomeIcon icon={faFilter} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          bottomContent={
            <Button
              color="danger"
              size="sm"
              variant="light"
              onPress={() => column.filter!()}
            >
              Clear filters
            </Button>
          }
        >
          {column.possibleKeys!.map((value, i) => {
            let [isIncluded, isExcluded]: (boolean | undefined)[] = [
              false,
              false,
            ];

            if (Array.isArray(value)) {
              isIncluded = column.includedKeys?.some(([v]) => v === value[0]);
              isExcluded = column.excludedKeys?.some(([v]) => v === value[0]);
            } else {
              isIncluded = column.includedKeys?.includes(value);
              isExcluded = column.excludedKeys?.includes(value);
            }

            return (
              <DropdownItem
                key={i}
                endContent={
                  isIncluded ? (
                    <FontAwesomeIcon icon={faCheck} size="sm" />
                  ) : isExcluded ? (
                    <FontAwesomeIcon icon={faX} size="sm" />
                  ) : undefined
                }
                onPress={() => column.filter!(value)}
              >
                {column.render!(value)}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    );
  };

  const topContent = React.useMemo(
    () => (
      <div className="flex flex-row-reverse justify-between gap-3 items-end">
        <div className="flex gap-3">
          {isLoading ? <Spinner size="sm" /> : undefined}
          <Button color="success" onPress={onCreate}>
            <FontAwesomeIcon icon={faPlus} />
            Create
          </Button>
        </div>
        {search && (
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search..."
            startContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            onClear={onSearchClear}
            onValueChange={onSearchChange}
          />
        )}
      </div>
    ),
    [
      numItems,
      items,
      onCreate,
      onSearchChange,
      onSearchClear,
      onRowsPerPageChange,
      rowsPerPage,
    ],
  );

  const bottomContent = React.useMemo(
    () =>
      sliceItems || (numItems || items.length) > 10 ? (
        <div className="py-2 px-2 flex justify-between items-start">
          <span />
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            total={pages}
            onChange={setPage}
          />

          <div className="flex gap-2 items-center">
            <span>Rows per page:</span>
            <Dropdown disableAnimation>
              <DropdownTrigger>
                <Button
                  endContent={
                    <FontAwesomeIcon icon={faChevronDown} size="xs" />
                  }
                  size="sm"
                  variant="light"
                >
                  {rowsPerPage}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={[`${rowsPerPage}`]}
                selectionMode="single"
              >
                {[10, 20, 50].map((value) => (
                  <DropdownItem
                    key={value}
                    onPress={() => onRowsPerPageChange(value)}
                  >
                    {value}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      ) : undefined,
    [numItems, items, page, pages],
  );

  return (
    <>
      <Table
        {...props}
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        disabledKeys={
          isLoading ? displayedItems.map((_, i) => i) : props.disabledKeys
        }
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns.map((column, i) => ({ column, i }))}>
          {({ column, i }) => (
            <TableColumn
              key={i}
              align={column.header === "Actions" ? "center" : "start"}
              allowsSorting={column.sort !== undefined}
            >
              {column.header} {filterDropdown(column)}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={isLoading ? <Spinner /> : "No rows to display."}
          items={displayedItems.map((item, i) => ({
            item,
            i,
          }))}
        >
          {({ item, i }) => (
            <TableRow {...getRowProps?.(item)} key={i}>
              {columns.map(({ render, toKey }, j) => {
                return <TableCell key={j}>{render!(toKey!(item))}</TableCell>;
              })}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ConfirmationDialog
        header="Delete Item"
        isOpen={confOpen}
        onClose={closeConf}
        onConfirm={async () => {
          await onDelete!(selectedItem as T);
          closeConf();
        }}
      />
    </>
  );
}
