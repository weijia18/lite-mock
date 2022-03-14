import DayJs from 'dayjs'
import { numberRandom, stringRandom } from './random'
import { ColumnConfig } from './config'
import Mock from './mock'

const idGenerator = (() => {
    let seed = 1
    const _idGenerator = () => {
        return seed++
    }
    return _idGenerator
})()

const dateGenerator = (() => {
    let seed = 1
    const _dateGenerator = () => {
        return DayJs().add(-(seed++), 'day').format("YYYY-MM-DD")
    }
    return _dateGenerator
})()

function numberGenerator(config: ColumnConfig): number {
    let { numberMinNum, numberMaxNum } = config
    let n = numberRandom(numberMinNum || 1, numberMaxNum || 100)
    return n
}


function stringGenerator(config: ColumnConfig): string {
    let { stringMinNum, stringMaxNum } = config
    let n = numberRandom(stringMinNum, stringMaxNum)
    return stringRandom(n)
}

function arrayGenerator(config: ColumnConfig): Array<any> {
    let { arrayMinNum, arrayMaxNum, children } = config
    let n = numberRandom(arrayMinNum || 1, arrayMaxNum || 100)
    let list = [];
    for (let i = 0; i < n; i++) {
        if (children) {
            list.push(Mock._mockObj(children));
        } else {
            list.push(numberRandom(1, 100))
        }
    }
    return list;
}

const map: { [key: string]: Function } = {
    string: stringGenerator,
    number: numberGenerator,
    array: arrayGenerator,
    id: idGenerator,
    date: dateGenerator
}

export default map