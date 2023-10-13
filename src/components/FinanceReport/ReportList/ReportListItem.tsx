import { Accordion, AccordionDetails, AccordionSummary, Box, ListItem, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Report from "@/models/report-model";
import { useState } from "react";
import { useReportContext } from "@/store/report-context";
import { useGroupContext } from "@/store/group-context";
import ReportTable from "./ReportTable";

interface IReportListItemProps {
  report: Report;
}

const ReportListItem: React.FC<IReportListItemProps> = (props: IReportListItemProps) => {
  const reportCtx = useReportContext();
  const groupCtx = useGroupContext();

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1">{props.report.title}</Typography>
          <Typography variant="subtitle2">
            {props.report.period.from.format("YYYY.MM.DD")} — {props.report.period.to.format("YYYY.MM.DD")}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <ReportTable report={props.report} />
      </AccordionDetails>
    </Accordion>
  );
};

export default ReportListItem;
