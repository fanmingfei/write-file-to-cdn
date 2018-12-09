const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')

module.exports = async function(ctx, next) {
    let res = await put(ctx)
    let renameRes, rePutRes
    if (!res.respErr && res.respInfo.statusCode == 200) {
        ctx.state.srcUrl = ctx.state.domain + res.respBody.key
    } else if (!res.respErr && res.respBody.error === 'file exists') {
        renameRes = await rename(ctx)
        rePutRes = await put(ctx)
        ctx.state.update = true
        ctx.state.srcUrl = ctx.state.domain + rePutRes.respBody.key
    }
    ctx.state.qiniuRes = [res, renameRes, rePutRes]
    await next()
}

function put(ctx) {
    const body = ctx.request.body
    var formUploader = new qiniu.form_up.FormUploader(ctx.state.config);
    var putExtra = new qiniu.form_up.PutExtra();
    var key = ctx.state.basePath + body.key;
    var callback = body.callback;
    const mimeType = body.mime;
    let value = body.value;
    console.log(value)
    putExtra.mimeType = 'text/html'
    if (callback) {
        value = `${callback}(${value})`
        putExtra.mimeType = 'application/x-javascript'
    }
    if (mimeType) {
        putExtra.mimeType = mimeType
    }
    console.log(putExtra)
    return new Promise(r => {
        formUploader.put(ctx.state.uploadToken, key, value, putExtra, async function(respErr,
            respBody, respInfo) {
            r({ respErr, respBody, respInfo })
        });
        // const filePath = path.resolve(body.key)
        // console.log(filePath)
        // fs.writeFileSync(filePath, value, {flag: 'w+'})
        // 
        // formUploader.putFile(ctx.state.uploadToken, key, filePath, putExtra, async function(respErr,
        //     respBody, respInfo) {
        //     // fs.unlinkSync(filePath)
        //     r({ respErr, respBody, respInfo })
        // });
    })
}

function rename(ctx) {
    return new Promise(r => {
        const key = ctx.state.basePath + ctx.request.body.key
        var bucketManager = new qiniu.rs.BucketManager(ctx.state.mac, ctx.state.config);
        console.log(ctx.state.bucket, key, ctx.state.bucket, `${key}_${new Date().getTime()}`)
        bucketManager.move(ctx.state.bucket, key, ctx.state.bucket, `${key}_${new Date().getTime()}`, { force: true }, function(
            respErr, respBody, respInfo) {
            console.log({ respErr, respBody, respInfo })
            r({ respErr, respBody, respInfo })
        });
    })

}