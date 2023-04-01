import { useEffect } from "react";

type CalendarProps = {
  month: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

const CalendarTest = ({ month, canvasRef }: CalendarProps) => {
  const canvasWidth = 720; // 60px * 12 hónap
  const canvasHeight = 600;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // A korábbi kódrészlet itt jön be, ami a naptárt kirajzolja a canvas-ra
  }, [month, canvasRef, canvasWidth, canvasHeight]);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};

export default CalendarTest;
