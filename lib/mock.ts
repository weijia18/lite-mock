import { columnConfigs, columnConfig, PageParams } from './config'
import { numberRandom, stringRandom } from './random'


export default class Mock {

    _configs: columnConfigs

    _randomActionMap = {
        'string': this._stringRandom,
        'number': this._numberRandom,
        'array': this._arrayRandom
    };

    constructor(configs: columnConfigs) {
        this._configs = configs
    }

    _mockObj() {
        let obj: any = {}
        this._configs.forEach(config => {
            obj[config.prop] = _randomActionMap[config.type]
        })
    }

    _stringRandom(config: columnConfig) {
        let arr = []
        let { stringMinNum, stringMaxNum } = config
        let n = numberRandom(stringMinNum, stringMaxNum)
        for (let i = 0; i < n; i++) {
            let str
            //汉字对应的unicode编码为u4e00-u9fa5转为10进制为19968-40869，先取随机数，再转为16进制
            str = '\\u' + (Math.floor(Math.random() * (40869 - 19968)) + 19968).toString(16)
            //在用正则操作数据后进行解码。注意：unescape() 函数在 JavaScript 1.5 版中已弃用。请使用 decodeURI() 或 decodeURIComponent() 代替。
            str = unescape(str.replace(/\\u/g, "%u"));
            arr.push(str)
        }
        let chinese = arr.join("")
        return chinese
    }

    _numberRandom(config: columnConfig) {
        let { numberMinNum, numberMaxNum } = config
        let n = numberRandom(numberMinNum, numberMaxNum)
        return n
    }

    _arrayRandom(config: columnConfig) {
        let n = config.arrayRandomNum || 10
        let list = [];
        for (let i = 0; i < n; i++) {
            list.push(mockObj(config) || stringRandom(10));
        }
        return list;
    }

    paging(list: Array<any>, pageParams: PageParams) {
        let { pageIndex, pageSize } = pageParams
        let beginIndex = (pageIndex - 1) * pageSize
        let endIndex = pageIndex * pageSize
        return list.slice(beginIndex, endIndex)
    }
}