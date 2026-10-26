'use client';

import React, { useState, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  allowMultiple?: boolean;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  className = '',
  allowMultiple = false,
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % items.length;
      buttonRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + items.length) % items.length;
      buttonRefs.current[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttonRefs.current[items.length - 1]?.focus();
    }
  };

  return (
    <div className={`divide-y divide-[#DAD8D3] border-t border-b border-[#DAD8D3] ${className}`.trim()}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        const buttonId = `faq-btn-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={index} className="transition-colors duration-150">
            <h3>
              <button
                id={buttonId}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleIndex(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-full py-5 sm:py-6 flex items-center justify-between gap-4 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#850D0D] focus-visible:outline-offset-2"
              >
                <span className="font-heading font-medium text-lg sm:text-xl text-[#171717] group-hover:text-[#850D0D] transition-colors">
                  {item.question}
                </span>
                <span className="flex-shrink-0 text-[#171717] group-hover:text-[#850D0D] transition-colors">
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-[#850D0D]" aria-hidden="true" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#777570]" aria-hidden="true" />
                  )}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="font-body text-sm sm:text-base text-[#777570] leading-relaxed pr-6">
                {typeof item.answer === 'string' ? (
                  <p>{item.answer}</p>
                ) : (
                  item.answer
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
