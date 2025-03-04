import StateDot from "@/components/UI/StateDot";
import Report from "@/models/report-model";
import PaymentState from "@/models/reservation/payment-state-model";
import { useGroupContext } from "@/store/group-context";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface IReportTableProps {
  report: Report;
}

function createData(
  groupTitle: string,
  notPaid: number,
  depositPaid: number,
  fullPaid: number,
  blocked: number,
  expenses: number,
  balance: number
) {
  return { groupTitle, notPaid, depositPaid, fullPaid, blocked, expenses, balance };
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
      return createData(group.title, 0, 0, 0, 0, 0, 0);
    }
    const summaryGroup = props.report.groups[group.id];
    return createData(
      group.title,
      summaryGroup.notPaid,
      summaryGroup.depositPaid,
      summaryGroup.fullPaid,
      summaryGroup.blocked,
      summaryGroup.expenses,
      summaryGroup.balance
    );
  });

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Csoport</TableCell>
            <TableCell>
              <StateDot state={PaymentState.NOT_PAID} /> Fizetés hiánya
            </TableCell>
            <TableCell>
              <StateDot state={PaymentState.DEPOSIT_PAID} /> Foglaló fizetve
            </TableCell>
            <TableCell>
              <StateDot state={PaymentState.FULL_PAID} /> Teljesen fizetve
            </TableCell>
            <TableCell>
              <StateDot state={PaymentState.BLOCKED} /> Blokkolt
            </TableCell>
            <TableCell>Kiadás</TableCell>
            <TableCell>Egyenleg</TableCell>
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
              <TableCell>{formatCurrency(row.blocked)}</TableCell>
              <TableCell>{formatCurrency(row.expenses)}</TableCell>
              <TableCell>{formatCurrency(row.balance)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell component="th" scope="row" sx={{ fontWeight: "500" }}>
              Összesen
            </TableCell>
            <TableCell sx={{ fontWeight: "500" }}>{formatCurrency(props.report.summary.notPaid)}</TableCell>
            <TableCell sx={{ fontWeight: "500" }}>{formatCurrency(props.report.summary.depositPaid)}</TableCell>
            <TableCell sx={{ fontWeight: "500" }}>{formatCurrency(props.report.summary.fullPaid)}</TableCell>
            <TableCell sx={{ fontWeight: "500" }}>{formatCurrency(props.report.summary.blocked)}</TableCell>
            <TableCell sx={{ fontWeight: "500" }}>{formatCurrency(props.report.summary.expenses)}</TableCell>
            <TableCell sx={{ fontWeight: "500" }}>{formatCurrency(props.report.summary.balance)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTable;
