import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useState } from "react";

import { useAsyncMemo } from "@/components/react-hooks";
import { xReport, XReportItem } from "@/server/reports";

/**
 * XReport component displays a report in a card format with a refresh button.
 *
 * @param {CardProps & { deps?: any[] }} props - The properties passed to the component.
 * @param {any[]} [props.deps=[]] - Optional dependencies array to trigger refresh.
 *
 * @returns {JSX.Element} The rendered XReport component.
 *
 * @example
 * <XReport deps={[dependency1, dependency2]} />
 *
 * @component
 * @example
 * ```tsx
 * <XReport deps={[dependency1, dependency2]} />
 * ```
 */
export const XReport: React.FC<CardProps & { deps?: any[] }> = ({
  deps = [],
  ...props
}) => {
  const [refresh, setRefresh] = useState(false);
  const { value, loading } = useAsyncMemo<XReportItem[]>(
    () => xReport(),
    [],
    [...deps, refresh],
  );

  return (
    <Card {...props}>
      <CardHeader className="flex gap-3 justify-between">
        <h1 className="text-2xl font-bold">X Report</h1>
        <Button isLoading={loading} onPress={() => setRefresh((r) => !r)}>
          Refresh
        </Button>
      </CardHeader>
      <CardBody>
        <Table>
          <TableHeader>
            <TableColumn>Hour</TableColumn>
            <TableColumn>Order Count</TableColumn>
            <TableColumn>Sales Total</TableColumn>
          </TableHeader>
          <TableBody>
            {value.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.hour.toLocaleTimeString()}</TableCell>
                <TableCell>{item.orderCount}</TableCell>
                <TableCell>${item.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};
