<template>
  <div class="test-table-wrap">
    <custom-columns :raw-table="defineTable" @save-table-data="saveTableData" />
    <table-wrap
      ref="tableWrap"
      :define-table="defineTable"
      :table-data.sync="tableData"
      :request-params.sync="requestParams"
      :request-config="requestConfig"
      :paging-config="pagingConfig"
    />
  </div>
</template>
<script>
import CustomColumns from 'components/common/CustomColumns'
import TableWrap from 'components/common/TableWrap'

export default {
  components: {
    CustomColumns,
    TableWrap,
  },

  data() {
    return {
      // 表格配置
      defineTable: [
        {
          // 表格定义
          label: '名字', // 标签名字
          prop: 'name', // 值的名字
          width: '100px', // 宽度
        },
        {
          label: '时间',
          custom: ({ row, index, filters }) => {
            // 自定义字段的值
            // console.log(row, index, filters);
            return filters.date(row.time, 'yyyy-mm-dd') // 使用filters的函数处理时间格式
          },
        },
        {
          // 定义为按钮
          label: '按钮',
          type: 'button', // 类型
          text: '按钮', // 按钮文字
          click: ({ row, index }) => {
            // 点击按钮回调
            console.log('点击了按钮', row, index)
            alert('点击了按钮')
          },
        },
        {
          // 定义为开关
          label: '开关',
          type: 'switch', // 类型
          model: 'isOpen', // 开关绑定的数据
          click: ({ row, index }) => {
            // 点击开关回调
            console.log('点击了开关', row, index)
            const tableData = JSON.parse(JSON.stringify(this.tableData))

            tableData[index].isOpen = !row.isOpen
            this.tableData = tableData
          },
        },
        {
          // 定义为操作列表
          label: '操作',
          fixed: 'right',
          handleList: [
            {
              label: '按钮1',
              type: 'button',
              text: '按钮1',
              click: ({ row, index }) => {
                console.log('点击了按钮1', row, index)
                alert('点击了按钮1')
              },
            },
            {
              label: '按钮2',
              type: 'button',
              text: '按钮2',
              click: ({ row, index }) => {
                console.log('点击了按钮2', row, index)
                alert('点击了按钮2')
              },
            },
          ],
        },
      ],
      tableData: [
        {
          // 表格数据
          id: '1',
          name: '表格测试',
          time: '2021/5/21 11:15',
          isOpen: true,
        },
      ],
      requestParams: {
        // 请求参数
        pageNum: 1,
        pageSize: 10,
        input: '',
        select: '',
        cascader: '',
        timePicker: '',
        datePicker: '',
        dateRangePicker: '',
      },
      requestConfig: {
        // 请求配置
        request: params => {
          // 请求接口（为mock数据，非真实接口）
          console.log('请求参数', params)
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const list = []

              for (let i = 0; i < params.pageSize; i++) {
                const item = JSON.parse(JSON.stringify(this.tableData[0]))

                item.name += params.pageNum
                list.push(item)
              }
              return resolve({
                code: 0,
                data: {
                  list,
                  pageInfo: {
                    total: 30,
                  },
                },
                message: '请求成功',
              })
            }, 500)
          })
        },
        render: true, // 是否开启渲染数据，不开启的话，在success函数里自行处理
        custom: res => {
          // 是否自定义渲染数据，不自定义的话，默认渲染res.data.list
          console.log('返回数据', res)
          return res.data.list
        },
        success: res => {
          // 请求成功回调
          console.log('请求成功', res)
        },
        fail: res => {
          // 请求失败回调
          console.log('请求失败', res)
        },
      },

      // 分页配置
      pagingConfig: {
        // 以下配置都是默认值
        // pagingShow: true, //是否显示分页
        // pageSizes: [10, 20, 50], //分页大小选择
        // pageSize: 'pageSize', //分页大小的key，根据requestParams
        // pageNum: 'pageNum', //分页页码的key，根据requestParams
        // total: (detail) => { //总数
        //     console.log(detail);
        //     let { pageInfo = {} } = detail;
        //     let { total } = pageInfo;
        //     return total;
        // },
      },
    }
  },

  mounted() {},

  methods: {
    saveTableData(defineTable) {
      defineTable.forEach((item, index) => {
        const { __hidden, fixed } = defineTable[index]
        this.$set(this.defineTable[index], '__hidden', __hidden)
        this.$set(this.defineTable[index], 'fixed', fixed)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';
</style>
