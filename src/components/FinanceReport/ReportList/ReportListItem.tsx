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

interface IReportListItemProps {
  report: Report;
}

const ReportListItem: React.FC<IReportListItemProps> = (props: IReportListItemProps) => {
  const theme = useTheme();
  const groupCtx = useGroupContext();
  
  // Számoljuk ki, hogy a jelentés hány csoportot tartalmaz
  const selectedGroupCount = props.report.selectedGroupIds?.length || groupCtx.groups.length;
  const totalGroupCount = groupCtx.groups.length;
  
  // Formázott egyenleg a summaryból
  const formattedBalance = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.report.summary.balance);

  // Dátum formázás
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