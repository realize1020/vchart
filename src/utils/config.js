/**
 * 环境配置
 */
const env = 'development' // 项目运行环境
const EnvConfig = {
    development: { // 开发环境
        baseApi: 'http://localhost:8080',
        mockApi: ''
    },
    test: { // 测试环境
        baseApi: 'http://localhost:8080',
        mockApi: ''
    },
    production: { // 生产环境
        baseApi: 'http://localhost:8080',
        mockApi: ''
    },
}
export default {
    env,
    mock: false,
    ...EnvConfig[env] // 展开运算符，遍历EnvConfig的值，复制到当前对象里
}
