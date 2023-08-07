import { Box, Paper, Typography } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { darken } from "@mui/material";

interface IDraggableListItemProps {
  id: string;
  title: string;
  index: number;
}

const DraggableListItem: React.FC<IDraggableListItemProps> = (props) => {
  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
        cursor: "grab",
        userSelect: "none",
        "&:hover": { backgroundColor: darken("#fff", 0.015) },
        "&:active": { cursor: "grabbing" },
      }}
      variant="outlined"
    >
      <Typography variant="body1">{props.title}</Typography>
      <Box className="handle">
        <DragHandleIcon />
      </Box>
    </Paper>
  );
};

export default DraggableListItem;
