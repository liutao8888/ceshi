var methodQuery = require('../js_lib/Query.js');
var logger = require('../js_lib/Logger').logger;
var encry = require('../js_lib/EncryptUtil');

exports.GetCompany = function(leixing,cb){
    var ptype = 0;
    if(leixing == 'dianfei'){
        ptype = 1;
    }else if(leixing == 'meiqi'){
        ptype = 2
    }else if(leixing == 'dianxin'){
        ptype = 3;
    }else if(leixing == 'shuifei'){
        ptype = 0;
    }else if(leixing =='youxian'){
        ptype=4;
    }
    //0-水费，1-电费，2燃气，3移动、铁通、联通，4东方有线
    methodQuery.doMethodWithAllReturn('getPublicPayMentCompany',{cityCode:"021",publicPayMentType:ptype},function(err,infos){
        if(err){
            if(err){
                cb(err,null);
            }
        }else{
            if(infos.status.errorCode == "0000"){
                var info = JSON.parse(encry.decodeDes3cbc(infos.bizObj));
                cb(null,info);
            }else{
                cb(new Error('查询出错'));
            }
        }
    },'PublicPayMentHandlerImp');
}

//billKey:'510070111304276000079004',companyId:'021009006'
exports.Search = function(billkey,compayId,cb){
    methodQuery.doMethodWithAllReturn('getSdmInfo',{orderType:'sdm',billKey:billkey,companyId:compayId,filed1:"" ,filed2:"1",filed3:"",filed4:""},function(err,result){
        if(err){
            logger.error('查询订单失败',err);
            cb(err);
        } else{
            console.log(result);
            if(result.status.errorCode == '0000'){
                var params = encry.decodeDes3cbc(result.bizObj);
                cb(null,JSON.parse(params));
            }else{
                if(result.status.errorCode =='0022'){
                    cb(new Error('没有可以支付的账单'));
                }else{
                    cb(new Error('返回出错'));
                }
            }
        }
    },'PublicPayMentHandlerImp');
}
//下订单-水电煤
exports.MakeOrder = function(user,password,customerName,billKey,companyId,contractNo,payAmount,cb){
    var ptts = {orderType:"sdm",
        customerName:customerName,
        billKey:billKey,
        companyId:companyId,
        contractNo:contractNo,
        payAmount:payAmount};
    var sp = {"SdmOrdersmap":encry.des3cbc(JSON.stringify(ptts))}
    methodQuery.doMethodWithHeadAllReturn(user,password,'SdmTjs',sp,function(err,infos){
        console.log('下单',infos)
        if(err){
            logger.error(err);
            cb(err);
        }else{
            if(infos.status.errorCode =='0000'){
                console.log(infos);
                cb(null,infos.bizObj);
            }else{

                cb(new Error('下单失败'));
            }
        }
    },'PublicPayMentHandlerImp');
}
/**
 * 更新纸张信息
 * @param count
 * @param cb
 */
exports.updatePapers = function(count,cb){
    methodQuery.doMethodWithAllReturn('updatePrtCount',{type:'1',prtCount:count},function(err,returns){
        if(err){
            logger.error('提交打印纸信息出错:',err);
            cb(err);
        }else{
            if(returns.status.errorCode == '0000'){
                cb(null,returns.bizObj);
            }else{
                logger.error('提交打印纸信息出错',returns)
                cb(new Error('提交打印纸信息出错'));
            }
        }
    });
}
/**
 *提交打印的纸的数量
 * @param count
 */
exports.printPapers = function(count){
    Query.doMethodWithAllReturn('updatePrtCount',{type:'3',prtCount:count},function(err,returns){
        if(err){
            logger.error('提交打印纸信息出错:',err);
        }else{
            if(returns.status.errorCode != '0000'){
                logger.error('提交打印纸信息出错',returns);
            }else{
                console.log(returns);
            }
        }
    });
}
/**
 * 生成信用卡还款订单
 * @param phone
 * @param password
 * @param params
 * @param cb
 * @constructor
 */
exports.MakeCreditOrder = function(phone,password,params,cb){
    var m = {CreditOrdersmap:encry.des3cbc(JSON.stringify(params))};
    methodQuery.doMethodWithHeadAllReturn(phone,password,"CreditTjs",m,function(err,results){
        if(err){
            cb(err);
        }else{
            if(results.status.errorCode == '0000'){
                cb(null,results.bizObj);
            }else{
                console.log(results);
                cb(new Error('返回出错'));
            }
        }
    },'PublicPayMentHandlerImp');
}
/**
 * 卡卡转账order
 * @param phone
 * @param password
 * @param params
 * @param cb
 * @constructor
 */
exports.MakeCardToCardOrder = function(phone,password,params,cb){
    var m = {CreditOrdersmap:encry.des3cbc(JSON.stringify(params))};
    methodQuery.doMethodWithHeadAllReturn(phone,password,"CTCTjs",m,function(err,results){
        if(err){
            cb(err);
        }else{
            if(results.status.errorCode == '0000'){
                cb(null,results.bizObj);
            }else{
                console.log(results);
                cb(new Error('返回出错'));
            }
        }
    },'PublicPayMentHandlerImp');
}

exports.MakeTelChargeOrder = function(phone,passwrod,phone_num,money,mianzhi,fuwushang,cb){
    var params = {
        cardnum:mianzhi,
        gameUserId:phone_num,
        orderBonus:money,
        mctype: fuwushang //移动01 联通02 电信03
    };
    var ps = {TelRechOrdersmap:encry.des3cbc(JSON.stringify(params))};
    methodQuery.doMethodWithHeadAllReturn(phone,passwrod,'telRechargeTjs',ps,function(err,results){
        if(err){
            cb(err);
        }else{
            if(results.status.errorCode == '0000'){
                return cb(null,results.bizObj);
            }else{
                cb(new Error(results.status.errorMsg));
            }
        }
    },'PublicPayMentHandlerImp');
}

/**
 * 手写字的搜索
 * @param hw
 * @param cb
 * @constructor
 */
exports.SearchHwWords = function(hw,cb){
    methodQuery.doMethodWithAllReturn('getFromData',{formdata:hw},function(err,results){
        if(err){
            cb(err);
        }else{
            if(results.status.errorCode == '0000'){
                var ar =  results.bizObj.split(' ').length ==21 ? results.bizObj.split(' ').slice(1,20) : results.bizObj.split(' ');
                return cb(null,ar);
            }else{
                cb(new Error(results.status.errorMsg));
            }
        }
    });
}
