"use client";

import * as React from "react";
import { useMotionPreference } from "@/ui";
import { cn } from "@/ui/skins";

export interface ShaderBackgroundProps {
  speed?: number;
  strength?: number;
  className?: string;
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uResolution;
uniform float uTime;
uniform float uStrength;
uniform vec3 uBase;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uColorD;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * snoise(p);
    p = p * 2.02 + vec2(11.3, 7.9);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv;
  p.x *= uResolution.x / uResolution.y;
  p *= 1.6;
  float t = uTime;
  vec2 q = vec2(fbm(p + 0.10 * t), fbm(p + vec2(5.2, 1.3) - 0.08 * t));
  vec2 r = vec2(fbm(p + 2.0 * q + vec2(1.7, 9.2) + 0.12 * t), fbm(p + 2.0 * q + vec2(8.3, 2.8) - 0.10 * t));
  float f = fbm(p + 2.5 * r);
  float w = f * 0.5 + 0.5;
  vec3 col = mix(pow(uColorA, vec3(2.2)), pow(uColorB, vec3(2.2)), smoothstep(0.15, 0.85, w));
  col = mix(col, pow(uColorC, vec3(2.2)), smoothstep(0.35, 0.95, q.y * 0.5 + 0.5) * 0.7);
  col = mix(col, pow(uColorD, vec3(2.2)), smoothstep(0.40, 1.00, r.y * 0.5 + 0.5) * 0.5);
  float glow = smoothstep(0.25, 0.95, w);
  vec3 base = pow(uBase, vec3(2.2));
  vec3 outc = pow(mix(base, col, uStrength * (0.35 + 0.65 * glow)), vec3(1.0 / 2.2));
  outc += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * (2.0 / 255.0);
  gl_FragColor = vec4(outc, 1.0);
}
`;

const COLOR_TOKENS = ["--surface", "--primary", "--primary-accent", "--info", "--accent"] as const;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function sampleColors(canvas: HTMLCanvasElement): number[][] | null {
  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const styles = getComputedStyle(canvas);
  return COLOR_TOKENS.map((token) => {
    const value = styles.getPropertyValue(token).trim();
    ctx.fillStyle = "#000000";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return [data[0] / 255, data[1] / 255, data[2] / 255];
  });
}

export function ShaderBackground({ speed = 0.12, strength = 0.25, className }: ShaderBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = React.useState(false);
  const failedRef = React.useRef(false);
  const { reduced } = useMotionPreference();
  const reducedRef = React.useRef(reduced);
  const paramsRef = React.useRef({ speed, strength });
  const controlRef = React.useRef<{ kick: () => void; halt: () => void } | null>(null);

  React.useEffect(() => {
    reducedRef.current = reduced;
    paramsRef.current = { speed, strength };
  });
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const fail = () => {
      if (failedRef.current) return;
      failedRef.current = true;
      setFailed(true);
    };
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "pointer-events-none size-full";
    container.append(canvas);
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      fail();
      return;
    }
    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      fail();
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      fail();
      return;
    }
    const bindProgram = gl.useProgram.bind(gl);
    bindProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
      strength: gl.getUniformLocation(program, "uStrength"),
      base: gl.getUniformLocation(program, "uBase"),
      colors: ["uColorA", "uColorB", "uColorC", "uColorD"].map((name) =>
        gl.getUniformLocation(program, name),
      ),
    };

    const uploadColors = () => {
      const colors = sampleColors(canvas);
      if (!colors) return;
      gl.uniform3fv(uniforms.base, colors[0]);
      uniforms.colors.forEach((location, i) => gl.uniform3fv(location, colors[i + 1]));
    };
    uploadColors();

    let raf = 0;
    let visible = false;
    let time = 8;
    let last = 0;

    const draw = () => {
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.strength, Math.min(Math.max(paramsRef.current.strength, 0), 1));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      if (reducedRef.current && visible) draw();
    };

    const halt = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      time += dt * paramsRef.current.speed;
      draw();
      if (!reducedRef.current && visible && !document.hidden) {
        raf = requestAnimationFrame(tick);
      } else {
        last = 0;
      }
    };

    const kick = () => {
      if (raf || !visible || document.hidden) return;
      if (reducedRef.current) {
        draw();
        return;
      }
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    controlRef.current = { kick, halt };

    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) kick();
      else halt();
    });
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const onVisibility = () => {
      if (document.hidden) halt();
      else kick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const themeObserver = new MutationObserver(() => {
      uploadColors();
      if (reducedRef.current && visible) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      halt();
      controlRef.current = null;
      observer.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, []);

  React.useEffect(() => {
    if (reduced) {
      controlRef.current?.halt();
    }
    controlRef.current?.kick();
  }, [reduced]);

  if (failed) {
    return <div aria-hidden="true" className={cn("size-full bg-surface", className)} />;
  }
  return <div ref={containerRef} aria-hidden="true" className={cn("pointer-events-none size-full", className)} />;
}