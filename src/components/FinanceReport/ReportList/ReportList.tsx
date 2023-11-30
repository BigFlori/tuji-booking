import { useReportContext } from "@/store/report-context";
import { Box, Typography } from "@mui/material";
import ReportListItem from "./ReportListItem";

const ReportList: React.FC = () => {
  const reportCtx = useReportContext();

  return (
    <Box>
      <Typography variant="h6">Jelentések ({reportCtx.reports.length}):</Typography>
      {reportCtx.reports.length === 0 && (
        <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          Hozz létre pénzügyi jelentést!<br/>A jelentések csak ideiglenesen tárolódnak és nem kerülnek mentésre.
        </Typography>
      )}
      {reportCtx.reports.map((report) => (
        <ReportListItem key={report.id} report={report} />
      ))}
    </Box>
  );
};

export default ReportList;
