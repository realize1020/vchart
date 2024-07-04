import request from '../utils/request.js'

export function mergeFile(data) {
  return request({
    url: '/api/uploader/mergeFile',
    method: 'post',
    data
  })
}

export function selectFileList(data) {
    return request({
      url: '/api/uploader/selectFileList',
      method: 'post',
      data
    })
}
export function deleteFile(data) {
    return request({
      url: '/api/uploader/deleteFile',
      method: 'post',
      data
    })
}
export function downloadByBlob(data){
    return request({
        method: 'post',
        url: '/api/uploader/download3?id='+data.id+'&filename='+encodeURIComponent(data.filename)+'&location='+encodeURIComponent(data.location),
        data,
        responseType: 'blob'
    })
}

