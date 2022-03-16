import services from 'services'

// 获取免登信息
export const userInfor = params => {
  return services.API({
    url: '',
    method: 'get',
    noInterrupt: true,
    params,
  })
}

// 退出登陆并返回一个登录地址
export const userOut = params => {
  return services.baseUrl + ''
}

// 跳转到登录页面
export const userRedirect = params => {
  return services.baseUrl + ''
}

// 获取用户信息
export const accountGet = params => {
  return services.API({
    url: '',
    method: 'get',
    noInterrupt: true,
    params,
  })
}

// 查询员工信息（普通员工）
export const userGet = params => {
  return services.API({
    url: '',
    method: 'get',
    noInterrupt: true,
    params,
  })
}

// 查询我的所有上级
/*
account 花名拼音
*/
export const getAllSuperiorByAccount = params => {
  return services.API({
    url: '',
    method: 'get',
    noHint: true,
    noInterrupt: true,
    params,
  })
}

// 查询我的所有下属
/*
account 花名拼音
isLeave 是否离职，默认false
*/
export const getAllByAccount = params => {
  return services.API({
    url: '',
    method: 'get',
    noHint: true,
    noInterrupt: true,
    params,
  })
}

// 获取部门组织树（缓存）
/*
groupId 部门id
includeDeleted
*/
export const getGroupListTree = params => {
  return services.API({
    url: '',
    method: 'get',
    noHint: true,
    noInterrupt: true,
    params,
  })
}

// 查询部门在职员工
/*
groupId 部门id
*/
export const getByGroup = params => {
  return services.API({
    url: '',
    method: 'get',
    noHint: true,
    noInterrupt: true,
    params,
  })
}

// 查询部门在职员工(含子部门)
/*
groupId 部门id
*/
export const getAllByGroup = params => {
  return services.API({
    url: '',
    method: 'get',
    noHint: true,
    noInterrupt: true,
    params,
  })
}

// 姓名、花名、拼音、工号模糊查询
/*
keyword 姓名、花名、拼音、手机号
needRole true:返回权限信息
*/
export const searchByKeyword = params => {
  return services.API({
    url: '',
    method: 'get',
    noHint: true,
    noMask: true,
    noInterrupt: true,
    params,
  })
}

// 获取权限菜单
/*
  account yuankai 花名拼音
  appId budget 应用id
*/
export const menuTree = params => {
  return services.API({
    url: '',
    method: 'get',
    noInterrupt: true,
    params,
  })
}

// 业务域列表
export const bizDomainList = params => {
  return services.API({
    url: '',
    method: 'get',
    noInterrupt: true,
    params,
  })
}

// 产品线列表
export const productLineList = params => {
  return services.API({
    url: '',
    method: 'get',
    noInterrupt: true,
    params,
  })
}

// 获取角色职能
export const getJobFuntion = params => {
  return services.API({
    url: '',
    method: 'get',
    noInterrupt: true,
    params,
  })
}
