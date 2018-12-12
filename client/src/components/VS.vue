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
    <Modal :qiniu="qiniu" ref="modal" />
  </div>
</template>
<script>
import * as monaco from 'monaco-editor';

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
        language: 'html',
        mime: 'text/html'
      }, {
        key: 'css',
        language: 'css',
        mime: 'text/css'
      }, {
        key: 'js',
        language: 'javascript',
        mime: 'application/x-javascript'
      }, {
        key: 'json',
        language: 'json',
        mime: 'application/json'
      }],
      type: 'json',
      mime: 'application/json',
      qiniu: {
        basePath: ''
      },
      serverUrl: '//text.escript.cn/'
    }
  },
  computed: {
    url() {
      return `${this.qiniu.domain}${this.qiniu.basePath}${this.key}`
    }
  },
  watch: {
    type() {
      const type = this.getTypeByKey(this.type)
      this.setLanguage(type.language)

      this.mime = type.mime
      if (type.key === 'html' && !this.editor.getValue()) {
        this.initHTML()
      }
    },
    url() {
      if (this.editor.getValue() || !this.qiniu.domain || !this.qiniu.accessKey || !this.key) {
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
          this.editor.setValue(text)
        }).catch(() => {
          console.log('没有该文件')
        })
    },
    key() {
      const keys = this.key.split('.')
      const type = this.getTypeByKey(keys[keys.length - 1])
      if (type) {
        this.setLanguage(type.language)
        this.type = type.key
      }
    }
  },
  methods: {
    getTypeByKey(ext) {
      return this.types.filter(({ key }) => key === ext)[0]
    },

    setting() {
      this.$refs.modal.pop()
    },
    setLanguage(language){
      monaco.editor.setModelLanguage(this.editor.getModel(), language)
    },
    submit() {
      const data = {
        key: this.key,
        value: this.editor.getValue(),
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
      }).then(res=>res.json())
      .then((res) => {
        const reason = [
        '发布',
        '重命名',
        '上传'
        ]
        res.qiniu && res.qiniu.forEach((item, i)=>{
          if (item && item.respErr) throw new Error(`${reason[i]}失败`)
        })
        document.querySelector('.submit-success').style.display = 'inline'
        setTimeout(() => {
          document.querySelector('.submit-success').style.display = 'none'
        }, 1000)
      }).catch((reason)=>{
        alert(reason)
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
      this.editor.setValue(html)
    }
  },
  mounted() {
    const qiniu = localStorage.getItem('__config_qiniu_')
    if (qiniu) {
      this.qiniu = JSON.parse(qiniu)
    } else {
      this.$refs.modal.pop()
    }
    if (qiniu && (!this.qiniu.accessKey || !this.qiniu.secretKey || !this.qiniu.bucket || !this.qiniu.domain)) {
      this.$refs.modal.pop()
    }
    this.mode = 'js'


    this.editor = monaco.editor.create(this.$refs.editor, {
      language: 'javascript',
      theme: 'vs-dark'
    });
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
