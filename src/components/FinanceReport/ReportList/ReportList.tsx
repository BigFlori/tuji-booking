import SpacerLine from "@/components/UI/SpacerLine";
import { useReportContext } from "@/store/report-context";
import { Box, List, Paper, Typography, darken } from "@mui/material";
import { Fragment } from "react";
import ReportListItem from "./ReportListItem";

const ReportList: React.FC = () => {
  const reportCtx = useReportContext();

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Jelentések ({reportCtx.reports.length})</Typography>
      {reportCtx.reports.map((report, index) => (
        <Fragment key={report.id}>
          <ReportListItem report={report} />
          {index !== reportCtx.reports.length - 1 && <SpacerLine color={darken("#fff", 0.1)} />}
        </Fragment>
      ))}
    </Box>
  );
};

export default ReportList;
