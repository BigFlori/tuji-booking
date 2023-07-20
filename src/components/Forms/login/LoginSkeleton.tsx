import ElevatedFormBox from "@/components/UI/styled/ElevatedFormBox";
import { Box, Skeleton } from "@mui/material";
import { grey } from "@mui/material/colors";

const LoginSkeleton: React.FC = () => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100svh", background: grey[50] }}
    >
      <ElevatedFormBox
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Skeleton variant="text" width="100%" height={50} />
        <Skeleton variant="rounded" width="100%" height={50} />
        <Skeleton variant="rounded" width="100%" height={50} />
        <Skeleton variant="rounded" width="100%" height={50} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="rounded" width="100%" height={50} />
        <Box sx={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
            <Skeleton variant="rounded" width="45%" height={50} />
            <Skeleton variant="rounded" width="45%" height={50} />
        </Box>
      </ElevatedFormBox>
    </Box>
  );
};

export default LoginSkeleton;
