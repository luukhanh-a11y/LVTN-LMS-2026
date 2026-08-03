import React from 'react';
import { cn } from '../../lib/utils';

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2';
}

export function PageTitle({ as: Tag = 'h1', className, children, ...props }: PageTitleProps) {
  return (
    <Tag className={cn('font-heading', className)} {...props}>
      {children}
    </Tag>
  );
}
