import { Box } from "@mui/material";
import { useRef, useEffect } from "react";

const TestPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 720 * 3; // 60px * 12 hónap * 3 sor
  const canvasHeight = 200; // 4 sor

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "red";
    ctx.fillRect(20, 20, 75, 50);
    //Turn transparency on
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "blue";
    ctx.fillRect(50, 50, 75, 50);
    ctx.fillStyle = "green";
    ctx.fillRect(80, 80, 75, 50);
  }, [canvasRef, canvasWidth, canvasHeight]);

  return (
    <Box sx={{ overflowX: "auto" }}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </Box>
  );
};

export default TestPage;
