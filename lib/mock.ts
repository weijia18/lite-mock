import { ColumnConfigs, ColumnConfig, PageParams, ResponseData, weightStatus, MockType } from './config'
import { numberRandom, stringRandom, enumRandomByWeight } from './random'
import generatorMap from './generators'


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

function _stringRandom(config: ColumnConfig): string {
    let { stringMinNum, stringMaxNum } = config
    let n = numberRandom(stringMinNum, stringMaxNum)
    return stringRandom(n)
}

function _numberRandom(config: ColumnConfig): number {
    let { numberMinNum, numberMaxNum } = config
    let n = numberRandom(numberMinNum || 1, numberMaxNum || 100)
    return n
}

function _arrayRandom(config: ColumnConfig): Array<any> {
    let { arrayMinNum, arrayMaxNum, children } = config
    let n = numberRandom(arrayMinNum || 1, arrayMaxNum || 100)
    let list = [];
    for (let i = 0; i < n; i++) {
        if (children) {
            list.push(_mockObj(children));
        } else {
            list.push(numberRandom(1, 100))
        }
    }
    return list;
}

function _mockObj(configs: ColumnConfigs): { [key: string]: any } {
    let obj: { [key: string]: any } = {}
    configs.forEach(config => {
        obj[config.prop] = __randomActionMap__[config.type](config)
    })
    return obj
}

function _paging(list: Array<{ [key: string]: any }>, pageParams: PageParams): Array<{ [key: string]: any }> {
    let { pageIndex, pageSize } = pageParams
    let beginIndex = (pageIndex - 1) * pageSize
    let endIndex = pageIndex * pageSize
    return list.slice(beginIndex, endIndex)
}

const __randomActionMap__: { [key: string]: any } = {
    string: _stringRandom,
    number: _numberRandom,
    array: _arrayRandom
};
export default class Mock {

    private _mockListData: Array<{ [key: string]: any }> = []
    private _type: string
    private _configs: ColumnConfigs
    private _statusList: Array<weightStatus>
    private _injectFlagMap: { [key: string]: boolean } = {}

    constructor(type: MockType = MockType.ARRAY, configs: ColumnConfigs, statusList: Array<weightStatus> = __statusList__) {
        this._type = type
        this._configs = configs
        this._statusList = statusList
        if (this._type === MockType.ARRAY) {
            this._mockListData = this._mockList(configs)
        }
        let types = Object.keys(generatorMap).filter(key => generatorMap.hasOwnProperty(key))
        types.forEach(type => {
            this._injectFlagMap[type] = false
        })
    }

    private _mockList(configs: ColumnConfigs, listMaxNum: number = 200): Array<{ [key: string]: any }> {
        let obj: { [key: string]: any } = {}
        let injectTypes = Object.keys(this._injectFlagMap).filter(key => this._injectFlagMap.hasOwnProperty(key) && this._injectFlagMap[key]).map(key => `___${key}___`)
        configs.forEach(config => {
            if (injectTypes.includes(config.prop)) {
                throw new Error(`当前配置prop属性值：${config.prop}与注入的属性重名`);
            }
            obj[config.prop] = __randomActionMap__[config.type](config)
        })
        let n = numberRandom(listMaxNum)
        let list: Array<{ [key: string]: any }> = []
        for (let i = 0; i < n; i++) {
            list.push(_mockObj(configs))
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
            res.data = _mockObj(this._configs)
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

    public inject(type: string = 'id') {
        let types = Object.keys(generatorMap).filter(key => generatorMap.hasOwnProperty(key))
        if (this._type !== 'array') {
            return
        }
        if (!types.includes(type)) {
            throw new Error(`mock对象不支持inject参数type为${type}`)
        }
        this._mockListData.forEach(v => {
            v[`___${type}___`] = generatorMap[type]()
        })
        this._injectFlagMap[type] = true
    }
}