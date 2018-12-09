<template>
  <div class="container" v-if="show">
    <div class="box">
        <input type="text" class="input" placeholder="域名" v-model="qiniu.domain" >
        <input type="text" class="input" placeholder="默认目录" v-model="qiniu.basePath" >
        <input type="text" class="input" placeholder="accessKey" v-model="qiniu.accessKey" >
        <input type="text" class="input" placeholder="secretKey" v-model="qiniu.secretKey" >
        <input type="text" class="input" placeholder="bucket" v-model="qiniu.bucket" >
        <div>
            <button @click="submit" class="button">确定</button>
        </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'Modal',
        props: ['qiniu'],
        data() {
            return {
                show: false
            }
        },
        methods: {
            submit() {
                localStorage.setItem('__config_qiniu_', JSON.stringify(this.qiniu))
                this.show = false
            },
            pop() {
                this.show = true
            }
        },
        mounted(){
            console.log(this.qiniu)
        }
    }
</script>
<style scoped>
.container {
z-index: 11111111;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .68);
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  position: absolute;
}
.box {
    width: 40vw;
    height: 40vw;
    background: #fff;
    border-radius: 1vw;
}
.input {
    display: block;
    width: 80%;
    margin: 12px auto;
}
.button {
    display: block;
    color: #fff;
    background: #1eb2f0;
    border-color: transparent;
    margin: 20px auto;
}

</style>

