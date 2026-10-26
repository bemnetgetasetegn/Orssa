import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-4 text-xs tracking-wider uppercase font-medium ${className}`.trim()}
    >
      <ol className="flex flex-wrap items-center gap-2 text-[#777570]">
        <li>
          <Link
            href="/"
            className="hover:text-[#850D0D] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#850D0D]"
          >
            Home
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <li aria-hidden="true" className="text-[#DAD8D3] select-none">
                /
              </li>
              <li>
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className="text-[#171717] font-semibold"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-[#850D0D] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#850D0D]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
