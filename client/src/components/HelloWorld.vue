<template>
  <div>
    <div class="input-box">
      <input type="text" v-model="key" placeholder="文件名（带后缀）" class="input key">
      <input type="text" v-model="mime" placeholder="text/plain (可选)" class="input mime">
      <select type="text" v-model="type" placeholder="" class="input type">
        <option v-for="item in types" :value="item.key">{{item.key}}</option>
      </select>
      <button class="submit" @click="submit">发布</button>
      <button class="setting" @click="setting">设置</button>
      <span class="submit-success">发布成功</span>
    </div>
    <div class="url"><a :href="url">{{url}}</a></div>
    <div class="editor" ref="editor">
    </div>
    <Modal :qiniu="qiniu" ref="modal"/>
  </div>
</template>
<script>
import Codemirror from 'codemirror'
import Modal from './Modal'
window.Codemirror = Codemirror
export default {
  name: 'editorWorld',
  components: { Modal },
  data() {
    return {
      key: '',
      types: [{
        key: 'html',
        mode: 'htmlembedded',
        mime: 'text/html'
      }, {
        key: 'css',
        mode: 'css',
        mime: 'text/css'
      }, {
        key: 'js',
        mode: 'js',
        mime: 'application/x-javascript'
      }, {
        key: 'json',
        mode: 'js',
        mime: 'application/json'
      }],
      type: 'json',
      mime: 'application/json',
      qiniu: {
      },
      serverUrl: 'http://text.escript.cn/'
    }
  },
  computed: {
    url() {
      return `${this.qiniu.domain}${this.qiniu.basePath}${this.key}`
    }
  },
  watch: {
    type() {
      const type = this.types.filter(({ key }) => key === this.type)[0]
      this.codeEditor.setOption('mode', type.mode)
      this.mime = type.mime
      if (type.key === 'html' && !this.codeEditor.getValue()) {
        this.initHTML()
      }
    },
    url() {
      if (this.codeEditor.getValue() || !this.qiniu.domain || !this.qiniu.accessKey || !this.key) {
        return
      }
      fetch(this.url)
        .then((res) => {
          if (res.status === 200) {
            return res.text()
          } else {
            throw Error()
          }
        })
        .then((text) => {
          this.codeEditor.setValue(text)
        }).catch(() => {
          console.log('没有该文件')
        })
    }
  },
  methods: {

    setting() {
      this.$refs.modal.pop()
    },
    submit() {
      const data = {
        key: this.key,
        value: this.codeEditor.getValue(),
        mime: this.mime,
        qiniu: JSON.stringify(this.qiniu)
      }

      let params = []
      for (let key in data) {
        params.push(`${key}=${encodeURIComponent(data[key])}`)
      }
      const body = params.join('&')
      console.log(body)

      fetch(this.serverUrl, {
        method: 'POST',
        body,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
      }).then(() => {
        document.querySelector('.submit-success').style.display = 'inline'
        setTimeout(() => {
          document.querySelector('.submit-success').style.display = 'none'
        }, 1000)
      }, () => {
        alert('发布失败！')
      })
    },
    initHTML() {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`
      this.codeEditor.setValue(html)
    }
  },
  mounted() {
    const qiniu = localStorage.getItem('__config_qiniu_')
    if (qiniu) {
      this.qiniu = JSON.parse(qiniu)
    } else {
      console.log(1)
      this.$refs.modal.pop()
    }
    if (qiniu && (!this.qiniu.accessKey || !this.qiniu.secretKey || !this.qiniu.bucket || !this.qiniu.domain)) {
      this.$refs.modal.pop()
    }
    this.mode = 'js'
    this.codeEditor = Codemirror(this.$refs.editor, {
      mode: this.mode,
      tabSize: 2,
      lineNumbers: true,
      keyMap: 'sublime',
      theme: 'monokai',
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      autoCloseTags: true
    })
    window.codeEditor = this.codeEditor
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editor {
  width: 100vw;
  height: calc(100vh - 30px - 2vw);
}

.input-box {
  margin: 1vw;
}

.key {
  width: 40vw;
}

.type {
  width: 10vw;
}

.mime {
  width: 20vw;
}

.url {
  padding: 0px 20px 10px 20px;
}

.submit-success {
  display: none;
}

</style>
