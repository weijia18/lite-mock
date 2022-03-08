export interface columnConfig {
    type: string,
    prop: string,
    meta?: columnConfigs,
    stringRandomNum?: number,
    numberMinNum?: number,
    numberMaxNum?: number,
    arrayRandomNum?: number,
    stringMinNum?: number,
    stringMaxNum?: number
}

export interface PageParams {
    pageSize: number,
    pageIndex: number
}

export type columnConfigs = Array<columnConfig>

