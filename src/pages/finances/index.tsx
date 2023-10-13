import CreateReport from "@/components/FinanceReport/CreateReport/CreateReport";
import ReportList from "@/components/FinanceReport/ReportList/ReportList";
import PageHead from "@/components/Page/PageHead";
import { withProtected } from "@/hoc/route";
import ReportContextProvider from "@/store/report-context";
import { Box, Container, Typography } from "@mui/material";
import { NextPage } from "next";

const Finances: NextPage = () => {
  return (
    <ReportContextProvider>
      <PageHead page="Pénzügy" metaDescription="Tuji-booking pénzügyi felülete" />
      <Container maxWidth="lg" sx={{ marginTop: 2 }} component="main">
        <Typography variant="h5">Pénzügyi jelentések</Typography>
        <Box component="section" sx={{ marginInline: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle1">
            A dátum választók segítségével add meg mely időszakról szeretnél jelentést készíteni!
          </Typography>
          <Box marginX="auto">
            <CreateReport />
          </Box>
          <ReportList />
        </Box>
      </Container>
    </ReportContextProvider>
  );
};

export default withProtected(Finances);
