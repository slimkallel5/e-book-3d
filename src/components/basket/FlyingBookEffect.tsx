import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Book } from '../../types/book';
import { BookOpen } from 'lucide-react';

export interface FlyingBookProps {
  book: Book;
  startPos?: { x: number; y: number };
  targetElement: HTMLElement | null;
  onComplete: () => void;
}

export const FlyingBookEffect: React.FC<FlyingBookProps> = ({
  book,
  startPos,
  targetElement,
  onComplete
}) => {
  const flyerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flyerRef.current) return;

    // Start position: center screen or specified button coordinates
    const startX = startPos ? startPos.x : window.innerWidth / 2;
    const startY = startPos ? startPos.y : window.innerHeight / 2;

    // End position: basket icon bounding box
    let targetX = window.innerWidth - 60;
    let targetY = 32;

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    // Set initial flyer transformation
    gsap.set(flyerRef.current, {
      x: startX - 25,
      y: startY - 35,
      scale: 1,
      opacity: 1,
      rotationY: 0,
      rotationZ: 0,
      transformPerspective: 800
    });

    // Create high-speed 3D flight trajectory curve using GSAP
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    tl.to(flyerRef.current, {
      duration: 0.85,
      ease: 'power3.inOut',
      x: targetX - 25,
      y: targetY - 35,
      scale: 0.28,
      opacity: 0.9,
      rotationY: 720,
      rotationZ: 45
    })
      .to(
        flyerRef.current,
        {
          duration: 0.15,
          scale: 0.05,
          opacity: 0,
          ease: 'power2.in'
        },
        '-=0.15'
      );

    return () => {
      tl.kill();
    };
  }, [book, startPos, targetElement, onComplete]);

  return (
    <div
      ref={flyerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '50px',
        height: '70px',
        zIndex: 9999,
        pointerEvents: 'none',
        borderRadius: '6px',
        background: `linear-gradient(135deg, ${book.coverStyle.primaryColor}, ${book.coverStyle.spineColor || '#1e293b'})`,
        border: `2px solid ${book.coverStyle.accentColor || '#fbbf24'}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px rgba(229, 179, 100, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity'
      }}
    >
      <BookOpen size={20} color={book.coverStyle.accentColor || '#fbbf24'} />
      <span
        style={{
          fontSize: '0.45rem',
          fontWeight: 700,
          marginTop: '4px',
          textAlign: 'center',
          padding: '0 4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%'
        }}
      >
        {book.subject.ar}
      </span>
    </div>
  );
};
