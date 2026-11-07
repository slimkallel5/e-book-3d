import React, { useRef, useState, useEffect, useCallback } from 'react';

interface BookSpread3DProps {
  leftCanvas: HTMLCanvasElement | null;
  rightCanvas: HTMLCanvasElement | null;
  turningCanvasFront: HTMLCanvasElement | null;
  turningCanvasBack: HTMLCanvasElement | null;
  turnDirection: 'forward' | 'backward' | null;
  turnProgress: number;
  isAnimating: boolean;
  coverColor?: string;
  onPageClick?: (isRightSide: boolean) => void;
  // Mouse drag & corner interaction props
  isDragging?: boolean;
  dragProgress?: number;
  dragDirection?: 'forward' | 'backward' | null;
  onStartDrag?: (direction: 'forward' | 'backward', initialProgress: number) => void;
  onUpdateDrag?: (progress: number) => void;
  onEndDrag?: (completed: boolean) => void;
  canGoNext?: boolean;
  canGoPrev?: boolean;
}

export const BookSpread3D: React.FC<BookSpread3DProps> = ({
  leftCanvas,
  rightCanvas,
  turningCanvasFront,
  turningCanvasBack,
  turnDirection,
  turnProgress,
  isAnimating,
  coverColor = '#c99a62',
  onPageClick,
  isDragging = false,
  dragProgress = 0,
  dragDirection = null,
  onStartDrag,
  onUpdateDrag,
  onEndDrag,
  canGoNext = true,
  canGoPrev = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; time: number; direction: 'forward' | 'backward' } | null>(null);
  const [hoveredCorner, setHoveredCorner] = useState<'tr' | 'br' | 'tl' | 'bl' | null>(null);

  const [leftUrl, setLeftUrl] = useState<string>('');
  const [rightUrl, setRightUrl] = useState<string>('');
  const [turningFrontUrl, setTurningFrontUrl] = useState<string>('');
  const [turningBackUrl, setTurningBackUrl] = useState<string>('');

  useEffect(() => {
    if (leftCanvas) setLeftUrl(leftCanvas.toDataURL());
    else setLeftUrl('');
  }, [leftCanvas]);

  useEffect(() => {
    if (rightCanvas) setRightUrl(rightCanvas.toDataURL());
    else setRightUrl('');
  }, [rightCanvas]);

  useEffect(() => {
    if (turningCanvasFront) setTurningFrontUrl(turningCanvasFront.toDataURL());
    else setTurningFrontUrl('');
  }, [turningCanvasFront]);

  useEffect(() => {
    if (turningCanvasBack) setTurningBackUrl(turningCanvasBack.toDataURL());
    else setTurningBackUrl('');
  }, [turningCanvasBack]);

  // Compute active page rotation, curvature, and shadow
  const activeDirection = isDragging ? dragDirection : turnDirection;
  const activeProgress = isDragging ? dragProgress : turnProgress;
  const isPageInMotion = (isAnimating || isDragging) && Boolean(activeDirection);

  let turningAngleDeg = 0;
  let pageBendAngleDeg = 0;
  let shadowOpacity = 0;

  if (isPageInMotion && activeDirection === 'forward') {
    turningAngleDeg = -activeProgress * 180;
    pageBendAngleDeg = Math.sin(activeProgress * Math.PI) * 18;
    shadowOpacity = Math.sin(activeProgress * Math.PI) * 0.45;
  } else if (isPageInMotion && activeDirection === 'backward') {
    turningAngleDeg = -180 + activeProgress * 180;
    pageBendAngleDeg = -Math.sin(activeProgress * Math.PI) * 18;
    shadowOpacity = Math.sin(activeProgress * Math.PI) * 0.45;
  }

  // Pointer drag event handlers
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating || !containerRef.current) return;
    // Disregard if clicked on controls or secondary buttons
    if ((e.target as HTMLElement).closest('button, a, input, select')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isRightHalf = clickX > rect.width / 2;

    if (isRightHalf && !canGoNext) return;
    if (!isRightHalf && !canGoPrev) return;

    const direction: 'forward' | 'backward' = isRightHalf ? 'forward' : 'backward';

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
      direction
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  }, [isAnimating, canGoNext, canGoPrev]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !containerRef.current || isAnimating) return;

    const rect = containerRef.current.getBoundingClientRect();
    const pageWidth = rect.width / 2;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    if (!isDragging) {
      // Check if horizontal intent is established
      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
        onStartDrag?.(dragStartRef.current.direction, 0.05);
      }
      return;
    }

    let progress = 0;
    if (dragStartRef.current.direction === 'forward') {
      // Dragging right-to-left: negative deltaX
      progress = Math.max(0, Math.min(1, -deltaX / (pageWidth * 1.15)));
    } else {
      // Dragging left-to-right: positive deltaX
      progress = Math.max(0, Math.min(1, deltaX / (pageWidth * 1.15)));
    }

    onUpdateDrag?.(progress);
  }, [isDragging, isAnimating, onStartDrag, onUpdateDrag]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (!dragStartRef.current) return;

    const startInfo = dragStartRef.current;
    dragStartRef.current = null;

    if (isDragging) {
      const deltaX = e.clientX - startInfo.x;
      const elapsed = Math.max(1, performance.now() - startInfo.time);
      const velocity = Math.abs(deltaX) / elapsed;

      // Complete turn if dragged over 32% or flicked with high velocity
      const isForward = startInfo.direction === 'forward';
      const rightDirection = isForward ? deltaX < 0 : deltaX > 0;
      const completed = rightDirection && (dragProgress > 0.32 || velocity > 0.45);

      onEndDrag?.(completed);
    }
  }, [isDragging, dragProgress, onEndDrag]);

  // Corner click helper
  const handleCornerClick = (e: React.MouseEvent, corner: 'tr' | 'br' | 'tl' | 'bl') => {
    e.stopPropagation();
    if (isAnimating || isDragging) return;
    if (corner === 'tr' || corner === 'br') {
      if (canGoNext) onPageClick?.(true);
    } else {
      if (canGoPrev) onPageClick?.(false);
    }
  };

  return (
    <div
      ref={containerRef}
      data-testid="interactive-book-spread"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1080px',
        aspectRatio: '420 / 297',
        perspective: '2400px',
        perspectiveOrigin: '50% 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        userSelect: 'none',
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Outer Leather Book Cover Foundation */}
      <div
        style={{
          position: 'absolute',
          inset: '-10px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${coverColor}, #6b4c33)`,
          boxShadow: '0 24px 60px rgba(73, 53, 35, 0.35), 0 4px 16px rgba(73, 53, 35, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transform: 'translateZ(-14px)'
        }}
      />

      {/* Book Spine Center Shadow Groove */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '20px',
          transform: 'translateX(-50%) translateZ(4px)',
          zIndex: 15,
          pointerEvents: 'none',
          background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.2) 100%)',
          boxShadow: '0 0 12px rgba(0,0,0,0.25)'
        }}
      />

      {/* Pages Stack Edge Rim */}
      <div
        style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '6px',
          background: '#ede3d1',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
          transform: 'translateZ(-4px)'
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          transformStyle: 'preserve-3d',
          borderRadius: '4px',
          overflow: 'visible'
        }}
      >
        {/* Left Page (Previous Page container) */}
        <div
          onClick={() => {
            if (!isDragging && onPageClick) onPageClick(false);
          }}
          data-testid="reader-left-page"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: '#faf8f5',
            borderTopLeftRadius: '6px',
            borderBottomLeftRadius: '6px',
            overflow: 'hidden',
            cursor: canGoPrev ? 'pointer' : 'default',
            boxShadow: 'inset -12px 0 20px rgba(0,0,0,0.08), inset 0 0 4px rgba(0,0,0,0.04)',
            borderRight: '1px solid rgba(0,0,0,0.1)'
          }}
          title={canGoPrev ? "Drag right or click to go to previous page" : ""}
        >
          {leftUrl ? (
            <img
              src={leftUrl}
              alt="Left Page"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                pointerEvents: 'none'
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                fontSize: '0.85rem'
              }}
            >
              Loading Page...
            </div>
          )}

          {/* Left Spine Shadow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '40px',
              background: 'linear-gradient(to left, rgba(0,0,0,0.12), transparent)',
              pointerEvents: 'none'
            }}
          />

          {/* Dynamic Shadow Cast when turning forward */}
          {isPageInMotion && activeDirection === 'forward' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: `linear-gradient(to right, rgba(0,0,0,${shadowOpacity * 0.6}) 0%, transparent 80%)`,
                pointerEvents: 'none',
                zIndex: 5
              }}
            />
          )}

          {/* Clickable Top-Left Corner with curl hint */}
          {canGoPrev && (
            <div
              data-testid="corner-top-left"
              onClick={(e) => handleCornerClick(e, 'tl')}
              onMouseEnter={() => setHoveredCorner('tl')}
              onMouseLeave={() => setHoveredCorner(null)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '60px',
                height: '60px',
                cursor: 'pointer',
                zIndex: 20
              }}
              title="Previous Page"
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '0',
                  height: '0',
                  borderTop: `${hoveredCorner === 'tl' ? '38px' : '20px'} solid var(--color-primary)`,
                  borderRight: `${hoveredCorner === 'tl' ? '38px' : '20px'} solid transparent`,
                  opacity: hoveredCorner === 'tl' ? 0.85 : 0.25,
                  transition: 'all 0.2s ease',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </div>
          )}

          {/* Clickable Bottom-Left Corner with curl hint */}
          {canGoPrev && (
            <div
              data-testid="corner-bottom-left"
              onClick={(e) => handleCornerClick(e, 'bl')}
              onMouseEnter={() => setHoveredCorner('bl')}
              onMouseLeave={() => setHoveredCorner(null)}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '60px',
                height: '60px',
                cursor: 'pointer',
                zIndex: 20
              }}
              title="Previous Page"
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '0',
                  height: '0',
                  borderBottom: `${hoveredCorner === 'bl' ? '38px' : '20px'} solid var(--color-primary)`,
                  borderRight: `${hoveredCorner === 'bl' ? '38px' : '20px'} solid transparent`,
                  opacity: hoveredCorner === 'bl' ? 0.85 : 0.25,
                  transition: 'all 0.2s ease',
                  filter: 'drop-shadow(2px -2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </div>
          )}
        </div>

        {/* Right Page (Next Page container) */}
        <div
          onClick={() => {
            if (!isDragging && onPageClick) onPageClick(true);
          }}
          data-testid="reader-right-page"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: '#faf8f5',
            borderTopRightRadius: '6px',
            borderBottomRightRadius: '6px',
            overflow: 'hidden',
            cursor: canGoNext ? 'pointer' : 'default',
            boxShadow: 'inset 12px 0 20px rgba(0,0,0,0.08), inset 0 0 4px rgba(0,0,0,0.04)',
            borderLeft: '1px solid rgba(0,0,0,0.06)'
          }}
          title={canGoNext ? "Drag left or click to go to next page" : ""}
        >
          {rightUrl ? (
            <img
              src={rightUrl}
              alt="Right Page"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                pointerEvents: 'none'
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                fontSize: '0.85rem'
              }}
            >
              Loading Page...
            </div>
          )}

          {/* Right Spine Shadow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '40px',
              background: 'linear-gradient(to right, rgba(0,0,0,0.12), transparent)',
              pointerEvents: 'none'
            }}
          />

          {/* Dynamic Shadow Cast when turning backward */}
          {isPageInMotion && activeDirection === 'backward' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: `linear-gradient(to left, rgba(0,0,0,${shadowOpacity * 0.6}) 0%, transparent 80%)`,
                pointerEvents: 'none',
                zIndex: 5
              }}
            />
          )}

          {/* Clickable Top-Right Corner with curl hint */}
          {canGoNext && (
            <div
              data-testid="corner-top-right"
              onClick={(e) => handleCornerClick(e, 'tr')}
              onMouseEnter={() => setHoveredCorner('tr')}
              onMouseLeave={() => setHoveredCorner(null)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                cursor: 'pointer',
                zIndex: 20
              }}
              title="Next Page"
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '0',
                  height: '0',
                  borderTop: `${hoveredCorner === 'tr' ? '38px' : '20px'} solid var(--color-primary)`,
                  borderLeft: `${hoveredCorner === 'tr' ? '38px' : '20px'} solid transparent`,
                  opacity: hoveredCorner === 'tr' ? 0.85 : 0.25,
                  transition: 'all 0.2s ease',
                  filter: 'drop-shadow(-2px 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </div>
          )}

          {/* Clickable Bottom-Right Corner with curl hint */}
          {canGoNext && (
            <div
              data-testid="corner-bottom-right"
              onClick={(e) => handleCornerClick(e, 'br')}
              onMouseEnter={() => setHoveredCorner('br')}
              onMouseLeave={() => setHoveredCorner(null)}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '60px',
                height: '60px',
                cursor: 'pointer',
                zIndex: 20
              }}
              title="Next Page"
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '0',
                  height: '0',
                  borderBottom: `${hoveredCorner === 'br' ? '38px' : '20px'} solid var(--color-primary)`,
                  borderLeft: `${hoveredCorner === 'br' ? '38px' : '20px'} solid transparent`,
                  opacity: hoveredCorner === 'br' ? 0.85 : 0.25,
                  transition: 'all 0.2s ease',
                  filter: 'drop-shadow(-2px -2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </div>
          )}
        </div>

        {/* Realistic Turning 3D Page Mesh */}
        {isPageInMotion && activeDirection && (
          <div
            data-testid="turning-page-mesh"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '50%',
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              transform: `rotateY(${turningAngleDeg}deg) rotateZ(${pageBendAngleDeg * 0.16}deg) skewY(${pageBendAngleDeg * 0.08}deg)`,
              zIndex: 30,
              pointerEvents: 'none',
              filter: `drop-shadow(0 15px 25px rgba(0,0,0,${shadowOpacity + 0.18}))`
            }}
          >
            {/* Front of Turning Page */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                background: '#faf8f5',
                borderTopRightRadius: '6px',
                borderBottomRightRadius: '6px',
                overflow: 'hidden',
                boxShadow: 'inset 12px 0 15px rgba(0,0,0,0.06)'
              }}
            >
              {turningFrontUrl && (
                <img
                  src={turningFrontUrl}
                  alt="Turning Page Front"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              )}
              {/* Dynamic 3D lighting sheen over turning page front */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(255,255,255,${Math.sin(activeProgress * Math.PI) * 0.28}) 50%, rgba(0,0,0,0.12) 100%)`
                }}
              />
            </div>

            {/* Back of Turning Page */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: '#faf8f5',
                borderTopLeftRadius: '6px',
                borderBottomLeftRadius: '6px',
                overflow: 'hidden',
                boxShadow: 'inset -12px 0 15px rgba(0,0,0,0.06)'
              }}
            >
              {turningBackUrl && (
                <img
                  src={turningBackUrl}
                  alt="Turning Page Back"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              )}
              {/* Dynamic 3D lighting sheen over turning page back */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to left, rgba(0,0,0,0.18) 0%, rgba(255,255,255,${Math.sin(activeProgress * Math.PI) * 0.28}) 50%, rgba(0,0,0,0.12) 100%)`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
