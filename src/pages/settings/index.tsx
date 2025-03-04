import DraggableListOrder from "@/components/UI/DraggableListOrder/DraggableListOrder";
import PageHead from "@/components/Page/PageHead";
import { withProtected } from "@/hoc/route";
import Group from "@/models/group/group-model";
import { useGroupContext } from "@/store/group-context";
import { cloneArray } from "@/utils/helpers";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useDevContext } from "@/store/dev-context";
import { 
  Box, 
  Container, 
  Switch, 
  Typography, 
  Divider, 
  Paper, 
  Card,
  CardContent,
  alpha,
  useTheme
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import ReorderIcon from '@mui/icons-material/Reorder';
import CodeIcon from '@mui/icons-material/Code';

const Settings: NextPage = () => {
  const theme = useTheme();
  const devCtx = useDevContext();
  const groupCtx = useGroupContext();

  const [clonedGroups, setClonedGroups] = useState<Group[]>(cloneArray(groupCtx.groups));

  useEffect(() => {
    setClonedGroups(cloneArray(groupCtx.groups));
  }, [groupCtx.groups]);

  const saveHandler = () => {
    groupCtx.setGroupsWithSave(clonedGroups);
  };

  const discardHandler = () => {
    setClonedGroups(cloneArray(groupCtx.groups));
  };

  return (
    <>
      <PageHead page="Beállítások" metaDescription="Tuji-booking foglalási felületének beállításai" />
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          minHeight: '100vh',
          py: 4
        }}
      >
        <Container maxWidth="md" component="main">
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
            <SettingsIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Alkalmazás beállítások
            </Typography>
          </Paper>
          
          <Card 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              overflow: 'visible',
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.07)}`
            }} 
            component="section"
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 3,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <ReorderIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                Csoportok sorrendje
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <DraggableListOrder
                clonedItems={clonedGroups}
                setClonedItems={setClonedGroups}
                onSave={saveHandler}
                onDiscard={discardHandler}
              />
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.07)}`
            }} 
            component="section"
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 3,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <CodeIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                Fejlesztői mód
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                A fejlesztői mód bekapcsolásával a rendszer több információt jelenít meg a hibákról, és a hibakeresés egyszerűbbé válik.
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 1.5,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                {/* <Switch
                  checked={devCtx.devMode}
                  onChange={() => devCtx.setDevMode(!devCtx.devMode)}
                  inputProps={{ "aria-label": "controlled" }}
                  id="dev-mode-switch"
                  color="primary"
                /> */}
                <Switch
                  inputProps={{ "aria-label": "controlled" }}
                  id="dev-mode-switch"
                  color="primary"
                />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  Fejlesztői mód
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default withProtected(Settings);