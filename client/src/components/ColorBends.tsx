import { useEffect, useRef } from "react";

/**
 * A custom implementation of a flowing, organic background
 * mimicking the "ColorBends" aesthetic using HTML5 Canvas.
 */
export function ColorBends() {
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
      time += 0.002;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient 1: Matcha flowing
      const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient1.addColorStop(0, "#F2F0EB"); // Stone
      gradient1.addColorStop(0.5, "#E8E6E1");
      gradient1.addColorStop(1, "#F2F0EB");
      
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Organic shapes
      ctx.globalAlpha = 0.4;
      
      // Shape 1 - Matcha
      ctx.beginPath();
      ctx.fillStyle = "#5B7C62";
      ctx.moveTo(0, canvas.height * 0.8);
      for (let i = 0; i <= canvas.width; i += 50) {
        ctx.lineTo(
          i,
          canvas.height * 0.8 + Math.sin(i * 0.003 + time) * 100 + Math.cos(i * 0.005 + time * 1.5) * 50
        );
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();

      // Shape 2 - Light Clay Accent
      ctx.beginPath();
      ctx.fillStyle = "#D17D59"; 
      ctx.globalAlpha = 0.15;
      ctx.moveTo(0, canvas.height * 0.9);
      for (let i = 0; i <= canvas.width; i += 60) {
        ctx.lineTo(
          i,
          canvas.height * 0.85 + Math.sin(i * 0.004 + time * 1.2) * 80
        );
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();
      
      // Reset alpha
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
      style={{ filter: "blur(60px)" }}
    />
  );
}
