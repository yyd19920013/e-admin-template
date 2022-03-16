<template>
  <div class="test-table-wrap">
    <search-wrap :define-search="defineSearch" :search-params="requestParams" :handler-config="handlerConfig" />
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
import SearchWrap from 'components/common/SearchWrap'
import TableWrap from 'components/common/TableWrap'

export default {
  components: {
    SearchWrap,
    TableWrap,
  },

  data() {
    return {
      // 搜索配置
      defineSearch: [
        // 搜索定义
        {
          // 定义为输入框
          type: 'input',
          model: 'input',
          label: '输入框：',
          attrs: {
            placeholder: '请输入内容',
          },
          methods: {
            input: val => {
              console.log('输入内容', val)
            },
          },
        },
        {
          // 定义为选择器
          type: 'select',
          model: 'select',
          label: '选择器：',
          options: [
            {
              label: '选项1',
              value: '1',
            },
            {
              label: '选项2',
              value: '2',
            },
          ],
          selectAttrs: {
            placeholder: '请选择内容',
          },
          selectMethods: {
            change: val => {
              console.log('内容改变', val)
            },
          },
          optionAttrs: {
            label: 'label',
            value: 'value',
          },
        },
        {
          // 定义为级联选择器
          type: 'cascader',
          model: 'cascader',
          label: '级联选择器：',
          options: [
            {
              value: 'zhinan',
              label: '指南',
              children: [
                {
                  value: 'shejiyuanze',
                  label: '设计原则',
                  children: [
                    {
                      value: 'yizhi',
                      label: '一致',
                    },
                    {
                      value: 'fankui',
                      label: '反馈',
                    },
                  ],
                },
                {
                  value: 'daohang',
                  label: '导航',
                  children: [
                    {
                      value: 'cexiangdaohang',
                      label: '侧向导航',
                    },
                    {
                      value: 'dingbudaohang',
                      label: '顶部导航',
                    },
                  ],
                },
              ],
            },
          ],
          attrs: {
            placeholder: '请选择内容',
          },
          methods: {
            change: val => {
              console.log('级联内容', val)
            },
          },
        },
        {
          // 定义为时间选择器
          type: 'timePicker',
          model: 'timePicker',
          label: '时间选择器：',
          pickerOptions: {
            selectableRange: '18:30:00 - 20:30:00',
          },
          attrs: {
            placeholder: '请选择时间',
            format: 'HH:mm:ss',
            'value-format': 'HH:mm:ss',
          },
          methods: {
            change: val => {
              console.log('选择时间', val)
            },
          },
        },
        {
          // 定义为日期选择器
          type: 'datePicker',
          model: 'datePicker',
          label: '日期选择器：',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now()
            },
            shortcuts: [
              {
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date())
                },
              },
              {
                text: '昨天',
                onClick(picker) {
                  const date = new Date()
                  date.setTime(date.getTime() - 3600 * 1000 * 24)
                  picker.$emit('pick', date)
                },
              },
              {
                text: '一周前',
                onClick(picker) {
                  const date = new Date()
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                  picker.$emit('pick', date)
                },
              },
            ],
          },
          attrs: {
            placeholder: '请选择日期',
            format: 'yyyy-MM-dd',
            'value-format': 'yyyy-MM-dd',
          },
          methods: {
            change: val => {
              console.log('选择日期', val)
            },
          },
        },
        {
          // 定义为日期范围选择器
          type: 'dateRangePicker',
          model: 'dateRangePicker',
          label: '范围选择器：',
          pickerOptions: {
            shortcuts: [
              {
                text: '最近一周',
                onClick(picker) {
                  const end = new Date()
                  const start = new Date()
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                  picker.$emit('pick', [start, end])
                },
              },
              {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date()
                  const start = new Date()
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                  picker.$emit('pick', [start, end])
                },
              },
              {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date()
                  const start = new Date()
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                  picker.$emit('pick', [start, end])
                },
              },
            ],
          },
          attrs: {
            type: 'datetimerange',
            format: 'yyyy-MM-dd',
            'value-format': 'yyyy-MM-dd',
            'range-separator': '至',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期',
            align: 'right',
          },
          methods: {
            change: val => {
              console.log('选择日期', val)
            },
          },
        },
      ],
      handlerConfig: {
        // 操作配置
        direction: 'auto',
        column: 3,
        handleList: [
          {
            text: '搜索',
            attrs: {
              type: 'primary',
            },
            methods: {
              click: () => {
                console.log('搜索')
                const { getTableData } = this.$refs.tableWrap

                getTableData()
              },
            },
          },
          {
            text: '重置',
            attrs: {
              plain: true,
            },
            methods: {
              click: () => {
                console.log('重置')
                const { resetParams, getTableData } = this.$refs.tableWrap

                resetParams()
                getTableData()
              },
            },
          },
        ],
      },

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

  methods: {},
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';
</style>
