'use client';

import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App as AntdApp } from 'antd';
import { antdThemeConfig } from '../theme/themeConfig';

export interface AntdProviderProps {
  children: React.ReactNode;
}

/**
 * AntdProvider Wraps Ant Design's SSR Registry & ConfigProvider
 * Solves Next.js App Router CSS SSR flickering and hydration mismatches.
 */
export function AntdProvider({ children }: AntdProviderProps) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={antdThemeConfig}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </AntdRegistry>
  );
}

export default AntdProvider;
