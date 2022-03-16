<template>
  <div class="search-wrap">
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
        {
          // 定义为选择器
          type: 'select',
          model: 'docType',
          label: '配置类型：',
          options: [
            {
              label: '搜索定义(defineSearch:Array)',
              value: 'defineSearch',
            },
            {
              label: '搜索请求参数(searchParams:Object)',
              value: 'searchParams',
            },
            {
              label: '搜索操作配置(handlerConfig:Object)',
              value: 'handlerConfig',
            },
          ],
          selectAttrs: {
            placeholder: '请选择内容',
          },
          selectMethods: {
            change: val => {
              const { getTableData } = this.$refs.tableWrap

              getTableData()
            },
          },
          optionAttrs: {
            label: 'label',
            value: 'value',
          },
        },
      ],
      handlerConfig: {
        // 操作配置
        direction: 'auto',
        column: 3,
        handleList: [],
      },

      // 表格配置
      defineTable: [
        {
          // 表格定义
          label: '参数',
          prop: 'param',
        },
        {
          label: '说明',
          prop: 'desc',
        },
        {
          label: '类型',
          prop: 'type',
        },
        {
          label: '可选值',
          prop: 'option',
        },
        {
          label: '默认值',
          prop: 'default',
        },
        {
          width: '80px',
          label: 'pre格式',
          type: 'switch',
          model: 'isOpen',
          click: ({ row, index }) => {
            const lastItem = this.defineTable[this.defineTable.length - 1]
            const type = lastItem.type != 'pre' ? 'pre' : ''

            this.defineTable[this.defineTable.length - 1].type = type
            this.tableData = JSON.parse(JSON.stringify(this.tableData)).map(item => {
              item.isOpen = type == 'pre'

              return item
            })
          },
        },
        {
          width: '400px',
          label: '示例',
          prop: 'example',
        },
      ],
      tableData: [],
      defineSearchList: [
        {
          param: 'label',
          desc: '标签文本',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        label: '输入框：'
                   `,
        },
        {
          param: 'type',
          desc: '展示的控件类型',
          type: 'string',
          option: 'input / select / cascader / timePicker / datePicker / dateRangePicker',
          default: '-',
          example: `
                        type: 'input'
                   `,
        },
        {
          param: 'model',
          desc: '绑定值的字段，根据searchParams里的字段',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        model: 'input'
                   `,
        },
        {
          param: 'attrs',
          desc: '等同element组件的Attributes的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        attrs: {
                            placeholder: '请输入内容',
                        }
                   `,
        },
        {
          param: 'methods',
          desc: '等同element组件的Events的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        methods: {
                            input: (val) => {
                                console.log('输入内容', val);
                            }
                        }
                   `,
        },
        {
          param: '（type:input）model',
          desc: '输入框绑定字段',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        model: 'input'
                   `,
        },
        {
          param: '（type:input）attrs',
          desc: '等同element组件的Input Attributes的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        attrs: {
                            placeholder: '请输入内容',
                        }
                   `,
        },
        {
          param: '（type:input）methods',
          desc: '等同element组件的Input Events的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        methods: {
                            input: (val) => {
                                console.log('输入内容', val);
                            },
                        }
                   `,
        },
        {
          param: '（type:select）model',
          desc: '选择器绑定字段',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        model: 'select'
                   `,
        },
        {
          param: '（type:select）options',
          desc: '选择器选项',
          type: 'array',
          option: '-',
          default: '-',
          example: `
                        options: [{
                                label: '选项1',
                                value: '1',
                            }
                        ]
                   `,
        },
        {
          param: '（type:select）selectAttrs',
          desc: '等同element组件的Select Attributes的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        selectAttrs: {
                            placeholder: '请选择内容',
                        }
                   `,
        },
        {
          param: '（type:select）selectMethods',
          desc: '等同element组件的Select Events的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        selectMethods: {
                            change: (val) => {
                                console.log('内容改变', val);
                            },
                        }
                   `,
        },
        {
          param: '（type:select）optionAttrs',
          desc: '等同element组件的Option Attributes的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        optionAttrs: {
                            label: 'label',
                            value: 'value',
                        }
                   `,
        },
        {
          param: '（type:cascader）model',
          desc: '级联选择器绑定字段',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        model: 'cascader'
                   `,
        },
        {
          param: '（type:cascader）options',
          desc: '级联选择器选项',
          type: 'array',
          option: '-',
          default: '-',
          example: `
                        options: [{
                            value: 'zhinan',
                            label: '指南',
                            children: [{
                                value: 'shejiyuanze',
                                label: '设计原则',
                                children: [{
                                    value: 'yizhi',
                                    label: '一致'
                                }, {
                                    value: 'fankui',
                                    label: '反馈'
                                }]
                            }, {
                                value: 'daohang',
                                label: '导航',
                                children: [{
                                    value: 'cexiangdaohang',
                                    label: '侧向导航'
                                }, {
                                    value: 'dingbudaohang',
                                    label: '顶部导航'
                                }]
                            }]
                        }]
                   `,
        },
        {
          param: '（type:cascader）attrs',
          desc: '等同element组件的Cascader Attributes的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        attrs: {
                            placeholder: '请选择内容',
                        }
                   `,
        },
        {
          param: '（type:cascader）methods',
          desc: '等同element组件的Cascader Events的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        methods: {
                            change: (val) => {
                                console.log('级联内容', val);
                            },
                        }
                   `,
        },
        {
          param: '（type:timePicker）model',
          desc: '时间选择器绑定字段',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        model: 'timePicker'
                   `,
        },
        {
          param: '（type:timePicker）pickerOptions',
          desc: '时间选择器选项',
          type: 'array',
          option: '-',
          default: '-',
          example: `
                        pickerOptions: {
                            selectableRange: '18:30:00 - 20:30:00'
                        }
                   `,
        },
        {
          param: '（type:timePicker）attrs',
          desc: '等同element组件的TimePicker Attributes的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        attrs: {
                            placeholder: '请选择时间',
                            format: 'HH:mm:ss',
                            'value-format': 'HH:mm:ss',
                        }
                   `,
        },
        {
          param: '（type:timePicker）methods',
          desc: '等同element组件的TimePicker Events的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        methods: {
                            change: (val) => {
                                console.log('选择时间', val);
                            }
                        }
                   `,
        },
        {
          param: '（type:datePicker）model',
          desc: '日期选择器绑定字段',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        model: 'datePicker'
                   `,
        },
        {
          param: '（type:datePicker）pickerOptions',
          desc: '日期选择器选项',
          type: 'array',
          option: '-',
          default: '-',
          example: `
                        pickerOptions: {
                            disabledDate(time) {
                                return time.getTime() > Date.now();
                            },
                            shortcuts: [{
                                text: '今天',
                                onClick(picker) {
                                    picker.$emit('pick', new Date());
                                }
                            }, {
                                text: '昨天',
                                onClick(picker) {
                                    const date = new Date();
                                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                                    picker.$emit('pick', date);
                                }
                            }, {
                                text: '一周前',
                                onClick(picker) {
                                    const date = new Date();
                                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                                    picker.$emit('pick', date);
                                }
                            }]
                        }
                   `,
        },
        {
          param: '（type:datePicker）attrs',
          desc: '等同element组件的DatePicker Attributes的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        attrs: {
                            placeholder: '请选择日期',
                            format: 'yyyy-MM-dd',
                            'value-format': 'yyyy-MM-dd',
                        }
                   `,
        },
        {
          param: '（type:datePicker）methods',
          desc: '等同element组件的DatePicker Events的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        methods: {
                            change: (val) => {
                                console.log('选择日期', val);
                            }
                        }
                   `,
        },
        {
          param: '（type:dateRangePicker）model',
          desc: '范围选择器绑定字段',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        model: 'dateRangePicker'
                   `,
        },
        {
          param: '（type:dateRangePicker）pickerOptions',
          desc: '范围选择器选项',
          type: 'array',
          option: '-',
          default: '-',
          example: `
                        pickerOptions: {
                            shortcuts: [{
                                text: '最近一周',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近一个月',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近三个月',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                    picker.$emit('pick', [start, end]);
                                }
                            }]
                        }
                   `,
        },
        {
          param: '（type:dateRangePicker）attrs',
          desc: '等同element组件的DateTimePicker Attributes的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        attrs: {
                            type: 'datetimerange',
                            format: 'yyyy-MM-dd',
                            'value-format': 'yyyy-MM-dd',
                            'range-separator': '至',
                            'start-placeholder': '开始日期',
                            'end-placeholder': '结束日期',
                            'align': 'right',
                        }
                   `,
        },
        {
          param: '（type:dateRangePicker）methods',
          desc: '等同element组件的DateTimePicker Events的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        methods: {
                            change: (val) => {
                                console.log('选择日期', val);
                            },
                        }
                   `,
        },
      ],
      searchParamsList: [
        {
          param: 'searchParams',
          desc: '搜索请求绑定数据',
          type: 'Array',
          option: '-',
          default: '-',
          example: `
                        :searchParams"requestParams"
                        requestParams: {
                            pageNum: 1,
                            pageSize: 10,
                            input: '',
                            select: '',
                            cascader: '',
                            timePicker: '',
                            datePicker: '',
                            dateRangePicker: '',
                        }
                   `,
        },
      ],
      handlerConfigList: [
        {
          param: 'direction',
          desc: '搜索操作按钮的方向，为oneLine时在右侧',
          type: 'string',
          option: 'auto / oneLine / left / center / right',
          default: 'auto',
          example: `
                        direction: 'auto'
                   `,
        },
        {
          param: 'column',
          desc: '搜索控件一行展示几列',
          type: 'number',
          option: '1 - 10',
          default: '3',
          example: `
                        column: 3
                   `,
        },
        {
          param: 'handleList',
          desc: '搜索控件操作列表定义',
          type: 'array',
          option: '-',
          default: '-',
          example: `
                        handleList: [{
                                text: '搜索',
                                attrs: {
                                    type: 'primary',
                                },
                                methods: {
                                    click: () => {
                                        console.log('搜索');
                                        let { getTableData } = this.$refs.tableWrap;

                                        getTableData();
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
                                        console.log('重置');
                                        let { resetParams, getTableData } = this.$refs.tableWrap;

                                        resetParams();
                                        getTableData();
                                    },
                                },
                            },
                        ]
                   `,
        },
        {
          param: 'handleList[index].text',
          desc: '按钮的文字',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        text: '搜索'
                   `,
        },
        {
          param: 'handleList[index].attrs',
          desc: '等同element组件的Button Attributes的用法',
          type: 'object',
          option: '-',
          default: '-',
          example: `
                        attrs: {
                            type: 'primary',
                        }
                   `,
        },
        {
          param: 'handleList[index].methods',
          desc: '等同element组件的Button Events的用法',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        methods: {
                            click: () => {
                                let { getTableData } = this.$refs.tableWrap;

                                getTableData();
                            },
                        }
                   `,
        },
      ],
      requestParams: {
        // 请求参数
        pageNum: 1,
        pageSize: 10,
        docType: 'defineSearch',
      },
      requestConfig: {
        // 请求配置
        request: params => {
          // 请求接口（为mock数据，非真实接口）
          console.log('请求参数', params)
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const { defineSearchList = [], searchParamsList = [], handlerConfigList = [] } = this
              const listJson = {
                defineSearch: defineSearchList,
                searchParams: searchParamsList,
                handlerConfig: handlerConfigList,
              }
              const list = listJson[this.requestParams.docType] || []
              const { pageSize, pageNum } = params
              const start = (pageNum - 1) * pageSize
              const end = start + pageSize
              const pagingList = list.slice(start, end)

              this.defineTable[this.defineTable.length - 1].type = ''
              return resolve({
                code: 0,
                data: {
                  list: pagingList,
                  pageInfo: {
                    total: list.length,
                  },
                },
                message: '请求成功',
              })
            })
          })
        },
      },

      // 分页配置
      pagingConfig: {
        // 以下配置都是默认值
        pageSizes: [5, 10, 20, 50], // 分页大小选择
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
