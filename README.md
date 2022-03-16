# lite-mock

# 简介
用于表格mock数据，针对el-table-column配置项生成mock数据

# 用法

  1.将MockCenter挂载到根vue实例

    npm install -D lite-mock

    import MockCenter from 'lite-mock'

    Vue.user(MockCenter)
    
  2.通过MockCenter注册mock实例
    
      let mock = this.$mockCenter.register(
          name: string,
          {
              mockType,
              mockConfigs
          }
      )
    
    mockType为枚举值：
    
      MockType {
          ARRAY = 'array',
          OBJECT = 'object'
      }
    
    mockConfigs如下：
    
      [{
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
    
  3.mock实例提供了mockNetRes函数能够模拟增删改查
    
    mockNetRes(type: string, rest: MockActionParams = Object.create(null), key?: string): Promise<any>
    
    type为枚举类型，包含GET，DELETE， EDIT， ADD， rest相当于请求体，key用来标明主键字段，用于DELETE， EDIT，ADD

    当为type为GET时，rest只需要包含pageIndex，pageSize字段;
    
    当type为DELETE， EDIT， ADD时，需要指明key，ADD指明key是为了生成唯一的主键值
    
# API

  1.MockCenter支持注入字段生成器，injectGenerator(type: string, generator: Function)用于随机生成字段，type为字段类型，generator为生成字段的函数
  
    MockCenter原本提供了五种类型字段生成器
    
      {
          string: stringGenerator,
          number: numberGenerator,
          array: arrayGenerator,
          id: idGenerator,
          date: dateGenerator
      }
    
    
  2.Mock提供支持注入权重状态map列表，injectStatus(statusList: Array<weightStatus>)，可以按权重返回不同的状态码，默认状态码如下：
  
     [{
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
    
    
  
