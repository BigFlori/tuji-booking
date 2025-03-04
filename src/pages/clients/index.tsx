import PageHead from "@/components/Page/PageHead";
import { withProtected } from "@/hoc/route";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  alpha, 
  useTheme,
  Card,
  CardContent
} from "@mui/material";
import { NextPage } from "next";
import React from "react";
import ClientDataGrid from "@/components/UI/DataGrid/ClientDataGrid";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ClientPage: NextPage = () => {
  const theme = useTheme();

  return (
    <>
      <PageHead page="Ügyfeleid" metaDescription="Ügyfeleid megtekintése és kezelése." />
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          minHeight: '100vh',
          py: 4
        }}
      >
        <Container maxWidth="xl" component="main">
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
            <PeopleAltIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Ügyfeleid
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
                alignItems: 'flex-start',
                p: 3,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <InfoOutlinedIcon 
                sx={{ 
                  color: theme.palette.primary.main, 
                  mr: 2,
                  mt: 0.5
                }} 
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Ügyfelek kezelése
                </Typography>
                <Typography variant="body1" sx={{ color: alpha(theme.palette.text.primary, 0.8) }}>
                  Az alábbi táblázat az ügyfeleid kezelésére és megtekintésére szolgál.
                </Typography>
              </Box>
            </Box>
            <CardContent 
              sx={{ 
                p: 0,
                "&:last-child": {
                  pb: 0
                }
              }}
            >
              <Box sx={{ p: 3 }}>
                <ClientDataGrid />
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default withProtected(ClientPage);