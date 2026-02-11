import { useEffect, useRef } from "react";

/**
 * LiquidChrome Component
 * Adapted from React Bits (https://reactbits.dev/backgrounds/liquid-chrome)
 */
export function LiquidChrome() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // We'll create a "liquid" effect using overlapping gradients and sine waves
      // Matcha: #5B7C62, Stone: #F2F0EB
      
      const width = canvas.width;
      const height = canvas.height;

      // Base layer
      ctx.fillStyle = "#F2F0EB";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.6;

      // Liquid layer 1 (Matcha)
      const grad1 = ctx.createRadialGradient(
        width * (0.5 + Math.sin(time * 0.5) * 0.2),
        height * (0.5 + Math.cos(time * 0.3) * 0.2),
        0,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );
      grad1.addColorStop(0, "#5B7C62");
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Liquid layer 2 (Darker Matcha)
      const grad2 = ctx.createRadialGradient(
        width * (0.3 + Math.cos(time * 0.4) * 0.3),
        height * (0.7 + Math.sin(time * 0.2) * 0.3),
        0,
        width * 0.3,
        height * 0.7,
        width * 0.6
      );
      grad2.addColorStop(0, "#4A6651");
      grad2.addColorStop(1, "transparent");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
      style={{ filter: "blur(40px) contrast(120%)" }}
    />
  );
}
