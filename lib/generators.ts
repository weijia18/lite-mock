import DayJs from 'dayjs'

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

const map: { [key: string]: Function } = {
    'id': idGenerator,
    'date': dateGenerator
}

export default map