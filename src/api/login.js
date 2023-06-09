import request from '../utils/request.js'
// export const login = (data) => {
//     return request({
//         method: 'post',
//         url:'/login',
//         data
//     }).then(res => {
//         console.log(res);
//     })
// }
export function login(data){
    return request({
        url: '/api/login',
        method: 'post',
        data
    })
}