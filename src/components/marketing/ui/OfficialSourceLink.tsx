import React from 'react';
import { Lock, ExternalLink } from 'lucide-react';

export interface OfficialSourceLinkProps {
  country?: string;
  name: string;
  url: string;
  description: string;
  className?: string;
}

export const OfficialSourceLink: React.FC<OfficialSourceLinkProps> = ({
  country,
  name,
  url,
  description,
  className = '',
}) => {
  return (
    <div
      className={`border border-[#DAD8D3] bg-white p-5 transition-all duration-200 hover:border-[#850D0D]/40 ${className}`.trim()}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#850D0D]">
          <Lock className="w-3.5 h-3.5 text-[#850D0D]" aria-hidden="true" />
          <span>{country ? `${country} Official Authority` : 'Official Government Authority'}</span>
        </div>
        <ExternalLink className="w-4 h-4 text-[#777570] flex-shrink-0" aria-hidden="true" />
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1 font-heading font-bold text-base text-[#171717] hover:text-[#850D0D] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#850D0D]"
      >
        <span>{name}</span>
      </a>

      <p className="mt-2 text-xs text-[#777570] leading-relaxed">
        {description}
      </p>

      <div className="mt-3 pt-3 border-t border-[#DAD8D3]/60 flex items-center justify-between text-[11px] text-[#777570]">
        <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
        <span className="text-[#850D0D] font-medium tracking-wide uppercase text-[10px]">Verify Source ↗</span>
      </div>
    </div>
  );
};
