import Report from "@/models/report-model";
import { useGroupContext } from "@/store/group-context";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface IReportTableProps {
  report: Report;
}

function createData(groupTitle: string, notPaid: number, depositPaid: number, fullPaid: number) {
  return { groupTitle, notPaid, depositPaid, fullPaid };
}

const formatCurrency = (value: number) => {
  return value.toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const ReportTable: React.FC<IReportTableProps> = (props: IReportTableProps) => {
  const groupCtx = useGroupContext();
  const rows = groupCtx.groups.map((group) => {
    if (!props.report.groups[group.id]) {
      return createData(group.title, 0, 0, 0);
    }
    const summaryGroup = props.report.groups[group.id];
    return createData(group.title, summaryGroup.notPaid, summaryGroup.depositPaid, summaryGroup.fullPaid);
  });

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Csoport</TableCell>
            <TableCell>Fizetés hiánya</TableCell>
            <TableCell>Foglaló fizetve</TableCell>
            <TableCell>Teljesen fizetve</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.groupTitle}>
              <TableCell component="th" scope="row">
                {row.groupTitle}
              </TableCell>
              <TableCell>{formatCurrency(row.notPaid)}</TableCell>
              <TableCell>{formatCurrency(row.depositPaid)}</TableCell>
              <TableCell>{formatCurrency(row.fullPaid)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell component="th" scope="row" sx={{ fontWeight: "500" }}>
              Összesen
            </TableCell>
            <TableCell sx={{ fontWeight: "500" }}>{formatCurrency(props.report.summary.notPaid)}</TableCell>
            <TableCell sx={{ fontWeight: "500" }}>{formatCurrency(props.report.summary.depositPaid)}</TableCell>
            <TableCell sx={{ fontWeight: "500" }}>{formatCurrency(props.report.summary.fullPaid)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTable;
