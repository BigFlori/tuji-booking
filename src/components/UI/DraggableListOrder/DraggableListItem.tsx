import { Box, Paper, Typography } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { darken } from "@mui/material";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { useRaisedShadow } from "@/hooks/useRaisedShadow";
import { grey } from "@mui/material/colors";

interface IDraggableListItemProps {
  item: { id: string; title: string };
}

const DraggableListItem: React.FC<IDraggableListItemProps> = (props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item value={props.item} style={{ boxShadow, y }} dragListener={false} dragControls={dragControls}>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 1,
          cursor: "grab",
          userSelect: "none",
          "&:hover": { backgroundColor: darken("#fff", 0.015) },
          "&:active": { cursor: "grabbing" },
        }}
        variant="outlined"
      >
        <Typography variant="body1" fontWeight={500}>{props.item.title}</Typography>
        <Box
          sx={{ backgroundColor: grey[100], borderRadius: 2, display: "flex", alignItems: "center", padding: 1 }}
          onPointerDown={(event) => dragControls.start(event)}
        >
          <DragHandleIcon />
        </Box>
      </Paper>
    </Reorder.Item>
  );
};

export default DraggableListItem;
