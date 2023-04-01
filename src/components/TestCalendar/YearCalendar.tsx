import { useRef, useEffect } from "react";
import CalendarTest from "./CalendarTest";

const YearCalendar = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 720 * 3; // 60px * 12 hónap * 3 sor
  const canvasHeight = 600 * 4; // 4 sor

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    let xOffset = 0;
    let yOffset = 0;
    for (let month = 0; month < 12; month++) {
      if (month % 3 === 0 && month !== 0) {
        xOffset = 0;
        yOffset += 600;
      }

      const x = xOffset * 60;
      const y = yOffset;
      ctx.translate(x, y);
      //CalendarTest({ month, canvasRef });
      ctx.translate(-x, -y);

      xOffset++;
    }
  }, [canvasRef, canvasWidth, canvasHeight]);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};

export default YearCalendar;
