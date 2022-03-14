import { ColumnConfigs, PageParams, ResponseData, weightStatus, MockType, EditParams } from './config'
import MockCenter from './mockCenter'
import { numberRandom, enumRandomByWeight } from './random'


const __statusList__: Array<weightStatus> = [{
    code: "00000",
    msg: '请求成功',
    weight: 10
}, {
    code: 200,
    msg: '请求成功',
    weight: 10
}, {
    code: 401,
    msg: '权限不足',
    weight: 10
}, {
    code: 403,
    msg: '服务器拒绝访问',
    weight: 10
}, {
    code: 404,
    msg: '没有找到资源',
    weight: 10
}, {
    code: 500,
    msg: '服务器内部错误',
    weight: 10
}, {
    code: 501,
    msg: '服务器不支持该请求中使用的方法',
    weight: 10
}, {
    code: 502,
    msg: '网关错误',
    weight: 10
}, {
    code: 504,
    msg: '网关超时',
    weight: 10
}]


function _paging(list: Array<{ [key: string]: any }>, pageParams: PageParams): Array<{ [key: string]: any }> {
    let { pageIndex, pageSize } = pageParams
    let beginIndex = (pageIndex - 1) * pageSize
    let endIndex = pageIndex * pageSize
    return list.slice(beginIndex, endIndex)
}

export default class Mock {

    private _mockListData: Array<{ [key: string]: any }> = []
    private _type: string
    private _configs: ColumnConfigs
    private _statusList: Array<weightStatus>


    constructor(type: MockType = MockType.ARRAY, configs: ColumnConfigs, statusList: Array<weightStatus> = __statusList__) {
        this._type = type
        this._configs = configs
        this._statusList = statusList
        if (this._type === MockType.ARRAY) {
            this._mockListData = this._mockList(configs)
        }
    }

    static _mockObj(configs: ColumnConfigs): { [key: string]: any } {
        let obj: { [key: string]: any } = {}
        configs.forEach(config => {
            if (!MockCenter.__randomActionMap__[config.type]) {
                throw new Error("MockCenter中找不到类型为${config.type}的生成器，请先在MockCenter注入该类型的生成器");
            }
            obj[config.prop] = MockCenter.__randomActionMap__[config.type](config)
        })
        return obj
    }

    private _mockList(configs: ColumnConfigs, listMaxNum: number = 200): Array<{ [key: string]: any }> {
        let n = numberRandom(listMaxNum)
        let list: Array<{ [key: string]: any }> = []
        for (let i = 0; i < n; i++) {
            list.push(Mock._mockObj(configs))
        }
        return list
    }


    private _mockResObj(pageIndex: number, pageSize: number): ResponseData {
        let resStateObj = enumRandomByWeight(this._statusList)
        let res = { ...resStateObj } as ResponseData
        res.data = {}
        if (this._type === MockType.ARRAY) {
            res.data.total = this._mockListData.length
            res.data.records = _paging(this._mockListData, { pageIndex, pageSize })
        } else {
            res.data = Mock._mockObj(this._configs)
        }
        return res
    }


    public mockNetRes({
        pageIndex,
        pageSize,
    }: { [key: string]: any } = { pageIndex: 1, pageSize: 10 }): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this._mockResObj(pageIndex, pageSize))
        })
    }

    public injectStatus(statusList: Array<weightStatus>) {
        this._statusList = statusList
    }

    public mockDelete(key: string) {

    }

    public mockEdit({ key, ...rest }: EditParams) {

    }
}