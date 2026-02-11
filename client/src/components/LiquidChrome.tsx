import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const vert = `
  attribute vec2 uv;
  attribute vec2 position;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const frag = `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform float uFrequencyX;
  uniform float uFrequencyY;

  void main() {
    vec2 uv = vUv;
    float time = uTime * uSpeed;
    
    // Create liquid distortion
    float noise = sin(uv.x * uFrequencyX + time) * cos(uv.y * uFrequencyY + time) * uAmplitude;
    float noise2 = cos(uv.x * uFrequencyY - time * 0.5) * sin(uv.y * uFrequencyX + time * 0.7) * uAmplitude * 0.5;
    
    vec3 color = uBaseColor + vec3(noise + noise2);
    
    // Add some chrome-like highlights
    float highlight = pow(max(0.0, noise + noise2 + 0.5), 3.0) * 0.2;
    color += highlight;

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface LiquidChromeProps {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
}

export function LiquidChrome({
  baseColor = [0.35, 0.48, 0.38], // Matcha #5B7C62 as float
  speed = 0.5,
  amplitude = 0.2,
  frequencyX = 2.0,
  frequencyY = 1.0,
  interactive = true,
}: LiquidChromeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, antialias: true });
    } catch (e) {
      console.error("WebGL not supported");
      return;
    }

    const gl = renderer.gl;
    if (!gl) return;

    containerRef.current.appendChild(gl.canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime: { value: 0 },
        uBaseColor: { value: new Color(...baseColor) },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animationFrame: number;

    const resize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', resize);
    resize();

    const update = (t: number) => {
      animationFrame = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };

    animationFrame = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
      if (containerRef.current && gl.canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(gl.canvas);
      }
    };
  }, [baseColor, speed, amplitude, frequencyX, frequencyY]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full -z-10 bg-[#F2F0EB]"
    />
  );
}
