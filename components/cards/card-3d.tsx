'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Card3DProps {
  frontImage: string;
  backImage: string;
  alt: string;
  className?: string;
  /** If true, card opens like a book on hover instead of flipping */
  hoverEffect?: 'flip' | 'open';
}

export function Card3D({
  frontImage,
  backImage,
  alt,
  className = '',
  hoverEffect = 'open',
}: Card3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (hoverEffect === 'flip') {
    return (
      <div
        className={`perspective-[1000px] ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative w-full aspect-[3/4]"
          animate={{ rotateY: isHovered ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-lg overflow-hidden card-3d-face"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Image src={frontImage} alt={alt} fill className="object-cover" />
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-lg overflow-hidden card-3d-face"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <Image src={backImage} alt={`${alt} back`} fill className="object-cover" />
          </div>
        </motion.div>
      </div>
    );
  }

  // "open" effect — front cover lifts like opening a book
  return (
    <div
      className={`perspective-[1200px] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-[3/4]">
        {/* Inside (back/inside of card visible when open) */}
        <div className="absolute inset-0 rounded-lg overflow-hidden card-3d-face bg-white">
          <Image src={backImage} alt={`${alt} inside`} fill className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-white/80" />
        </div>

        {/* Front cover — pivots from left edge */}
        <motion.div
          className="absolute inset-0 rounded-lg overflow-hidden card-3d-face origin-left"
          animate={{ rotateY: isHovered ? -35 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Image src={frontImage} alt={alt} fill className="object-cover" />
        </motion.div>
      </div>
    </div>
  );
}
