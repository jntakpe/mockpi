import { ITdDataTableColumn, TdDataTableSortingOrder } from '@covalent/core';

export interface TableModel {
  columns: ITdDataTableColumn[];
  sortBy?: string;
  sortOrder?: TdDataTableSortingOrder;
  pageSize?: number;
  currentPage?: number;
}
