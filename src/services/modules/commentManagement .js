import services from 'services'

// 评论新增
export const commentAdd = params => {
  return services.API({
    url: '',
    method: 'post',
    params,
  })
}

// 评论列表
export const commentList = params => {
  return services.API({
    url: '',
    method: 'post',
    params,
  })
}
