import { Box, Typography } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import YearSelectorButton from "@/components/UI/styled/YearSelectorButton";

interface IYearSelectorProps {
  year: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
}

/**
 * Év kiválasztó komponens
 * 
 * Lehetővé teszi a felhasználó számára, hogy navigáljon az évek között
 * a naptár nézeten belül. Bal és jobb nyilakkal lehet léptetni az évet,
 * és középen megjeleníti az aktuális évet.
 */
const YearSelector: React.FC<IYearSelectorProps> = (props: IYearSelectorProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <YearSelectorButton onClick={props.onPreviousYear}>
        <ArrowBackIosNew sx={{ fontSize: "inherit" }} />
      </YearSelectorButton>
      
      <Typography fontSize={18}>{props.year}</Typography>
      
      <YearSelectorButton onClick={props.onNextYear}>
        <ArrowForwardIos sx={{ fontSize: "inherit" }} />
      </YearSelectorButton>
    </Box>
  );
};

export default YearSelector;
