const qiniu = require('qiniu')

module.exports = async function(ctx, next) {
    ctx.state.update && ctx.state.qiniuRes.push(await update(ctx))
    next()
}

function update(ctx) {
    return new Promise(r => {
        var cdnManager = new qiniu.cdn.CdnManager(ctx.state.mac);
        cdnManager.refreshUrls([ctx.state.srcUrl], function(respErr, respBody, respInfo) {
            r({ respErr, respBody, respInfo })
        })
    })
}