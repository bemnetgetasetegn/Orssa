import React from 'react';
import Link from 'next/link';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  className = '',
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
}) => {
  const sizeStyles = {
    sm: 'px-5 py-2.5 text-xs',
    md: 'px-8 py-3.5 text-sm',
    lg: 'px-10 py-4 text-base',
  };

  const variantStyles = {
    primary:
      'bg-[#850D0D] text-white hover:bg-[#680909] active:bg-[#4d0606] border border-[#850D0D] hover:border-[#680909]',
    secondary:
      'bg-transparent text-[#171717] border border-[#171717] hover:bg-[#171717] hover:text-white',
    ghost:
      'bg-transparent text-[#850D0D] border border-transparent hover:underline px-2 py-1',
  };

  const baseStyles =
    'inline-flex items-center justify-center uppercase tracking-wider font-medium rounded-none transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#850D0D] focus-visible:outline-offset-2 select-none cursor-pointer';

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${
    variant === 'ghost' ? 'text-sm' : sizeStyles[size]
  } ${disabledStyles} ${className}`.trim();

  if (href && !disabled) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    if (isExternal) {
      return (
        <a
          href={href}
          className={combinedStyles}
          onClick={onClick}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedStyles} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedStyles}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
