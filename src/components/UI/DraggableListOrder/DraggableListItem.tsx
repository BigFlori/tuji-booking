import { Box, Paper, Typography } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { darken } from "@mui/material";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { useRaisedShadow } from "@/hooks/useRaisedShadow";
import { grey } from "@mui/material/colors";
import { useEffect, useRef } from "react";

interface IDraggableListItemProps {
  item: { id: string; title: string };
}

const DraggableListItem: React.FC<IDraggableListItemProps> = (props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  const iRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const touchHandler: React.TouchEventHandler<HTMLElement> = (event) => event.preventDefault();
    const element = iRef.current;

    if (element) {
      // @ts-ignore
      element.addEventListener("touchstart", touchHandler, { passive: false });
    }

    return () => {
      if (element) {
        // @ts-ignore
        element.removeEventListener("touchstart", touchHandler, { passive: false });
      }
    };
  }, [iRef]);

  return (
    <Reorder.Item
      value={props.item}
      ref={iRef}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
    >
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
          "&:hover": { backgroundColor: darken("#fff", 0.015) },
        }}
        variant="outlined"
      >
        <Typography variant="body1" paddingLeft={1}>
          {props.item.title}
        </Typography>
        <Box
          sx={{
            backgroundColor: grey[100],
            display: "flex",
            alignItems: "center",
            padding: 2,
            cursor: "move",
          }}
          onPointerDown={(event) => dragControls.start(event)}
        >
          <DragHandleIcon />
        </Box>
      </Paper>
    </Reorder.Item>
  );
};

export default DraggableListItem;
