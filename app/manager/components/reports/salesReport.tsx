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

import { salesReport, SalesReportJson } from "@/server/reports";

export const SalesReport: React.FC<CardProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [salesReportData, setSalesReportData] = useState<SalesReportJson[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async (
    timeRange: "daily" | "weekly" | "monthly",
  ) => {
    setLoading(true);
    setError(null); // Reset error on new report generation
    try {
      const data = await salesReport(timeRange);

      if (data.length === 0) {
        setError("No sales data available for the selected time period.");
      }
      setSalesReportData(data);
    } catch (err) {
      setError("Error fetching the sales data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader className="flex gap-3 justify-between">
        <h1 className="text-2xl font-bold">Sales Report</h1>
        <div className="flex gap-2">
          <Button
            isLoading={loading}
            onClick={() => handleGenerateReport("daily")}
          >
            Daily
          </Button>
          <Button
            isLoading={loading}
            onClick={() => handleGenerateReport("weekly")}
          >
            Weekly
          </Button>
          <Button
            isLoading={loading}
            onClick={() => handleGenerateReport("monthly")}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Table aria-label="Sales Report">
            <TableHeader>
              <TableColumn>Menu Item</TableColumn>
              <TableColumn>Total Sold</TableColumn>
              <TableColumn>Total Revenue</TableColumn>
            </TableHeader>
            <TableBody>
              {salesReportData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.totalSold}</TableCell>
                  <TableCell>${item.totalRevenue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};
