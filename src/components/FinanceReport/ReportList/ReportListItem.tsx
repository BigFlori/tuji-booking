import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  Chip,
  useTheme,
  alpha
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Report from "@/models/report-model";
import ReportTable from "./ReportTable";
import { useGroupContext } from "@/store/group-context";
import { formatCurrency } from "@/utils/helpers";

interface IReportListItemProps {
  report: Report;
}

// Egy pénzügyi jelentés összefoglalóját és részleteit megjelenítő komponens
const ReportListItem: React.FC<IReportListItemProps> = (props: IReportListItemProps) => {
  const theme = useTheme();
  const groupCtx = useGroupContext();
  
  const selectedGroupCount = props.report.selectedGroupIds?.length || groupCtx.groups.length;
  const totalGroupCount = groupCtx.groups.length;
  
  const formattedBalance = formatCurrency(props.report.summary.balance);

  const formattedDateRange = `${props.report.period.from.format("YYYY.MM.DD")} — ${props.report.period.to.format("YYYY.MM.DD")}`;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              {formattedDateRange}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Készült: {props.report.createdAt.format("YYYY.MM.DD HH:mm")}
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
            <Chip 
              label={`${selectedGroupCount} / ${totalGroupCount} csoport`} 
              size="small" 
              variant="outlined" 
              color="primary"
            />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: "medium", 
                color: props.report.summary.balance >= 0 ? "success.main" : "error.main",
                backgroundColor: props.report.summary.balance >= 0 
                  ? alpha(theme.palette.success.main, 0.1) 
                  : alpha(theme.palette.error.main, 0.1),
                px: 1,
                py: 0.5,
                borderRadius: 1
              }}
            >
              {formattedBalance}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <ReportTable report={props.report} />
      </AccordionDetails>
    </Accordion>
  );
};

export default ReportListItem;