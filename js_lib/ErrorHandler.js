var query = require('../js_lib/Query.js');
var logger = require('../js_lib/Logger').logger;
var error = [];

exports.SubError = function (com, errorDesc, errorCode, level) {
    errorCode = errorCode ? errorCode : '1';
    level = level ? level : 1;
    var params = {deviceCom: com, errorCode: errorCode, errorDesc: errorDesc, actionLevel: level};
    error.push({type: 'error', params: params});
}
exports.payInfoTjs = function (yin_type, yinlianstr,orderNum) {
    var params = {paytype: yin_type, payinfo: yinlianstr,orderNumber: orderNum};
    sub_baowen(params);
}
exports.orderinfotjs = function (paytype,user, orderNumber, message,payAccount) {
    var params = {payType:paytype,userType : user,orderNumber: orderNumber, message: message,payAccount:payAccount};
    sub_orderbaowen(params);
}
exports.printPapers = function (count) {
        var params = {type: '2', prtCount: count};
        sub_paper(params);
}
function sub_error(params) {
    query.doMethodWithAllReturn('tjDeviceError', params, function (err, returns) {
        if (err || returns.status.errorCode != '0000') {
            error.push({type: 'error', params: params});
        }
    });
}
function sub_orderbaowen(params) {
    query.doMethodWithAllReturn('OrderFailTjs', params, function (err, returns) {
        logger.info('OrderFailTjs-------',JSON.stringify(params));
        if (err || returns.status.errorCode == '9999') {
            //0017 订单已支付//0009 订单不存在//9999 处理异常//0000 成功，处理成功
            logger.error('订单支付报文提交出错:', err, returns);
            error.push({type: 'order', params: params});
        }
    });
}

function sub_baowen(params) {

    query.doMethodWithAllReturn('payInfoTjs', params, function (err, returns) {
        logger.info('payInfoTjs-------',JSON.stringify(params));
        if (err || returns.status.errorCode != '0000') {
            logger.error('银联支付报文支付提交出错:', err, returns);
            error.push({type: 'baowen', params: params});
        }
    });
}
function sub_paper(params) {
    query.doMethodWithAllReturn('updatePrtCount', params, function (err, returns) {
        if (err || returns.status.errorCode != '0000') {
            logger.error('提交打印纸信息出错:', err, returns);
            error.push({type: 'paper', params: params});
        }
    });
}
var sub = function () {
    console.log('sub error or yinlian data all count', error.length, ',at:', new Date().valueOf());
    var item = error.pop();
    if (item) {
        if (item.type == 'error') {
            sub_error(item.params);
        } else if (item.type == 'baowen') {
            sub_baowen(item.params);
        } else if (item.type == 'paper') {
            sub_paper(item.params);
        } else if (item.type == 'order') {
            sub_orderbaowen(item.params);
        }
        setTimeout(sub, 3000);
    } else {
        setTimeout(sub, 1000 * 60);
    }
}
setTimeout(sub, 1000 * 30);