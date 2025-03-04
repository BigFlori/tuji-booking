import CreateReport from "@/components/FinanceReport/CreateReport/CreateReport";
import ReportList from "@/components/FinanceReport/ReportList/ReportList";
import PageHead from "@/components/Page/PageHead";
import { withProtected } from "@/hoc/route";
import ReportContextProvider from "@/store/report-context";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  alpha, 
  useTheme,
  Divider
} from "@mui/material";
import { NextPage } from "next";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const Finances: NextPage = () => {
  const theme = useTheme();

  return (
    <ReportContextProvider>
      <PageHead page="Pénzügy" metaDescription="Tuji-booking pénzügyi felülete" />
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          minHeight: '100vh',
          py: 4
        }}
      >
        <Container maxWidth="lg" component="main">
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            <AttachMoneyIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Pénzügyi jelentések
            </Typography>
          </Paper>

          <Card 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              overflow: 'visible',
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.07)}`
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 3,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <DateRangeIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                Új jelentés létrehozása
              </Typography>
            </Box>
            <CardContent sx={{ pt: 4, pb: 5 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center'
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4, 
                    textAlign: 'center',
                    maxWidth: '600px',
                    color: alpha(theme.palette.text.primary, 0.8)
                  }}
                >
                  A dátum választók segítségével add meg mely időszakról szeretnél jelentést készíteni!
                </Typography>
                <Box 
                  sx={{ 
                    p: 4, 
                    borderRadius: 2, 
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    width: 'fit-content'
                  }}
                >
                  <CreateReport />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              borderRadius: 2,
              overflow: 'visible',
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.07)}`
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 3,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <AnalyticsIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                Korábbi jelentések
              </Typography>
            </Box>
            <CardContent>
              <ReportList />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ReportContextProvider>
  );
};

export default withProtected(Finances);