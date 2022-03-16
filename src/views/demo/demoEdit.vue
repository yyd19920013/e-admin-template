<template>
  <div class="demo">
    <form-wrap :type="type">
      <template #form>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="form-main">
          <el-form-item label="字段1" prop="name" class="one-line">
            <div v-show="type == 'check'" class="text">{{ detail.name }}</div>
            <el-input v-show="type != 'check'" v-model="ruleForm.name" placeholder="请概括说明您的需求主题" maxlength="30" clearable />
          </el-form-item>
          <el-form-item label="字段2" prop="deptId">
            <div v-show="type == 'check'" class="text">{{ detail.deptName }}</div>
            <type-select
              v-show="type != 'check'"
              ref="deptId"
              :selected-list.sync="ruleForm.deptId"
              type="department"
              :multiple="false"
              :is-new-add="continueChecked"
            />
          </el-form-item>
          <el-form-item label="字段3" prop="priority">
            <div v-show="type == 'check'" class="text">{{ detail.priorityText }}</div>
            <type-radio v-show="type != 'check'" ref="priority" :selected.sync="ruleForm.priority" type="businessPriority" />
          </el-form-item>
          <el-form-item label="字段4" prop="productLineId">
            <div v-show="type == 'check'" class="text">{{ detail.productLineName }}</div>
            <type-select
              v-show="type != 'check'"
              ref="productLineId"
              :selected-list.sync="ruleForm.productLineId"
              type="productLine"
              :multiple="false"
              @selected-change="handleSelectedChangeProductLineId"
              @change="handleChangeProductLineId"
            />
            <tips type="productLine" />
          </el-form-item>
          <el-form-item label="字段5" prop="receiveManInfo">
            <div v-show="type == 'check'" class="text">{{ arrJoinValue(detail.receiveManInfo) }}</div>
            <select-person
              v-show="type != 'check'"
              ref="receiveManInfo"
              type="radio"
              :disabled-all="type == 'edit'"
              @selected-change="handleSelectedChangeReceiveManInfo"
            />
            <div class="hint--gray">提示</div>
          </el-form-item>
          <el-form-item label="字段6" prop="targetCustomer">
            <div v-show="type == 'check'" class="text">{{ detail.targetCustomer }}</div>
            <el-input v-show="type != 'check'" v-model="ruleForm.targetCustomer" placeholder="请输入" maxlength="30" clearable />
          </el-form-item>
          <el-form-item label="字段7" prop="createCustomer">
            <div v-show="type == 'check'" class="text">{{ detail.createCustomer ? '是' : '否' }}</div>
            <type-radio v-show="type != 'check'" ref="createCustomer" :selected.sync="ruleForm.createCustomer" type="whether" />
          </el-form-item>
          <el-form-item label="字段8" prop="dataIndicators" :class="{ 'one-line': type != 'check' }">
            <div v-show="type == 'check'" class="text">{{ detail.dataIndicators || '--' }}</div>
            <el-input v-show="type != 'check'" v-model="ruleForm.dataIndicators" placeholder="请输入" maxlength="30" clearable />
          </el-form-item>
          <el-form-item v-show="type == 'check'" label="字段9" prop="createManInfo">
            <div class="text">{{ detail.createManInfo && detail.createManInfo.userName }}</div>
          </el-form-item>
          <el-form-item v-show="showOsAndProcessor" label="字段10" prop="os">
            <div v-show="type == 'check'" class="text">{{ detail.osText }}</div>
            <type-select v-show="type != 'check'" ref="os" :selected-list.sync="ruleForm.os" type="os" :multiple="false" />
          </el-form-item>
          <el-form-item v-show="showOsAndProcessor" label="字段11" prop="processor">
            <div v-show="type == 'check'" class="text">{{ detail.processorText }}</div>
            <type-select
              v-show="type != 'check'"
              ref="processor"
              :selected-list.sync="ruleForm.processor"
              type="processor"
              :multiple="false"
            />
          </el-form-item>
          <el-form-item label="字段12" prop="desc" class="one-line">
            <el-input
              v-model="ruleForm.desc"
              placeholder="请输入"
              type="textarea"
              :autosize="{ minRows: 4 }"
              maxlength="1000"
              clearable
              :disabled="type == 'check'"
            />
            <div class="hint--orange">注意：</div>
          </el-form-item>
          <el-form-item label="附件" prop="fileListRaw" class="one-line">
            <upload-file ref="uploadFile" :file-list.sync="ruleForm.fileListRaw" :readonly="type == 'check'" />
          </el-form-item>
          <template v-if="businessPower('planReleaseDate') || businessPower('reason')">
            <div class="hint-title">
              <div class="hint-title__row1">标题</div>
            </div>
            <el-form-item v-if="businessPower('planReleaseDate')" label="字段13" class="one-line">
              <div class="text">{{ detail.planReleaseDateText }}</div>
            </el-form-item>
            <el-form-item v-if="businessPower('reason')" label="字段14" class="one-line">
              <div class="text">{{ detail.reasonText || '--' }}</div>
            </el-form-item>
          </template>
          <el-form-item label="" class="one-line">
            <el-button
              v-if="businessPower('selectProductBusinessButton')"
              type="primary"
              plain
              @click="$refs.selectProductBusiness.visible = true"
            >
              弹窗
            </el-button>
            <select-product-business
              v-if="businessPower('selectProductBusiness')"
              ref="selectProductBusiness"
              :biz-demand-id="toId"
              @status-change="handleStatusChange"
            />
          </el-form-item>
          <div v-if="type != 'add'" class="text-wrap">
            <el-form-item label="字段14">
              <div class="text">{{ detail.statusText || '--' }}</div>
              <tips type="businessStatus" />
            </el-form-item>
            <el-form-item v-if="businessPower('endDate')" label="字段15">
              <div class="text">
                <template v-if="detail.endDate">{{ detail.endDate | date('yyyy-MM-dd') }}</template>
                <template v-else>--</template>
              </div>
            </el-form-item>
          </div>
          <el-form-item label="" class="one-line no-bottom">
            <el-button type="primary" plain @click="$refs.recipientInfoList.visible = true">添加</el-button>
          </el-form-item>
          <el-form-item label="人员" prop="recipientInfoList" class="one-line">
            <select-person
              ref="recipientInfoList"
              type="checkbox"
              :collapse-tags="false"
              :disabled="true"
              placeholder="请选择"
              @selected-change="handleSelectedChangeRecipientInfoList"
              @selected-confirm="handleSelectedConfirmRecipientInfoList"
            />
          </el-form-item>
        </el-form>
        <comment v-if="type == 'check'" :to-id="toId" :type="2" />
      </template>
      <template v-if="type != 'check'" #handler>
        <el-button v-if="type == 'add' || businessPower('edit')" type="primary" @click="submitForm">
          {{ type == 'add' ? '提交' : '保存' }}
        </el-button>
        <el-button plain @click="cancel">取消</el-button>
        <el-checkbox v-if="type == 'add'" v-model="continueChecked">继续新建下一条</el-checkbox>
      </template>
      <template v-else-if="businessPower('editCancel') || businessPower('agreeRejectTransfer')" #handler>
        <template v-if="businessPower('editCancel')">
          <el-button type="primary" @click="pageType = 'edit'">
            操作1
          </el-button>
          <el-button plain @click="businessCancel(toId)">
            操作2
          </el-button>
        </template>
        <template v-if="businessPower('agreeRejectTransfer')">
          <el-button type="primary" :disabled="businessPower('agreeDisabled')" @click="agreeVisible = true">
            操作3
          </el-button>
          <el-button plain :disabled="businessPower('rejectDisabled')" @click="rejectVisible = true">
            操作4
          </el-button>
          <el-button plain @click="transferVisible = true">
            操作5
          </el-button>
        </template>
      </template>
    </form-wrap>
    <el-dialog title="弹窗1" :visible.sync="agreeVisible" width="400" class="handleDialog">
      <div class="content">
        <div class="main">
          <el-form ref="agreeForm" :model="agreeForm" :rules="agreeRules" class="form-main">
            <el-form-item label="字段1" prop="planReleaseDate">
              <type-select :selected-list.sync="agreeForm.planReleaseDate" type="onlineTime" :multiple="false" />
            </el-form-item>
          </el-form>
        </div>
        <div class="end">
          <el-button type="primary" @click="bizDemandAgree">接收</el-button>
          <el-button @click="agreeVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="弹窗2" :visible.sync="rejectVisible" width="400" class="handleDialog">
      <div class="content">
        <div class="main">
          <el-form ref="rejectForm" :model="rejectForm" :rules="rejectRules" class="form-main">
            <el-form-item label="字段2" prop="reason">
              <type-select :selected-list.sync="rejectForm.reason" type="reason" :multiple="false" />
            </el-form-item>
          </el-form>
        </div>
        <div class="end">
          <el-button type="primary" @click="bizDemandReject">确定</el-button>
          <el-button @click="rejectVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <search-select
      :visible.sync="transferVisible"
      type="radio"
      text-type="transfer"
      :required="true"
      @selected-change="bizDemandTransfer"
    />
  </div>
</template>
<script>
import FormWrap from '@/components/common/FormWrap'
import SelectPerson from '@/components/common/SelectPerson'
import SearchSelect from '@/components/common/SearchSelect'
import UploadFile from '@/components/common/UploadFile'
import demoMixin from '../mixins/demoMixin'
import { copyJson } from '@/utils/utils'

export default {
  components: {
    FormWrap,
    SelectPerson,
    SearchSelect,
    UploadFile,
  },

  mixins: [demoMixin],

  data() {
    const { id: bizDemandId } = this.$route.query

    return {
      id: bizDemandId,
      toId: bizDemandId,
      bizDemandId,
      continueChecked: false,
      pageType: '',
      detail: {},
      ruleForm: {},
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'none' }],
        deptId: [{ required: true, message: '请选择', trigger: 'none' }],
        priority: [{ required: true, message: '请选择', trigger: 'none' }],
        productLineId: [{ required: true, message: '请选择', trigger: 'none' }],
        targetCustomer: [{ required: true, message: '请输入', trigger: 'none' }],
        createCustomer: [{ required: true, message: '请选择', trigger: 'none' }],
        receiveManInfo: [{ required: true, message: '请选择', trigger: 'none' }],
        os: [{ required: true, message: '请选择', trigger: 'none' }],
        processor: [{ required: true, message: '请选择', trigger: 'none' }],
      },
      agreeVisible: false,
      agreeForm: {
        bizDemandId,
        planReleaseDate: '',
      },
      agreeRules: {
        planReleaseDate: [{ required: true, message: '请选择', trigger: 'none' }],
      },
      rejectVisible: false,
      rejectForm: {
        bizDemandId,
        reason: '',
      },
      rejectRules: {
        reason: [{ required: true, message: '请选择', trigger: 'none' }],
      },
      transferVisible: false,
      showOsAndProcessor: false,
    }
  },

  computed: {
    type() {
      if (this.pageType) return this.pageType
      const { type, id } = this.$route.query

      if (type) {
        return type
      } else if (id) {
        return 'edit'
      } else {
        return 'add'
      }
    },
  },

  watch: {
    showOsAndProcessor(newVal) {
      if (newVal) {
        this.rules.os = [{ required: true, message: '请选择', trigger: 'none' }]
        this.rules.processor = [{ required: true, message: '请选择', trigger: 'none' }]
      } else {
        delete this.rules.os
        delete this.rules.processor
      }
    },
  },

  created() {
    this.dataInit()
  },

  mounted() {
    this.bizDemandGet()
  },

  methods: {
    statusGetPermission(statusList = [], isReceive = false) {
      const status = this.detail?.status
      const createUserId = this.detail?.createManInfo?.userId
      const receiveUserId = this.detail?.receiveManInfo?.userId
      const userId = !isReceive ? createUserId : receiveUserId
      return this.getPermission(statusList, status, [userId], userId)
    },
    dataInit() {
      this.ruleForm = {
        name: '',
        deptId: '',
        priority: '',
        productLineId: '',
        dataIndicators: '',
        targetCustomer: '',
        createCustomer: false,
        receiveManInfo: {},
        os: '',
        processor: '',
        desc: ``,
        recipientInfoList: [],
        fileListRaw: [],
        fileList: [],
      }
      this.$nextTick(() => {
        this.$refs.createCustomer.__setSelected(false)
      })
    },
    resetForm() {
      this.dataInit()
      this.$refs.ruleForm.resetFields()
      Object.values(this.$refs).forEach(ref => {
        ref.__clearSelected && ref.__clearSelected()
        ref.__clearFileList && ref.__clearFileList()
      })
    },
    async bizDemandGet() {
      if (this.type == 'add') return
      const { bizDemandId } = this
      const res = await this.$services.bizDemandGet({ bizDemandId })
      if (!res.data) return
      const { deptId: groupId, deptName: groupName, createCustomer, fileList } = res.data
      this.detail = res.data
      this.safeSetData(this.ruleForm, res.data, this.$refs)
      this.$refs.deptId.__setSelected({ groupId, groupName })
      this.$refs.createCustomer.__setSelected(createCustomer)
      this.$refs.uploadFile.__setFileList(fileList)
    },
    handleSelectedChangeReceiveManInfo(selectedList) {
      this.ruleForm.receiveManInfo = selectedList
    },
    handleSelectedChangeRecipientInfoList(selectedList) {
      this.ruleForm.recipientInfoList = selectedList
    },
    handleSelectedChangeProductLineId(selectedList) {
      this.showOsAndProcessor = selectedList.find(item => item && item.type == 1)
    },
    handleChangeProductLineId(selectedList) {
      if (!selectedList) return
      this.$refs.receiveManInfo.__setSelected({ userId: selectedList.bizDomainOwnerId })
    },
    handleSelectedConfirmRecipientInfoList(selectedList) {
      if (this.type != 'add') {
        this.productDemandAddRecipients(30, selectedList)
      }
    },
    handleStatusChange(data) {
      this.safeSetData(this.detail, data)
    },
    bizDemandAgree() {
      this.$refs.agreeForm.validate(async valid => {
        if (valid) {
          this.agreeVisible = false
          const res = await this.$services.bizDemandAgree(this.agreeForm)
          if (!res.data) return
          this.alerts('接收成功', 'success')
          this.$router.push('/demo/list')
        }
      })
    },
    bizDemandReject() {
      this.$refs.rejectForm.validate(async valid => {
        if (valid) {
          this.rejectVisible = false
          const res = await this.$services.bizDemandReject(this.rejectForm)
          if (!res.data) return
          this.alerts('成功', 'success')
          this.$router.push('/demo/list')
        }
      })
    },
    async bizDemandTransfer(selectedList) {
      const [firstItem] = selectedList
      const { alias, name, account: receiveManId } = firstItem
      const { id } = this
      const params = {
        id,
        receiveMan: `${alias}-${name}`,
        receiveManId,
      }
      const res = await this.$services.bizDemandTransfer(params)
      if (!res.data) return
      this.alerts('成功', 'success')
      this.$router.push('/demo/list')
    },
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const params = copyJson(this.ruleForm)
          const { fileListRaw } = params
          params.fileList = fileListRaw.map(item => {
            const { response = {} } = item
            const { fileId, fileName } = response.data
            return {
              fileId,
              fileName,
            }
          })
          delete params.fileListRaw
          if (this.type == 'edit') {
            const { id } = this
            params.id = id
          }
          const apiNameJson = {
            add: 'bizDemandAdd',
            edit: 'bizDemandModify',
          }
          const apiName = apiNameJson[this.type]
          const res = await this.$services[apiName](params)
          if (!res.data) return
          this.alerts('保存成功', 'success')
          if (this.continueChecked) {
            this.resetForm()
            document.querySelector('.form__box').scrollTop = 0
          } else {
            this.cancel()
          }
        } else {
          this.alerts('校验不通过，请按提示修改')
        }
      })
    },
    cancel() {
      this.$router.push('/demo/list')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';

.demo {
  ::v-deep .handleDialog {
    .el-dialog__body {
      padding: 20px 40px;
      padding-top: 0;
    }
    .content {
      .main {
        .el-form-item {
          display: flex;
          flex-direction: column;
          .el-form-item__label {
            text-align: left;
          }
          .el-select {
            width: 100%;
          }
        }
      }
    }
    .end {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
