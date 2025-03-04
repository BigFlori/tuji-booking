import DraggableListOrder from "@/components/UI/DraggableListOrder/DraggableListOrder";
import PageHead from "@/components/Page/PageHead";
import { withProtected } from "@/hoc/route";
import Group from "@/models/group/group-model";
import { useGroupContext } from "@/store/group-context";
import { cloneArray } from "@/utils/helpers";
import { Box, Container, Switch, Typography } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useDevContext } from "@/store/dev-context";

const Settings: NextPage = () => {
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
      <Container maxWidth="md" sx={{ marginTop: 2 }} component="main">
        <Typography variant="h3">Alkalmazás beállítások</Typography>
        <Box sx={{ marginInline: 1, marginBlock: 2 }} component="section">
          <Typography variant="h5" sx={{ marginBlock: 2 }}>
            Csoportok sorrendje
          </Typography>
          <DraggableListOrder
            clonedItems={clonedGroups}
            setClonedItems={setClonedGroups}
            onSave={saveHandler}
            onDiscard={discardHandler}
          />
        </Box>
        <Box sx={{ marginInline: 1, marginBlock: 2 }} component="section">
          <Typography variant="h5">Fejlesztői mód</Typography>
          <Typography variant="body1" sx={{ marginBlock: 2 }}>
            A fejlesztői mód bekapcsolásával a rendszer több információt jelenít meg a hibákról, és a hibakeresés
            egyszerűbbé válik.
          </Typography>
          <Switch
            checked={devCtx.devMode}
            onChange={() => devCtx.setDevMode(!devCtx.devMode)}
            inputProps={{ "aria-label": "controlled" }}
            id="dev-mode-switch"
          />
          <label htmlFor="dev-mode-switch">Fejlesztői mód</label>
        </Box>
      </Container>
    </>
  );
};

export default withProtected(Settings);
