export default {
  methods: {
    // 业务需求管理
    // 添加抄送人
    async productDemandAddRecipients(type, recipients = []) {
      const { toId: mainId } = this
      const params = {
        mainId,
        recipients,
        type,
      }
      const res = await this.$services.productDemandAddRecipients(params)
      if (!res.data) return
      this.alerts('抄送成功', 'success')
    },
    // 作废
    async businessCancel(bizDemandId, isList = false) {
      const h = this.$createElement
      const isConfirm = await this.isConfirm(
        h('div', null, [
          h('p', null, '您是否作废当前业务需求？'),
          h('p', null, '作废后，将清空所有的关联产品需求，作废后无法重启，请谨慎操作!'),
        ])
      )
      if (!isConfirm) return
      const res = await this.$services.bizDemandUpdateStatus({
        bizDemandId,
      })
      if (!res.data) return
      this.alerts('作废成功', 'success')
      if (isList) {
        this.search() && this.search()
      } else {
        this.$router.push('/businessManagement/list')
      }
    },
    // 业务需求权限控制
    businessPower(name) {
      // 需求解决状态:0待评估，10已接收，20已列入项目，30项目进行中，40已完成上线，-10被驳回，-20已作废
      const { statusGetPermission } = this
      const status = this.detail?.status
      const powerJson = {
        // 预期上线时间：当需求解决状态为“已接收”、“已列入项目”、“项目进行中”、“已完成上线”时，改需求，“已作废”会清空预期上线时间，所以不显示了
        planReleaseDate: () => {
          return [10, 20, 30, 40].includes(status)
        },
        // 驳回理由：当需求解决状态为“被驳回”、“已作废”时
        reason: () => {
          return [-10, -20].includes(status)
        },
        // 关联产品需求按钮：当需求解决状态为：已接收、已列入项目、项目进行中、已完成上线，当前登录账号为接收人或其上级时
        selectProductBusinessButton: () => {
          return statusGetPermission([10, 20, 30, 40], true)
        },
        // 关联产品需求清单：当需求解决状态为“被驳回”、“已接收”、“已列入项目”、“项目进行中”、“已完成上线”时
        selectProductBusiness: () => {
          return [10, 20, 30, 40, -10].includes(status)
        },
        // 项目发布时间：已列入项目、项目进行中、已完成上线
        endDate: () => {
          return [20, 30, 40].includes(status)
        },
        // 编辑作废：待评估、已接收、被驳回，当前登录账号为提交人或其所有上级
        editCancel: () => {
          return statusGetPermission([0, 10, -10])
        },
        // 编辑：待评估、已接收、被驳回，当前登录账号为提交人或其所有上级
        edit: () => {
          return statusGetPermission([0, 10, -10])
        },
        // 接受驳回转交：待评估、已接收、被驳回，当前登录账号为接收人或其所有上级
        agreeRejectTransfer: () => {
          return statusGetPermission([0, 10, -10], true)
        },
        // 接收禁用：已接收
        agreeDisabled: () => {
          return [10].includes(status)
        },
        // 驳回禁用：被驳回
        rejectDisabled: () => {
          return [-10].includes(status)
        },
      }
      const power = powerJson[name]

      return power && power()
    },
  },
}
