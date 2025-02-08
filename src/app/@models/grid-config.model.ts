// src/app/models/grid-config.model.ts

import { FilterMode, GridSelectionMode } from "igniteui-angular";

export interface ColumnConfig {
    field: string;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    resizable?: boolean;
    dataType?: string;
    colType?: string;
    groupable?: boolean;
    options?: string[],
}

export interface GridConfig {
    title: string;
    primaryKey: string;
    columns: ColumnConfig[];
    data: any[];
    pagination: boolean;
    perPage: number;
    toolbar: boolean;
    allowFiltering: boolean;
    moving: boolean;
    filterMode: FilterMode;
    searchBar: boolean;
    rowSelection?: GridSelectionMode
}