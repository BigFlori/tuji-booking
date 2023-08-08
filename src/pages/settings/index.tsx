import DraggableListOrder from "@/components/UI/DraggableListOrder/DraggableListOrder";
import PageHead from "@/components/UI/PageHead";
import { withProtected } from "@/hoc/route";
import Group from "@/models/group/group-model";
import { GroupContext } from "@/store/group-context";
import { cloneArray } from "@/utils/helpers";
import { Box, Container, Typography } from "@mui/material";
import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";

const Settings: NextPage = () => {
  const groupCtx = useContext(GroupContext);

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
      <Container maxWidth="lg" sx={{marginTop: 2}}>
        <Typography variant="h5">Alkalmazás beállítások</Typography>
        <Box sx={{marginInline: 1}}>
          <Typography variant="subtitle1">Csoportok sorrendje</Typography>
          <DraggableListOrder clonedItems={clonedGroups} setClonedItems={setClonedGroups} onSave={saveHandler} onDiscard={discardHandler} />
        </Box>
      </Container>
    </>
  );
};

export default withProtected(Settings);
