'use client';

import React from 'react';
import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';

export interface CoreModalProps extends AntdModalProps {}

export const CoreModal: React.FC<CoreModalProps> = ({
  children,
  centered = true,
  maskClosable = true,
  ...props
}) => {
  return (
    <AntdModal centered={centered} maskClosable={maskClosable} {...props}>
      {children}
    </AntdModal>
  );
};

export default CoreModal;
