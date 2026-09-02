import * as React from "react";

export type DragInfo = {
  dx: number;
  dy: number;
  clientX: number;
  clientY: number;
};

export interface UseDragOptions {
  disabled?: boolean;
  onDragStart?: (e: React.PointerEvent<HTMLElement>) => void;
  onDragMove?: (info: DragInfo) => void;
  onDragEnd?: (info: DragInfo) => void;
}

export type DragResult = {
  isDragging: boolean;
  handlePointerDown: (e: React.PointerEvent<HTMLElement>) => void;
};

export function useDrag(opts: UseDragOptions = {}): DragResult {
  const { disabled = false, onDragStart, onDragMove, onDragEnd } = opts;
  const stateRef = React.useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    pointerId: -1,
  });
  const [isDragging, setIsDragging] = React.useState(false);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (disabled) return;
      e.preventDefault();
      const target = e.target as HTMLElement;
      target.setPointerCapture(e.pointerId);
      stateRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        pointerId: e.pointerId,
      };
      setIsDragging(true);
      onDragStart?.(e);

      const onMove = (ev: PointerEvent) => {
        const s = stateRef.current;
        if (!s.isDragging || ev.pointerId !== s.pointerId) return;
        const dx = ev.clientX - s.startX;
        const dy = ev.clientY - s.startY;
        onDragMove?.({ dx, dy, clientX: ev.clientX, clientY: ev.clientY });
      };

      const onUp = (ev: PointerEvent) => {
        const s = stateRef.current;
        if (ev.pointerId !== s.pointerId) return;
        const dx = ev.clientX - s.startX;
        const dy = ev.clientY - s.startY;
        target.releasePointerCapture(s.pointerId);
        stateRef.current.isDragging = false;
        setIsDragging(false);
        onDragEnd?.({ dx, dy, clientX: ev.clientX, clientY: ev.clientY });
        cleanup();
      };

      function cleanup() {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      }
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [disabled, onDragStart, onDragMove, onDragEnd],
  );

  return {
    isDragging,
    handlePointerDown,
  };
}
