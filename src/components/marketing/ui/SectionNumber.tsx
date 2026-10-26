import React from 'react';

export interface SectionNumberProps {
  number: string;
  className?: string;
}

export const SectionNumber: React.FC<SectionNumberProps> = ({
  number,
  className = '',
}) => {
  return (
    <span
      aria-hidden="true"
      className={`font-display italic text-[100px] sm:text-[140px] lg:text-[180px] leading-none text-[#DAD8D3]/60 select-none pointer-events-none ${className}`.trim()}
    >
      {number}
    </span>
  );
};
