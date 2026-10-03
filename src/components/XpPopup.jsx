import React, { useEffect, useState } from 'react';

/**
 * XpPopup — A floating "+XP" reward badge that rises and fades.
 * Shows every time `trigger` changes (non-zero).
 */
export default function XpPopup({ trigger, amount = 10, label = 'XP' }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const id = Date.now();
    // random horizontal spread so multiple don't stack
    const offsetX = (Math.random() - 0.5) * 60;
    setItems(prev => [...prev, { id, offsetX }]);

    const t = setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id));
    }, 1200);

    return () => clearTimeout(t);
  }, [trigger]);

  if (!items.length) return null;

  return (
    <div className="xp-popup-layer" aria-hidden="true">
      {items.map(item => (
        <div
          key={item.id}
          className="xp-popup"
          style={{ '--xp-offset': `${item.offsetX}px` }}
        >
          +{amount} {label}
        </div>
      ))}
    </div>
  );
}
