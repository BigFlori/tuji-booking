import DraggableListOrder from "@/components/UI/DraggableListOrder/DraggableListOrder";
import PageHead from "@/components/UI/PageHead";
import { withProtected } from "@/hoc/route";
import { GroupContext } from "@/store/group-context";
import { Box, Container, Typography } from "@mui/material";
import { NextPage } from "next";
import { useContext } from "react";

const Settings: NextPage = () => {
  const groupCtx = useContext(GroupContext);
  const handleGroupOrderChange = (items: typeof groupCtx.groups) => {
    groupCtx.setGroups(items);
  };
  return (
    <>
      <PageHead page="Beállítások" metaDescription="Tuji-booking foglalási felületének beállításai" />
      <Container maxWidth="lg">
        <Typography variant="h5">Alkalmazás beállítások</Typography>
        <Box sx={{marginInline: 1}}>
          <Typography variant="subtitle1">Csoportok sorrendje</Typography>
          <Typography variant="body1">
            Itt betudod állítani, hogy a csoportok milyen sorrendben jelenjenek meg. Használathoz tartsd lenyomva a
            jobboldalon lévő csúszkákat.
          </Typography>
          <DraggableListOrder items={groupCtx.groups} onChange={handleGroupOrderChange} />
        </Box>
      </Container>
    </>
  );
};

export default withProtected(Settings);
