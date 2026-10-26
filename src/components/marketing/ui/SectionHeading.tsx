import React from 'react';
import { SectionNumber } from './SectionNumber';

export interface SectionHeadingProps {
  eyebrow?: string;
  number?: string;
  heading: string;
  subheading?: string;
  align?: 'left' | 'center';
  className?: string;
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  number,
  heading,
  subheading,
  align = 'left',
  className = '',
  dark = false,
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`relative ${
        isCenter ? 'text-center mx-auto' : 'text-left'
      } ${className}`.trim()}
    >
      {number && (
        <div
          className={`absolute -top-12 lg:-top-16 ${
            isCenter ? 'left-1/2 -translate-x-1/2' : '-left-4 lg:-left-8'
          } z-0 overflow-hidden`}
        >
          <SectionNumber
            number={number}
            className={dark ? 'text-white/10' : 'text-[#DAD8D3]/60'}
          />
        </div>
      )}

      <div className="relative z-10">
        {eyebrow && (
          <div
            className={`inline-flex items-center uppercase tracking-widest text-xs sm:text-sm font-semibold mb-3 ${
              dark ? 'text-[#EAE8E3]' : 'text-[#777570]'
            } ${
              isCenter
                ? 'justify-center border-l-2 border-[#850D0D] pl-3'
                : 'border-l-2 border-[#850D0D] pl-3'
            }`}
          >
            {eyebrow}
          </div>
        )}

        <h2
          className={`font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-4 ${
            dark ? 'text-white' : 'text-[#171717]'
          }`}
        >
          {heading}
        </h2>

        {subheading && (
          <p
            className={`font-body text-base sm:text-lg leading-relaxed ${
              dark ? 'text-[#EAE8E3]/80' : 'text-[#777570]'
            } ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}
          >
            {subheading}
          </p>
        )}
      </div>
    </div>
  );
};
