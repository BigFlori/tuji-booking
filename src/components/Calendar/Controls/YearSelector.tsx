import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

interface IYearSelectorProps {
  year: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
}

const YearSelector: React.FC<IYearSelectorProps> = (props: IYearSelectorProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton onClick={props.onPreviousYear}>
        <ArrowBackIosNew />
      </IconButton>
      <Typography variant="h5">{props.year}</Typography>
      <IconButton onClick={props.onNextYear}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default YearSelector;
