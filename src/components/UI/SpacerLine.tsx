import { Box, Divider, SxProps } from "@mui/material";
import { grey } from "@mui/material/colors";

interface ISpacerLineProps {
  children?: React.ReactNode;
  color?: string;
  sx?: SxProps;
}

// Egy elválasztó vonalat ábrázoló komponens, amely a szülő elem szélességét használja
// és a gyerek elemeket középre helyezi. A vonal színe testreszabható.
const SpacerLine: React.FC<ISpacerLineProps> = ({ children, color, sx }) => {
  const styles: SxProps = {
    flexGrow: 1,
    borderColor: color || grey[200],
    ...sx,
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2 }}>
      {children ? (
        <>
          <Divider sx={styles} />
          {children}
          <Divider sx={styles} />
        </>
      ) : (
        <Divider sx={styles} />
      )}
    </Box>
  );
};

export default SpacerLine;
