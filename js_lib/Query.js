var needle = require('needle');
var encry = require('../js_lib/EncryptUtil');
var url='http://192.168.2.104:9888/Caipiao_ServerHB/caiPiaoServlet';
//var url='http://139.224.225.201:8888/Caipiao_ServerHB/caiPiaoServlet';
var clientid = process.env.xx_clientid;
var version;
function getVersion(){
    if(!version){
        try{
            var fs = require('fs');
            var buf = fs.readFileSync(process.cwd() +'/package.json',{});
            var info = JSON.parse(buf.toString());
            version = info.version;
        }catch(e) {
            version='test';
        }
    }
    return version;
}
function getHead(username,pwd,businessType){
    var bstype = businessType ? businessType :'CaiPiaoHandlerImp';
    var head ={name:username ? encry.des3cbc(username) : '',pwd: pwd ? encry.des3cbc(pwd) :'',version:getVersion(),channel:'10000',client:'web',"businessType":bstype, clientid:clientid};
    return head;
}
exports.doMethodWithAllReturn = function(methodName,params,cb,businessType){
    var encodeParams = encry.des3cbc(JSON.stringify(params));
    var data = {
        command:methodName,
        head:getHead('','',businessType),
        params:encodeParams,
        check:encry.md5Params(encodeParams)
    };
    var s = JSON.stringify(data);
    var p={open_timeout:60000}
    needle.post(url,s ,p,function(err,resp,body){
        if(err){
            if(err.message=='connect EHOSTUNREACH'||err.message=='socket hang up'){
                err.message='网络连接异常，请稍候重试';
            }
            cb(err,null);
        }else{
            var returns;
            try{
                returns = JSON.parse(body.toString());
            }catch(e) {
                //console.log(e);
                //console.log(methodName,body.toString());
                returns = { status: { errorCode: '9999', errorMsg: 'JSON Parse Error' },bizObj:''};
            }
            cb(null,returns);
        }
    });
}
exports.doMethodWithHeadAllReturn = function(user,password,methodName,params,cb,businessType){
    var encodeParams = encry.des3cbc(JSON.stringify(params));
    var data = {
        command:methodName,
        head:getHead(user,password,businessType),
        params:encodeParams,
        check:encry.md5Params(encodeParams)
    };

    var s = JSON.stringify(data);
    var p={open_timeout:60000}
    needle.post(url,s ,p,function(err,resp,body){
        if(err){
            if(err.message=='connect EHOSTUNREACH'||err.message=='socket hang up'){
                err.message='网络连接异常';
            }
            cb(err,null);
        }else{
            var returns;
            try{
                returns = JSON.parse(body.toString());
            }catch(e) {
                //console.log(methodName,body.toString());
                returns = { status: { errorCode: '9999', errorMsg: 'JSON Parse Error' },bizObj:''};
            }
            cb(null,returns);
        }
    });
}
