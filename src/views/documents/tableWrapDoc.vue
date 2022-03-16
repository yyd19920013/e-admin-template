<template>
  <div class="table-wrap-doc">
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
              label: '表格定义(defineTable:Array)',
              value: 'defineTable',
            },
            {
              label: '表格数据(tableData:Array)',
              value: 'tableData',
            },
            {
              label: '请求接口参数(requestParams:Object)',
              value: 'requestParams',
            },
            {
              label: '请求接口配置(requestConfig:Object)',
              value: 'requestConfig',
            },
            {
              label: '分页配置(pagingConfig:Object)',
              value: 'pagingConfig',
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
      defineTableList: [
        {
          param: 'width',
          desc: '标签宽度',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        width: '200px'
                   `,
        },
        {
          param: 'label',
          desc: '标签文本',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        label: '名字'
                   `,
        },
        {
          param: 'prop',
          desc: '字段取值',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        prop: 'name'
                   `,
        },
        {
          param: 'custom',
          desc: '自定义取值',
          type: 'function',
          option: '-',
          default: '-',
          example: `
                        custom: ({ row, index, filters }) => {
                            return filters.date(row.time, 'yyyy-mm-dd');
                        }
                   `,
        },
        {
          param: 'type',
          desc: '展示为控件类型',
          type: 'string',
          option: 'button / switch',
          default: '-',
          example: `
                        type: 'button'
                   `,
        },
        {
          param: '（type:button）text',
          desc: '按钮文字',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        text: '按钮'
                   `,
        },
        {
          param: '（type:button）click',
          desc: '按钮点击',
          type: 'function',
          option: '-',
          default: '-',
          example: `
                        click: ({ row, index }) => {
                            console.log('点击了按钮', row, index);
                        },
                   `,
        },
        {
          param: '（type:switch）model',
          desc: '绑定字段',
          type: 'string',
          option: '-',
          default: '-',
          example: `
                        model: 'isOpen'
                   `,
        },
        {
          param: '（type:switch）click',
          desc: '开关点击',
          type: 'function',
          option: '-',
          default: '-',
          example: `
                        click: ({ row, index }) => {
                            console.log('点击了开关', row, index);
                            let tableData = JSON.parse(JSON.stringify(this.tableData));

                            tableData[index].isOpen = !row.isOpen;
                            this.tableData = tableData;
                        }
                   `,
        },
        {
          param: 'handleList',
          desc: '操作列表定义',
          type: 'array',
          option: '-',
          default: '-',
          example: `
                        handleList: [
                            {
                                label: '按钮1',
                                type: 'button',
                                text: '按钮1',
                                click: ({ row, index }) => {
                                    console.log('点击了按钮1', row, index);
                                }
                            }
                        ]
                   `,
        },
      ],
      tableDataList: [
        {
          param: 'tableData.sync',
          desc: 'table表格绑定数据，请使用.sync修饰符进行数据同步',
          type: 'Array',
          option: '-',
          default: '-',
          example: `
                        :tableData.sync="tableData"
                        tableData: [{
                            param: 'tableData.sync',
                            desc: 'table表格绑定数据，请使用.sync修饰符进行数据同步',
                            type: 'Array',
                            option: '-',
                            default: '-',
                            example: '',
                        }]
                   `,
        },
      ],
      requestParamsList: [
        {
          param: 'requestParams.sync',
          desc: 'request请求绑定数据，请使用.sync修饰符进行数据同步',
          type: 'Array',
          option: '-',
          default: '-',
          example: `
                        :requestParams.sync="requestParams"
                        requestParams: {
                            pageNum: 1,
                            pageSize: 10,
                            docType: 'defineTable',
                        }
                   `,
        },
      ],
      requestConfigList: [
        {
          param: 'request',
          desc: '请求接口，promise方式',
          type: 'function',
          option: '-',
          default: '-',
          example: `
                        request: (params) => { //仅为参考
                            return new Promise((resolve, reject) => {
                                return resolve({
                                    code: 0,
                                    data: {
                                        list,
                                        pageInfo: {
                                            total: 100
                                        },
                                    },
                                    message: '请求成功'
                                });
                            });
                        }
                   `,
        },
        {
          param: 'render',
          desc: '是否开启渲染数据，不开启的话，在success函数里自行处理',
          type: 'boolean',
          option: '-',
          default: 'true',
          example: `
                        render: true
                   `,
        },
        {
          param: 'custom',
          desc: '是否自定义渲染数据，不自定义的话，默认渲染res.data.list',
          type: 'function',
          option: '-',
          default: '-',
          example: `
                        custom: (res) => {
                            return res.data.list;
                        }
                   `,
        },
        {
          param: 'success',
          desc: '请求成功回调',
          type: 'function',
          option: '-',
          default: '-',
          example: `
                        success: (res) => {
                            console.log('请求成功', res);
                        }
                   `,
        },
        {
          param: 'fail',
          desc: '请求失败回调',
          type: 'function',
          option: '-',
          default: '-',
          example: `
                        fail: (res) => { //请求失败回调
                            console.log('请求失败', res);
                        }
                   `,
        },
      ],
      pagingConfigList: [
        {
          param: 'pagingShow',
          desc: '是否显示分页',
          type: 'boolean',
          option: '-',
          default: 'true',
          example: `
                        pagingShow: true
                   `,
        },
        {
          param: 'pageSizes',
          desc: '分页大小选择',
          type: 'array',
          option: '-',
          default: '[10, 20, 50]',
          example: `
                        pageSizes: [10, 20, 50]
                   `,
        },
        {
          param: 'pageSize',
          desc: '分页大小字段，根据requestParams里的字段',
          type: 'string',
          option: '-',
          default: 'pageSize',
          example: `
                        pageSize: 'pageSize'
                   `,
        },
        {
          param: 'pageNum',
          desc: '分页页码字段，根据requestParams里的字段',
          type: 'string',
          option: '-',
          default: 'pageNum',
          example: `
                        pageNum: 'pageNum'
                   `,
        },
        {
          param: 'total',
          desc: '总数自定义取值',
          type: 'function',
          option: '-',
          default: 'res.pageInfo.total',
          example: `
                        total: (detail) => {
                            let { pageInfo = {} } = detail;
                            let { total } = pageInfo;

                            return total;
                        }
                   `,
        },
      ],
      requestParams: {
        // 请求参数
        pageNum: 1,
        pageSize: 10,
        docType: 'defineTable',
      },
      requestConfig: {
        // 请求配置
        request: params => {
          // 请求接口（为mock数据，非真实接口）
          console.log('请求参数', params)
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const {
                defineTableList = [],
                tableDataList = [],
                requestParamsList = [],
                requestConfigList = [],
                pagingConfigList = [],
              } = this
              const listJson = {
                defineTable: defineTableList,
                tableData: tableDataList,
                requestParams: requestParamsList,
                requestConfig: requestConfigList,
                pagingConfig: pagingConfigList,
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
