<template>
  <div :class="{ 'upload-file': true, disabled, readonly }">
    <div v-show="!disabled && !readonly" ref="uploadFile" class="paste-upload" contenteditable="plaintext-only"></div>
    <el-upload
      drag
      multiple
      :limit="limit"
      :action="action"
      :headers="headers"
      :with-credentials="withCredentials"
      :file-list="selfFileList"
      :disabled="disabled || readonly"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      :http-request="handleHttpRequest"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        <div class="row1">点击或者拖动文件到虚线框内上传</div>
        <div class="row2">支持.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip,.txt,.jpg,.jpeg,.png,.gif,.msg等类型的文件</div>
        <div class="row2">文件上传数量限制{{ limit }}个，文件上传大小限制{{ limitSize }}M</div>
      </div>
    </el-upload>
    <template v-if="readonly && !selfFileList.length">--</template>
    <image-viewer v-if="showViewer" :url-list="urlList" :z-index="999999" :on-close="handleCloseViewer" />
  </div>
</template>
<script>
import { bind, unbind, getPasteFile, fileType } from 'utils/utils'
import ImageViewer from './ImageViewer.vue'
import { copyJson } from '@/utils/utils'

export default {
  /*
    <upload-file :file-list.sync="fileList" />
  */

  components: {
    ImageViewer,
  },

  props: {
    fileList: {
      // 上传的文件列表
      type: Array,
      default() {
        return []
      },
    },
    limit: {
      // 上传文件数量限制
      type: Number,
      default: 20,
    },
    limitSize: {
      // 上传文件大小限制
      type: Number,
      default: 20,
    },
    disabled: {
      // 是否禁用
      type: Boolean,
      default: false,
    },
    readonly: {
      // 是否只展示附件
      type: Boolean,
      default: false,
    },
  },

  data() {
    const { action, headers, withCredentials } = this.$services.elFileUpload()

    return {
      action,
      headers,
      withCredentials,
      showViewer: false,
      selfFileList: [],
      urlList: [],
    }
  },

  watch: {
    selfFileList(newVal) {
      this.$emit('update:fileList', this.selfFileList)
    },
  },

  mounted() {
    bind(this.$refs.uploadFile, 'paste', this.getFile)
  },

  beforeDestroy() {
    unbind(this.$refs.uploadFile, 'paste', this.getFile)
  },

  methods: {
    __clearFileList() {
      this.selfFileList = []
    },
    __setFileList(fileList) {
      const mapFileList = (fileList ?? []).map((item) => {
        const { fileName: name } = item
        return {
          name,
          response: {
            data: item,
          },
        }
      })
      this.selfFileList = this.repeatFileRename(mapFileList)
    },
    repeatFileRename(fileList = []) {
      const nameCountJson = {}

      return fileList.map((item) => {
        const { name } = item
        const lastIndex = name.lastIndexOf('.')
        const suffix = ~lastIndex ? name.substring(lastIndex) : ''
        const [fileName] = suffix ? name.split(suffix) : [name]
        const key = fileName.split(' (')[0]

        if (nameCountJson[key] === undefined) {
          nameCountJson[key] = 0
        } else {
          nameCountJson[key]++
          item.name = `${key} (${nameCountJson[key]})${suffix}`
        }
        return item
      })
    },
    async uploadFile(file) {
      if (this.selfFileList.length >= 20) {
        this.handleExceed()
        return
      }
      const formData = new FormData()
      formData.append('file', file)
      const res = await this.$services.fileUpload(formData)
      const data = res?.data
      const { fileId, fileName: name } = data
      if (!fileId) return
      const fileList = copyJson(this.selfFileList)
      fileList.push({
        name,
        response: res,
      })
      this.selfFileList = this.repeatFileRename(fileList)
    },
    getFile(ev) {
      if (this.disabled) return
      getPasteFile(ev, async (file) => {
        // console.log(file)
        const isConfirm = await this.isConfirm(`从剪切板中读取到了文件${file.name}，是否确定上传？`)
        if (!isConfirm) return
        this.uploadFile(file)
      })
    },
    async handleHttpRequest({ file }) {
      this.uploadFile(file)
    },
    handleBeforeUpload(file) {
      const { size = 0 } = file
      const isLt = size / 1024 / 1024 < this.limitSize

      if (!isLt) {
        this.alerts(`上传文件大小不能超过${this.limitSize}MB`)
      }
      return isLt
    },
    handleSuccess(response, file, fileList) {
      this.selfFileList = this.selfFileList.filter((item) => item.response)
    },
    handleRemove(file, fileList) {
      this.selfFileList = this.repeatFileRename(fileList)
    },
    handleExceed(files, fileList) {
      this.alerts(`上传文件数量不能超过${this.limit}个`)
    },
    async handlePreview(file) {
      // console.log(file)
      const data = file?.response?.data ?? {}
      const { fileName, downloadUrl } = data
      if (!downloadUrl) return console.log('无图片预览地址')
      const lastIndex = fileName.lastIndexOf('.')
      const suffix = fileName.substring(lastIndex + 1)
      if (fileType(suffix) != 'image') {
        const isConfirm = await this.isConfirm('仅支持图片预览，是否下载该文件？')
        if (!isConfirm) return
        window.open(downloadUrl)
        return
      }
      this.urlList = [downloadUrl]
      this.showViewer = true
    },
    handleCloseViewer() {
      this.showViewer = false
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';

.upload-file {
  position: relative;
  ::v-deep {
    .el-upload-list__item {
      transition-duration: 0.3s !important;
      transition-timing-function: linear !important;
    }
  }
  &.disabled::before {
    content: '';
    width: 100%;
    height: 180px;
    background-color: rgba(255, 255, 255, 0.7);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    cursor: not-allowed;
  }
  &.readonly {
    ::v-deep {
      .el-upload {
        display: none;
      }
      .el-upload-list {
        background-color: #f5f5f5;
      }
      .el-upload-list__item:first-child {
        margin-top: 5px;
      }
      .el-upload-list__item {
        transition: 0s !important;
        .el-upload-list__item-name {
          margin-right: 0;
        }
        .el-upload-list__item-status-label {
          display: none;
        }
      }
    }
  }
  ::v-deep .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
      .el-icon-upload {
        margin: 10px 0;
        font-size: 50px;
        color: #e7c8c9;
      }
      .el-upload__text {
        line-height: 30px;
        .row2 {
          color: $gray;
        }
      }
    }
  }
  .paste-upload {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    margin-bottom: 5px;
    font-size: 0;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      background: no-repeat center center;
      background-size: auto 30px;
      background-image: url('../../assets/images/pasteText.png');
    }
    &:focus {
      border-color: $main;
      color: $main;
      &::before {
        background-image: url('../../assets/images/pasteTextActive.png');
      }
    }
  }
}
</style>
