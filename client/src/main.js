// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../node_modules/codemirror/lib/codemirror.css'
import '../node_modules/codemirror/keymap/sublime'
import '../node_modules/codemirror/theme/monokai.css'
import '../node_modules/codemirror/mode/javascript/javascript'
import '../node_modules/codemirror/mode/htmlembedded/htmlembedded'
import '../node_modules/codemirror/mode/css/css'
import '../node_modules/codemirror/addon/hint/css-hint'
import '../node_modules/codemirror/addon/hint/html-hint'
import '../node_modules/codemirror/addon/hint/javascript-hint'
import '../node_modules/codemirror/addon/hint/show-hint'
import '../node_modules/codemirror/addon/hint/show-hint.css'
import '../node_modules/codemirror/addon/edit/closetag'
import '../node_modules/codemirror/addon/comment/comment'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
