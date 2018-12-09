const qiniu = require('qiniu')
module.exports = async function initQiniu(ctx, next) {
    const params = JSON.parse(ctx.request.body.qiniu)
    Object.assign(ctx.state, params)
    const mac = new qiniu.auth.digest.Mac(ctx.state.accessKey, ctx.state.secretKey);
    ctx.state.mac = mac
    ctx.state.config = new qiniu.conf.Config();

    const options = {
        scope: ctx.state.bucket,
        expires: 100
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    ctx.state.uploadToken = uploadToken
    await next()
}


function getQiniuParam(secret) {
    const mc = new MagicCrypt('config', 256)
    const str = mc.decrypt(secret)
    return JSON.parse(str)
}