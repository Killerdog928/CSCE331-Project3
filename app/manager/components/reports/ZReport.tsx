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

import { zReport, ZReportJson } from "@/server/reports";

/**
 * A React functional component that renders a Z Report card.
 * The component displays a button to generate the Z Report and a table to show the report data.
 *
 * @param {CardProps & { onGenerate?: () => void }} props - The props for the component.
 * @param {() => void} [props.onGenerate] - Optional callback function to be called when the report is generated.
 *
 * @returns {JSX.Element} The rendered Z Report card component.
 */
export const ZReport: React.FC<CardProps & { onGenerate?: () => void }> = ({
  onGenerate = () => {},
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [zReportData, setData] = useState<ZReportJson[]>([]);

  return (
    <Card {...props}>
      <CardHeader className="flex gap-3 justify-between">
        <h1 className="text-2xl font-bold">Z Report</h1>
        <Button
          isLoading={loading}
          onClick={async () => {
            setLoading(true);
            try {
              setData([await zReport()]);
              onGenerate();
            } finally {
              setLoading(false);
            }
          }}
        >
          Generate
        </Button>
      </CardHeader>
      <CardBody>
        <Table>
          <TableHeader>
            <TableColumn>Order Count</TableColumn>
            <TableColumn>Sales Total</TableColumn>
          </TableHeader>
          <TableBody>
            {zReportData.map((item, i) => (
              <TableRow key={i}>
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
