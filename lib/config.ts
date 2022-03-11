export interface ColumnConfig {
    type: string,
    prop: string,
    children?: ColumnConfigs,
    stringRandomNum?: number,
    numberMinNum?: number,
    numberMaxNum?: number,
    arrayMinNum?: number,
    arrayMaxNum?: number,
    stringMinNum?: number,
    stringMaxNum?: number
}

export interface PageParams {
    pageSize: number,
    pageIndex: number
}


export interface ResponseData {
    code: string | number,
    data: {
        records: Array<any>,
        total?: number
    } | { [key: string]: any },
    success: boolean,
    msg?: string
}


export interface weightStatus {
    code: string | number,
    msg: string,
    weight: number
}

export enum MockType {
    ARRAY = 'array',
    OBJECT = 'object'
}

export interface EditParams {
    key: string,
    [key: string]: any
}

export type ColumnConfigs = Array<ColumnConfig>

