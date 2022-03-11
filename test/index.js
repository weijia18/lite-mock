'use strict';

const {
    default: MockCenter
} = require("../dist/mockCenter")

const configs = [{
    type: 'string',
    prop: 'name'
}, {
    type: 'array',
    prop: 'tags'
}, {
    type: 'number',
    prop: 'count'
}]

const statuses = [{
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

const mockCenter = new MockCenter()
const mock = mockCenter.register("test", {
    mockType: 'array',
    mockConfigs: configs,
    mockStatusList: statuses
})
console.log(mock.mockNetRes())