import { useMemo, useState } from "react";
import DraggableListItem from "./DraggableListItem";
import { Box, Button, Container } from "@mui/material";
import { Reorder } from "framer-motion";
import SaveIcon from "@mui/icons-material/Save";
import { useSnack } from "@/hooks/useSnack";

interface IDraggableListOrderProps<T> {
  clonedItems: T[];
  setClonedItems: (items: T[]) => void;
  onSave: () => void;
  onDiscard: () => void;
}

// Újrafelhasználható komponens, amely lehetővé teszi a lista elemeinek átrendezését
// A lista elemei draggable elemek, amelyeket a felhasználó áthúzhat
const DraggableListOrder = <T extends { id: string; title: string }>(props: IDraggableListOrderProps<T>) => {
  const showSnackbar = useSnack();
  const [orderChanged, setOrderChanged] = useState(false);

  const reorderHandler = (items: T[]) => {
    props.setClonedItems(items);
    setOrderChanged(true);
  };

  const saveHandler = () => {
    props.onSave();
    showSnackbar("Sorrend mentve!", "success");
    setOrderChanged(false);
  };

  const discardHandler = () => {
    props.onDiscard();
    setOrderChanged(false);
  };

  const dragListItems = useMemo(() => {
    return props.clonedItems.map((item) => {
      return <DraggableListItem key={item.id} item={item} />;
    });
  }, [props.clonedItems]);

  return (
    <Container maxWidth="sm">
      <Reorder.Group axis="y" values={props.clonedItems} onReorder={reorderHandler}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>{dragListItems}</Box>
      </Reorder.Group>
      <Box sx={{ display: "flex", gap: 3, marginTop: 3 }}>
        <Button variant="outlined" disabled={!orderChanged} onClick={discardHandler} fullWidth color="error">
          Elvetés
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!orderChanged}
          onClick={saveHandler}
          fullWidth
          color="success"
        >
          Mentés
        </Button>
      </Box>
    </Container>
  );
};

export default DraggableListOrder;
