import StateDot from "@/components/UI/StateDot";
import Report from "@/models/report-model";
import PaymentState from "@/models/reservation/payment-state-model";
import { useGroupContext } from "@/store/group-context";
import { formatCurrency } from "@/utils/helpers";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Box,
  Chip
} from "@mui/material";

interface IReportTableProps {
  report: Report;
}

function createData(
  groupId: string,
  groupTitle: string,
  notPaid: number,
  depositPaid: number,
  fullPaid: number,
  blocked: number,
  expenses: number,
  balance: number
) {
  return { groupId, groupTitle, notPaid, depositPaid, fullPaid, blocked, expenses, balance };
}

const ReportTable: React.FC<IReportTableProps> = (props: IReportTableProps) => {
  const groupCtx = useGroupContext();
  
  // Csak azokat a csoportokat jelenítjük meg, amelyek ki voltak választva
  // vagy ha nincs selectedGroupIds, akkor minden csoportot
  const groupsToDisplay = groupCtx.groups.filter(group => 
    !props.report.selectedGroupIds || props.report.selectedGroupIds.includes(group.id)
  );
  
  const rows = groupsToDisplay.map((group) => {
    if (!props.report.groups[group.id]) {
      return createData(group.id, group.title, 0, 0, 0, 0, 0, 0);
    }
    const summaryGroup = props.report.groups[group.id];
    return createData(
      group.id,
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
    <>
      {props.report.selectedGroupIds && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Kiválasztott csoportok ({props.report.selectedGroupIds.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {groupsToDisplay.map(group => (
              <Chip 
                key={group.id} 
                label={group.title} 
                size="small" 
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
      
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
              <TableRow key={row.groupId}>
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
    </>
  );
};

export default ReportTable;