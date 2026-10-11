'use client';

import React from 'react';
import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';

export interface CoreTableProps<T = any> extends AntdTableProps<T> {}

export function CoreTable<T extends object = any>({
  pagination = { pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} mục` },
  scroll = { x: 'max-content' },
  ...props
}: CoreTableProps<T>) {
  return <AntdTable<T> pagination={pagination} scroll={scroll} {...props} />;
}

export default CoreTable;
