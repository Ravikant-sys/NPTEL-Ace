import React, { useEffect, useState } from 'react';

const COLORS = [
  '#58cc02', '#ff4b4b', '#ff9600', '#2b70c9',
  '#ce82ff', '#ffd900', '#00d4ff', '#ff6ec7',
];

const SHAPES = ['circle', 'square', 'ribbon', 'star'];

function getShape(shape) {
  if (shape === 'circle')  return { borderRadius: '50%', width: null, height: null };
  if (shape === 'square')  return { borderRadius: '3px', width: null, height: null };
  if (shape === 'ribbon')  return { borderRadius: '2px', width: null, height: null, isRibbon: true };
  return { borderRadius: '2px', width: null, height: null }; // star handled via CSS
}

export default function Confetti({ trigger = 0, count = 55 }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    const newPieces = [];
    for (let i = 0; i < count; i++) {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const isRibbon = shape === 'ribbon';
      const isStar = shape === 'star';
      const size = isRibbon
        ? { w: 3 + Math.random() * 3, h: 10 + Math.random() * 10 }
        : isStar
        ? { w: 8 + Math.random() * 8, h: 8 + Math.random() * 8 }
        : { w: 5 + Math.random() * 9, h: 5 + Math.random() * 9 };

      newPieces.push({
        id: `${trigger}-${i}`,
        left: 5 + Math.random() * 90,       // % horizontal start
        dx: (Math.random() - 0.5) * 200,    // horizontal drift px
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 1.8 + Math.random() * 1.2,
        w: size.w,
        h: size.h,
        borderRadius: isRibbon ? '2px' : isStar ? '2px' : shape === 'circle' ? '50%' : '3px',
        rotate: Math.random() * 360,
        rotateSpeed: (Math.random() - 0.5) * 900,
        opacity: 0.85 + Math.random() * 0.15,
        isStar,
      });
    }
    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 3500);
    return () => clearTimeout(timer);
  }, [trigger, count]);

  if (!pieces.length) return null;

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className={`confetti-piece${p.isStar ? ' confetti-star' : ''}`}
          style={{
            left: `${p.left}%`,
            width: `${p.w}px`,
            height: `${p.h}px`,
            background: p.color,
            borderRadius: p.borderRadius,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--dx': `${p.dx}px`,
            '--rotate-start': `${p.rotate}deg`,
            '--rotate-end': `${p.rotate + p.rotateSpeed}deg`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
