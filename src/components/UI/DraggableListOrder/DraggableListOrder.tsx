import { useMemo } from "react";
import DraggableListItem from "./DraggableListItem";
import { Box, Container } from "@mui/material";
import { Reorder, useDragControls } from "framer-motion";

interface IDraggableListOrderProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
}

const DraggableListOrder = <T extends { id: string; title: string }>(props: IDraggableListOrderProps<T>) => {
  const dragControls = useDragControls();

  const dragListItems = useMemo(() => {
    return props.items.map((item) => {
      return <DraggableListItem key={item.id} item={item} />;
    });
  }, [props.items]);

  return (
    <Container maxWidth="sm">
      <Reorder.Group axis="y" values={props.items} onReorder={props.setItems}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {dragListItems}
        </Box>
      </Reorder.Group>
    </Container>
  );
};

export default DraggableListOrder;
