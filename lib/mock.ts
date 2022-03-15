import { ColumnConfigs, PageParams, ResponseData, weightStatus, MockType, MockActionParams } from './config'
import MockCenter from './mockCenter'
import { numberRandom, enumRandomByWeight } from './random'


const __statusList__: Array<weightStatus> = [{
    code: "00000",
    msg: '请求成功',
    weight: 10,
    success: true
}, {
    code: 200,
    msg: '请求成功',
    weight: 10,
    success: true
}, {
    code: 401,
    msg: '权限不足',
    weight: 10,
    success: false
}, {
    code: 403,
    msg: '服务器拒绝访问',
    weight: 10,
    success: false
}, {
    code: 404,
    msg: '没有找到资源',
    weight: 10,
    success: false
}, {
    code: 500,
    msg: '服务器内部错误',
    weight: 10,
    success: false
}, {
    code: 501,
    msg: '服务器不支持该请求中使用的方法',
    weight: 10,
    success: false
}, {
    code: 502,
    msg: '网关错误',
    weight: 10,
    success: false
}, {
    code: 504,
    msg: '网关超时',
    weight: 10,
    success: false
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


    constructor(type: MockType = MockType.ARRAY, configs: ColumnConfigs) {
        this._type = type
        this._configs = configs
        this._statusList = __statusList__
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

    private _mockResponse(successFunc: Function) {
        let resStateObj = enumRandomByWeight(this._statusList)
        let res = { ...resStateObj } as ResponseData
        if (res.success) {
            successFunc(res)
        }
        return res
    }

    private _mockDelete(key: string, rest: MockActionParams = Object.create(null)) {
        if (this._type !== MockType.ARRAY) {
            throw new Error("mockDelete只适用于array类型的mock");
        }
        let keys = this._configs.map(v => v.prop)
        if (!keys.includes(key)) {
            throw new Error(`对象不存在属性${key}`);
        }
        console.warn(`请确保属性${key}的值唯一`)
        return this._mockResponse(() => {
            let vals = this._mockListData.map(v => v[key])
            let value = rest[key]
            if (!value) {
                throw new Error(`参数中必须包含主键${key}`);
            }
            let index = vals.indexOf(value)
            if (index > -1) {
                this._mockListData.splice(index, 1)
            }
        })
    }

    private _mockEdit(key: string, rest: MockActionParams = Object.create(null)) {
        let keys = this._configs.map(v => v.prop)
        if (!keys.includes(key)) {
            throw new Error(`对象不存在属性${key}`);
        }
        console.warn(`请确保属性${key}的值唯一`)
        return this._mockResponse(() => {
            if (this._type === MockType.ARRAY) {
                let vals = this._mockListData.map(v => v[key])
                if (!rest[key]) {
                    throw new Error(`参数中必须包含主键${key}`);
                }
                let index = vals.indexOf(rest[key])
                if (index > -1) {
                    let obj = this._mockListData[index]
                    this._mockListData[index] = { ...obj, ...rest }
                }
            } else {
                throw new Error("当前暂不支持对象的编辑mock");
            }
        })
    }

    private _mockAdd(key: string, rest: MockActionParams = Object.create(null)) {
        let keys = this._configs.map(v => v.prop)
        if (!keys.includes(key)) {
            throw new Error(`对象不存在属性${key}`);
        }
        console.warn(`请确保属性${key}的值唯一`)
        return this._mockResponse(() => {
            if (this._type === MockType.ARRAY) {
                this._mockListData.push(Mock._mockObj(this._configs))
                let len = this._mockListData.length
                let obj = this._mockListData[len - 1]
                this._mockListData[len - 1] = { ...obj, ...rest }
            } else {
                throw new Error("当前暂不支持对象的编辑mock");
            }
        })
    }

    private _mockGet(rest: MockActionParams = Object.create(null)) {
        let { pageIndex, pageSize } = rest
        pageIndex = pageIndex || 1
        pageSize = pageSize || 10
        return this._mockResponse((res: ResponseData) => {
            res.data = {}
            if (this._type === MockType.ARRAY) {
                res.data.total = this._mockListData.length
                res.data.records = _paging(this._mockListData, { pageIndex, pageSize })
            } else {
                res.data = Mock._mockObj(this._configs)
            }
        })
    }


    public mockNetRes(type: string, rest: MockActionParams = Object.create(null), key?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (type === "GET") {
                let { pageIndex, pageSize } = rest
                resolve(this._mockGet({ pageIndex, pageSize }))
                return
            }
            if (type === "DELETE") {
                resolve(this._mockDelete(key || '', rest))
                return
            }
            if (type === 'EDIT') {
                resolve(this._mockEdit(key || '', rest))
                return
            }
            if (type === 'ADD') {
                resolve(this._mockAdd(key || '', rest))
                return
            }
        })
    }

    public injectStatus(statusList: Array<weightStatus>) {
        this._statusList = statusList
    }
}