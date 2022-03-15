import { ColumnConfigs, MockType } from './config'
import Mock from './mock'
import { VueConstructor } from 'vue/types/vue';
import generatorMap from './generators'


export default class MockCenter {

    private _mockManagerMap: { [key: string]: any } = Object.create(null)
    static __randomActionMap__: { [key: string]: any } = Object.create(null)


    constructor() {
        let keys = Object.keys(generatorMap).filter(v => generatorMap.hasOwnProperty(v))
        keys.forEach(key => {
            MockCenter.__randomActionMap__[key] = generatorMap[key]
        })
    }

    static install(Vue: VueConstructor) { }

    public register(
        name: string,
        {
            mockType,
            mockConfigs
        }: {
            mockType: MockType,
            mockConfigs: ColumnConfigs
        }
    ): Mock {
        let keys = Object.keys(this._mockManagerMap)
        if (keys.includes(name)) {
            return this._mockManagerMap[name]
        }
        this._mockManagerMap[name] = new Mock(mockType, mockConfigs)
        return this._mockManagerMap[name]
    }

    public unRegister(name: string) {
        delete this._mockManagerMap[name]
    }

    public unRegisterAll() {
        this._mockManagerMap = {}
    }

    public getMockInstance(name: string) {
        if (!this._mockManagerMap[name]) {
            throw new Error(`不存在名称为${name}的mock实例`);
        }
        return this._mockManagerMap[name]
    }

    public injectGenerator(type: string, generator: Function) {
        let keys = Object.keys(MockCenter.__randomActionMap__)
        if (keys.includes(type)) {
            throw new Error('已包含类型为${type}的生成器，请更换类型名称')
        }
        MockCenter.__randomActionMap__[type] = generator
    }
}