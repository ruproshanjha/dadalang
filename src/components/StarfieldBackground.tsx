import React, { useRef, useEffect } from "react";

const COLORS = ["#CB2D6F", "#14A098", "#501F3A", "#CCCCCC"];
const STAR_COUNT = 120;

function randomBetween(a: number, b: number) {
  return a + (b - a) * Math.random();
}

function createStar(width: number, height: number) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: randomBetween(1, 2.5),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: randomBetween(0.15, 0.5),
    angle: Math.random() * Math.PI * 2,
    drift: randomBetween(-0.3, 0.3),
  };
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = Array.from({ length: STAR_COUNT }, () =>
      createStar(width, height)
    );
    let animationFrame: number;

    function resize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars = Array.from({ length: STAR_COUNT }, () =>
        createStar(width, height)
      );
    }

    function handleMouseMove(e: MouseEvent) {
      pointer.current.x = (e.clientX - width / 2) / width;
      pointer.current.y = (e.clientY - height / 2) / height;
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        let px = star.x + pointer.current.x * star.r * 8;
        let py = star.y + pointer.current.y * star.r * 8;
        let twinkle = 0.7 + 0.3 * Math.sin(Date.now() * 0.002 + px + py);
        ctx.beginPath();
        ctx.arc(px, py, star.r * twinkle, 0, 2 * Math.PI);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = 0.65 + 0.35 * Math.sin(Date.now() * 0.004 + px + py);
        ctx.shadowBlur = 12 * twinkle;
        ctx.shadowColor = star.color;
        ctx.fill();

        star.angle += star.speed * 0.002;
        star.x += Math.cos(star.angle) * star.drift;
        star.y += Math.sin(star.angle) * star.drift;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationFrame = requestAnimationFrame(animate);
    }

    resize();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
