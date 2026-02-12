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
    
    // Liquid distortion
    float noise = sin(uv.x * uFrequencyX + time) * cos(uv.y * uFrequencyY + time) * uAmplitude;
    float noise2 = cos(uv.x * uFrequencyY - time * 0.5) * sin(uv.y * uFrequencyX + time * 0.7) * uAmplitude * 0.5;
    
    // High contrast liquid metal look
    float wave = noise + noise2;
    float chrome = pow(abs(sin(wave * 5.0 + time)), 3.0);
    
    vec3 color = mix(uBaseColor, vec3(0.95, 0.95, 0.95), chrome * 0.6);
    color += pow(max(0.0, wave + 0.5), 5.0) * 0.4; // Highlights

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
  baseColor = [0.18, 0.24, 0.19], // Darker Matcha
  speed = 0.4,
  amplitude = 0.3,
  frequencyX = 1.8,
  frequencyY = 0.8,
  interactive = true,
}: LiquidChromeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, antialias: true });
    } catch (e) {
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
      renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
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
      className="absolute inset-0 w-full h-full -z-10 bg-[#2D2D2D]"
    />
  );
}
