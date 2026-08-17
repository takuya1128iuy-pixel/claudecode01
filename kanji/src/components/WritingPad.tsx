import { useCallback, useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

/**
 * 指や Apple Pencil で漢字を書くためのマス。
 * 座標は 0〜1 に正規化して持っておき、画面の大きさが変わっても書いた線が残るようにする。
 */
export default function WritingPad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Point[][]>([]);
  const currentRef = useRef<Point[] | null>(null);
  /** ペンで一度でも書いたら、手のひらの誤タッチ（touch）を無視する */
  const penUsedRef = useRef(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // マス目（中央の点線）
    ctx.save();
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = Math.max(1, width / 300);
    ctx.setLineDash([width / 40, width / 40]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.restore();

    // 書いた線
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = width / 28;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const strokes = currentRef.current
      ? [...strokesRef.current, currentRef.current]
      : strokesRef.current;
    for (const stroke of strokes) {
      if (stroke.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x * width, stroke[0].y * height);
      for (const point of stroke.slice(1)) {
        ctx.lineTo(point.x * width, point.y * height);
      }
      if (stroke.length === 1) {
        // 点を打っただけのときも見えるようにする
        ctx.lineTo(stroke[0].x * width + 0.1, stroke[0].y * height);
      }
      ctx.stroke();
    }
  }, []);

  // 画面サイズ・解像度に合わせてキャンバスの実ピクセル数を合わせる
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      redraw();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [redraw]);

  const positionOf = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  };

  const shouldIgnore = (event: React.PointerEvent<HTMLCanvasElement>) =>
    penUsedRef.current && event.pointerType === "touch";

  const handleDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === "pen") penUsedRef.current = true;
    if (shouldIgnore(event)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    currentRef.current = [positionOf(event)];
    redraw();
  };

  const handleMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentRef.current || shouldIgnore(event)) return;
    currentRef.current.push(positionOf(event));
    redraw();
  };

  const handleUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentRef.current || shouldIgnore(event)) return;
    strokesRef.current = [...strokesRef.current, currentRef.current];
    currentRef.current = null;
    setStrokeCount(strokesRef.current.length);
    redraw();
  };

  const undo = () => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    redraw();
  };

  const clear = () => {
    strokesRef.current = [];
    currentRef.current = null;
    setStrokeCount(0);
    redraw();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        className="no-touch-scroll aspect-square w-full max-w-[min(78vw,26rem)] rounded-3xl border-4 border-dashed border-slate-300 bg-white"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={undo}
          disabled={strokeCount === 0}
          className="rounded-full border border-slate-300 bg-white px-5 py-2 text-base font-bold text-slate-600 disabled:opacity-40"
        >
          ← 1かく もどす
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={strokeCount === 0}
          className="rounded-full border border-slate-300 bg-white px-5 py-2 text-base font-bold text-slate-600 disabled:opacity-40"
        >
          ぜんぶ けす
        </button>
        <span className="text-sm text-slate-400">{strokeCount}かく</span>
      </div>
    </div>
  );
}
