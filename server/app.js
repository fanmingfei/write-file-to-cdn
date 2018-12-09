const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const initQiniu = require('./initQiniu')
const uploadQiniu = require('./uploadQiniu')
const updateQiniu = require('./updateQiniu')
console.log(initQiniu)
const app = new Koa();


app.use(bodyParser({
    formLimit:"3mb",
    jsonLimit:"3mb",
    textLimit:"3mb",
    enableTypes: ['json', 'form', 'text']
}));

app.use(initQiniu)
app.use(uploadQiniu)
app.use(updateQiniu)

app.use(async ctx => {
    console.log(ctx.request)
  ctx.set('Access-Control-Allow-Origin','*')
  ctx.body = {
    url: ctx.state.srcUrl,
    qiniu: ctx.state.qiniuRes
  }

});

app.listen(3000);