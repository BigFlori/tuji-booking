import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

// Egy töltőképernyőt ábrázoló komponens, amely egy kör alakú töltő animációt jelenít meg
const LoadingScreen: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress size={100} />
    </div>
  );
};

export default LoadingScreen;
