import React, { useRef, useState, useEffect } from 'react';

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
  onPageClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  let turningAngleDeg = 0;
  let pageBendAngleDeg = 0;
  let shadowOpacity = 0;

  if (isAnimating && turnDirection === 'forward') {
    turningAngleDeg = -turnProgress * 180;
    pageBendAngleDeg = Math.sin(turnProgress * Math.PI) * 16;
    shadowOpacity = Math.sin(turnProgress * Math.PI) * 0.45;
  } else if (isAnimating && turnDirection === 'backward') {
    turningAngleDeg = -180 + turnProgress * 180;
    pageBendAngleDeg = -Math.sin(turnProgress * Math.PI) * 16;
    shadowOpacity = Math.sin(turnProgress * Math.PI) * 0.45;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1080px',
        aspectRatio: '420 / 297',
        perspective: '2200px',
        perspectiveOrigin: '50% 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-10px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${coverColor}, #806044)`,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0,0,0,0.18)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          transform: 'translateZ(-14px)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '18px',
          transform: 'translateX(-50%) translateZ(4px)',
          zIndex: 15,
          pointerEvents: 'none',
          background: 'linear-gradient(to right, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.22) 100%)',
          boxShadow: '0 0 12px rgba(0,0,0,0.35)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '6px',
          background: '#f1e8d9',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.12)',
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
        {/* Left Page */}
        <div
          onClick={() => onPageClick && onPageClick(false)}
          data-testid="reader-left-page"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: '#faf8f5',
            borderTopLeftRadius: '6px',
            borderBottomLeftRadius: '6px',
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: 'inset -12px 0 20px rgba(0,0,0,0.08), inset 0 0 4px rgba(0,0,0,0.04)',
            borderRight: '1px solid rgba(0,0,0,0.1)'
          }}
          title="Click to go to previous page"
        >
          {leftUrl ? (
            <img
              src={leftUrl}
              alt="Left Page"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block'
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
                color: '#94a3b8',
                fontSize: '0.85rem'
              }}
            >
              Loading Page...
            </div>
          )}

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

          {isAnimating && turnDirection === 'forward' && (
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
        </div>

        {/* Right Page */}
        <div
          onClick={() => onPageClick && onPageClick(true)}
          data-testid="reader-right-page"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: '#faf8f5',
            borderTopRightRadius: '6px',
            borderBottomRightRadius: '6px',
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: 'inset 12px 0 20px rgba(0,0,0,0.08), inset 0 0 4px rgba(0,0,0,0.04)',
            borderLeft: '1px solid rgba(0,0,0,0.06)'
          }}
          title="Click to go to next page"
        >
          {rightUrl ? (
            <img
              src={rightUrl}
              alt="Right Page"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block'
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
                color: '#94a3b8',
                fontSize: '0.85rem'
              }}
            >
              Loading Page...
            </div>
          )}

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

          {isAnimating && turnDirection === 'backward' && (
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
        </div>

        {/* Turning 3D Page */}
        {isAnimating && turnDirection && (
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
              transform: `rotateY(${turningAngleDeg}deg) rotateZ(${pageBendAngleDeg * 0.15}deg)`,
              zIndex: 30,
              pointerEvents: 'none',
              filter: `drop-shadow(0 15px 25px rgba(0,0,0,${shadowOpacity + 0.15}))`
            }}
          >
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
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(255,255,255,${Math.sin(turnProgress * Math.PI) * 0.25}) 50%, rgba(0,0,0,0.1) 100%)`
                }}
              />
            </div>

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
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to left, rgba(0,0,0,0.15) 0%, rgba(255,255,255,${Math.sin(turnProgress * Math.PI) * 0.25}) 50%, rgba(0,0,0,0.1) 100%)`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
