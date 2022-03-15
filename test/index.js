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
}, {
    type: 'id',
    prop: 'id'
}]

const statuses = [{
    code: "00000",
    msg: '请求成功',
    weight: 1000,
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

const mockCenter = new MockCenter()
const mock = mockCenter.register("test", {
    mockType: 'array',
    mockConfigs: configs,
    mockStatusList: statuses
})
mock.injectStatus(statuses)
console.log(mock.mockNetRes("GET"))
console.log(mock.mockNetRes("DELETE", {
    id: 23
}, 'id'))
console.log(mock.mockNetRes("GET"))