'use client';

import React from 'react';
import { Card as AntdCard, CardProps as AntdCardProps } from 'antd';

export interface CoreCardProps extends AntdCardProps {
  isGlass?: boolean;
}

export const CoreCard: React.FC<CoreCardProps> = ({
  children,
  isGlass = false,
  className = '',
  ...props
}) => {
  const customClass = `${isGlass ? 'glass-panel glass-card-hover' : ''} ${className}`.trim();
  return (
    <AntdCard className={customClass} {...props}>
      {children}
    </AntdCard>
  );
};

export default CoreCard;
