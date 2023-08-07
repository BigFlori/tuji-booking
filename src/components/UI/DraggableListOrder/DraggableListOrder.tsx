import { useMemo } from "react";
import DraggableListItem from "./DraggableListItem";
import { Box, Container } from "@mui/material";

interface IDraggableListOrderProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
}

const DraggableListOrder = <T extends { id: string; title: string }>(props: IDraggableListOrderProps<T>) => {
  const dragListItems = useMemo(() => {
    return props.items.map((item, index) => {
      return <DraggableListItem key={item.id} id={item.id} title={item.title} index={index} />;
    });
  }, [props.items]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>{dragListItems}</Box>
    </Container>
  );
};

export default DraggableListOrder;
