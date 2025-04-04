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
  CardContent,
  Grid
} from "@mui/material";
import { NextPage } from "next";
import PersonIcon from '@mui/icons-material/Person';
import UserProfileForm from "@/components/Forms/user-profile/UserProfileForm";
import UserPasswordForm from "@/components/Forms/user-profile/UserPasswordForm";
import UserAvatarUpload from "@/components/Forms/user-profile/UserAvatarUpload";

const ProfilePage: NextPage = () => {
  const theme = useTheme();

  return (
    <>
      <PageHead page="Profil" metaDescription="Felhasználói profil beállítások és információk" />
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
            <PersonIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Profil beállítások
            </Typography>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  overflow: 'visible',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.07)}`
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <UserAvatarUpload />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Card 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  overflow: 'visible',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.07)}`
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <UserProfileForm />
                </CardContent>
              </Card>

              <Card 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'visible',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.07)}`
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <UserPasswordForm />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default withProtected(ProfilePage);