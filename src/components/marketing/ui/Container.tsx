import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  id?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
  id,
}) => {
  return (
    <Component
      id={id}
      className={`max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 ${className}`.trim()}
    >
      {children}
    </Component>
  );
};
