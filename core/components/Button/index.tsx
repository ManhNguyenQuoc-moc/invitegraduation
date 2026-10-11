'use client';

import React from 'react';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';

export interface CoreButtonProps extends AntdButtonProps {
  variantStyle?: 'gold' | 'rose' | 'glass' | 'default';
}

export const CoreButton: React.FC<CoreButtonProps> = ({
  children,
  variantStyle = 'default',
  className = '',
  style,
  ...props
}) => {
  let customClass = className;

  if (variantStyle === 'gold') {
    customClass += ' btn-primary';
  } else if (variantStyle === 'rose') {
    customClass += ' bg-gradient-to-r from-[#E0A96D] to-[#FFB6C1] text-white border-none shadow-md hover:brightness-105';
  } else if (variantStyle === 'glass') {
    customClass += ' glass-panel text-gray-800 hover:border-[#E0A96D] hover:text-[#E0A96D]';
  }

  return (
    <AntdButton className={customClass.trim()} style={style} {...props}>
      {children}
    </AntdButton>
  );
};

export default CoreButton;
