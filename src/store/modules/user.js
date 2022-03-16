const state = {
  userInfo: {}, // 用户信息
  superior: [], // 用户上级
  subordinate: [], // 用户下级
  menuTree: [], // 菜单树
  buttonList: [], // 按钮权限
  persons: [], // 公司成员
  accountPersonsJson: {}, // 公司成员账号字典
  namePersonsJson: {}, // 公司成员花名字典
  groupListTree: [], // 部门树
  groupListTreeFlat: [], // 拍平的部门列表
  groupListTreeFlatFilter: [], // 拍平的部门列表（不包含已删除）
  bizDomainList: [], // 业务域
  productLineList: [], // 产品线
  firstGroupPersons: {}, // 公司级部门成员
  departmentMemberList: [], // 用户部门成员
  jobFuntion: {}, // 角色职能
  cacheData: {}, // 缓存的页面列表参数数据
  projectIdJson: {}, // 项目id对应项目的字典
  projectNameJson: {}, // 项目name对应项目的字典
}

const mutations = {
  CHANGE_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  CHANGE_SUPERIOR: (state, superior) => {
    state.superior = superior
  },
  CHANGE_SUBORDINATE: (state, subordinate) => {
    state.subordinate = subordinate
  },
  CHANGE_MENU_TREE: (state, { menuTree, buttonList }) => {
    state.menuTree = menuTree
    state.buttonList = buttonList
  },
  CHANGE_PERSONS: (state, { persons, accountPersonsJson, namePersonsJson }) => {
    state.persons = persons
    state.accountPersonsJson = accountPersonsJson
    state.namePersonsJson = namePersonsJson
  },
  CHANGE_GROUP_LIST_TREE: (state, { groupListTree, groupListTreeFlat, groupListTreeFlatFilter }) => {
    state.groupListTree = groupListTree
    state.groupListTreeFlat = groupListTreeFlat
    state.groupListTreeFlatFilter = groupListTreeFlatFilter
  },
  CHANGE_BIZ_DOMAIN_LIST: (state, bizDomainList) => {
    state.bizDomainList = bizDomainList
  },
  CHANGE_PRODUCT_LINE_LIST: (state, productLineList) => {
    state.productLineList = productLineList
  },
  CHANGE_FIRST_GROUP_PERSONS: (state, firstGroupPersons) => {
    state.firstGroupPersons = firstGroupPersons
  },
  CHANGE_DEPARTMENT_MEMBER_LIST: (state, departmentMemberList) => {
    state.departmentMemberList = departmentMemberList
  },
  CHANGE_JOBFUNTION: (state, jobFuntion) => {
    state.jobFuntion = jobFuntion
  },
  CHANGE_CACHEDATA: (state, cacheData) => {
    state.cacheData = cacheData
  },
  CHANGE_PROJECT_JSON: (state, { projectIdJson, projectNameJson }) => {
    state.projectIdJson = Object.assign(state.projectIdJson, projectIdJson)
    state.projectNameJson = Object.assign(state.projectNameJson, projectNameJson)
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
