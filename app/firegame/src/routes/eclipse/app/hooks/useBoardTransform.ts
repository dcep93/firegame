import { useState, useCallback, useRef, useEffect } from 'react';
import type { PointerEvent, WheelEvent, RefObject } from 'react';

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.3;
const MAX_SCALE = 3.0;
const ZOOM_SPEED = 0.001;
const DEFAULT_SCALE = 1.5;
const DRAG_THRESHOLD = 5; // pixels of movement before it's considered a drag

/** Compute translate offset that centers content at given scale with transformOrigin 0 0 */
function centeredOffset(el: Element, scale: number): { x: number; y: number } {
  const parent = el.parentElement;
  if (!parent) return { x: 0, y: 0 };
  const w = parent.clientWidth;
  const h = parent.clientHeight;
  return {
    x: -(w * (scale - 1)) / 2,
    y: -(h * (scale - 1)) / 2,
  };
}

/**
 * Pan/zoom hook for the SVG hex board.
 */
export function useBoardTransform() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: DEFAULT_SCALE });
  const initialized = useRef(false);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const totalMoveDistance = useRef(0);

  // Center board on mount
  useEffect(() => {
    if (initialized.current || !svgRef.current) return;
    const off = centeredOffset(svgRef.current, DEFAULT_SCALE);
    setTransform({ x: off.x, y: off.y, scale: DEFAULT_SCALE });
    initialized.current = true;
  }, []);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    pointerStart.current = { x: e.clientX, y: e.clientY };
    totalMoveDistance.current = 0;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    totalMoveDistance.current += Math.abs(dx) + Math.abs(dy);

    setTransform(prev => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * ZOOM_SPEED;

    setTransform(prev => {
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * (1 + delta)));
      // Zoom towards cursor position
      const ratio = newScale / prev.scale;
      const rect = (e.target as Element).closest('svg')?.getBoundingClientRect();
      if (!rect) return { ...prev, scale: newScale };

      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      return {
        x: cx - (cx - prev.x) * ratio,
        y: cy - (cy - prev.y) * ratio,
        scale: newScale,
      };
    });
  }, []);

  const wasDrag = useCallback(() => {
    return totalMoveDistance.current > DRAG_THRESHOLD;
  }, []);

  const resetView = useCallback(() => {
    if (svgRef.current) {
      const off = centeredOffset(svgRef.current, DEFAULT_SCALE);
      setTransform({ x: off.x, y: off.y, scale: DEFAULT_SCALE });
    } else {
      setTransform({ x: 0, y: 0, scale: DEFAULT_SCALE });
    }
  }, []);

  return {
    transform,
    svgRef: svgRef as RefObject<SVGSVGElement>,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onWheel: handleWheel,
    },
    wasDrag,
    resetView,
  };
}
