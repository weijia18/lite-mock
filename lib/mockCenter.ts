import { ColumnConfigs, MockType, weightStatus } from './config'
import Mock from './mock'

export default class MockCenter {

    private _mockManagerMap: { [key: string]: any } = {}

    public register(
        name: string,
        {
            mockType,
            mockConfigs,
            mockStatusList
        }: {
            mockType: MockType,
            mockConfigs: ColumnConfigs,
            mockStatusList: Array<weightStatus>
        }
    ): Mock {
        let keys = Object.keys(this._mockManagerMap)
        if (keys.includes(name)) {
            return this._mockManagerMap[name]
        }
        this._mockManagerMap[name] = new Mock(mockType, mockConfigs, mockStatusList)
        return this._mockManagerMap[name]
    }

    public unRegister(name: string) {
        delete this._mockManagerMap[name]
    }

    public unRegisterAll() {
        this._mockManagerMap = {}
    }
}