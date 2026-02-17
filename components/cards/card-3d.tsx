'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

function BrandedBack() {
  return (
    <div className="absolute inset-0 bg-paper flex flex-col items-center justify-center">
      <div className="absolute inset-0 border border-silk/60 rounded-lg m-3" />
      <span className="text-lg font-semibold tracking-widest text-ink mb-2">
        INKY
      </span>
      <div className="w-6 h-px bg-silk mb-2" />
      <p className="text-[9px] uppercase tracking-[0.25em] text-stone">Designed by Inky Cards</p>
    </div>
  );
}

interface Card3DProps {
  frontImage: string;
  backImage?: string;
  alt: string;
  className?: string;
  hoverEffect?: 'flip' | 'open';
}

export function Card3D({
  frontImage,
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
          <div
            className="absolute inset-0 rounded-lg overflow-hidden card-3d-face"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Image src={frontImage} alt={alt} fill className="object-cover" />
          </div>
          <div
            className="absolute inset-0 rounded-lg overflow-hidden card-3d-face"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <BrandedBack />
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
        {/* Inside — branded back */}
        <div className="absolute inset-0 rounded-lg overflow-hidden card-3d-face">
          <BrandedBack />
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
