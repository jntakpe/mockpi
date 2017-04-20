import { TemplateRef } from '@angular/core';
export interface Column {
  name: string;
  prop?: string;
  cellTemplate?: TemplateRef<any>;
}
