import React from 'react';
import { Info } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export interface DisclaimerProps {
  className?: string;
  customText?: string;
  condensed?: boolean;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  className = '',
  customText,
  condensed = false,
}) => {
  return (
    <div
      role="note"
      aria-label="Legal Notice & Disclaimer"
      className={`border border-[#DAD8D3] bg-[#EAE8E3]/60 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-[#777570] leading-relaxed ${className}`.trim()}
    >
      <Info
        className="w-4 h-4 text-[#850D0D] flex-shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <div className="space-y-1">
        <p className="font-semibold uppercase tracking-wider text-[11px] text-[#171717]">
          Important Regulatory Disclaimer
        </p>
        <p>
          {customText || SITE_CONFIG.disclaimer}
        </p>
        {!condensed && (
          <p className="text-[11px] text-[#777570]/90 italic pt-1">
            Official regulations and immigration policies are subject to legislative amendment. Applicants must verify specific eligibility criteria with accredited authorities.
          </p>
        )}
      </div>
    </div>
  );
};
