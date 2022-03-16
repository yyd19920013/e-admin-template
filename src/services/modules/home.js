import services from 'services'

// 首页
export const home = params => {
  return services.API({
    url: '',
    method: 'post',
    params,
  })
}
