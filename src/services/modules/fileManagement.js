import services from 'services'

// 删除附件
export const fileDelete = params => {
  return services.API({
    url: '',
    method: 'get',
    params,
  })
}

// 附件列表
export const fileList = params => {
  return services.API({
    url: '',
    method: 'get',
    params,
  })
}

// 上传附件
export const fileUpload = params => {
  return services.API({
    url: '',
    method: 'post',
    params,
  })
}

// 上传附件-返回element-ui需要的参数
export const elFileUpload = params => {
  return {
    action: services.baseUrl + '',
    headers: services.headers,
    withCredentials: true,
  }
}
