var ffi = require('ffi');
var ref = require('ref');
var ArrayType = require('ref-array');
var iconv = require('iconv-lite');
var charPtr = ref.refType('char');
var CharPtrArrayUp = ArrayType(charPtr);
var CharPtrArray2 = ArrayType(charPtr);
var CharPtrArray3 = ArrayType(charPtr);
var CharPtrArray = ArrayType(charPtr);
var logger = require('../Logger').logger;
var ErrorHandler = require('../ErrorHandler');
var YinLianRes = require('./YinLianResCode');
var lotteryQuery = require('../LotteryQuery');


var path = process.execPath.substr(0,process.execPath.lastIndexOf('\\') + 1)+'yl_dll\\posinf.dll';
var libm = ffi.Library(path, {
    'APPS_Login':['int',['int',CharPtrArray2]],// 1   银行卡（银行卡消费）   3	全民付（信用卡还款 手机充值 水电煤缴费）esponse返回：‘00’表示成功，其他表示失败
    'UMS_OpenCard':['int',[]],//2)	读卡器初始化函数 //返回值:0，表示成功，其他表示失败

    'UMS_CheckCard':['int',[]], //1--读卡器内无卡    2--读卡器内有卡    3--卡在读卡器入口
    'UMS_ReadCard':['int',[]], //返回值:0，表示成功
    'UMS_GetCardData':['int',[CharPtrArray3]],//读卡号
    'UMS_Eject':['int',[]],
    'UMS_Close':['int',[]],//返回值:0，表示成功；其他表示失败
    'PIN_Open':['int',[]],
    'PIN_ReadOneByte':['int',[]],// 0x2A:输入了一个字符 0x08:清除  0x0D:确定  0x02:超时    0x1b:取消
    'PIN_GetPinValue':['int',[]], //8)	密码安全函数 0代表成功，其他代表失败
    'PIN_Destroy':['int',[]], //9)	关闭密码键盘函数 0代表成功，其他代表失败
    'UMS_Pay_Dll':['int',[CharPtrArray3,CharPtrArray]],//10银行卡消费
    'QMF_PayMobel_Dll':['int',[CharPtrArray,CharPtrArray]],//5.手机充值
    'QMF_QueryAccount_DLL':['int',[CharPtrArray,CharPtrArray]],//QMF_QueryAccount_DLL(QMF_QueryAccountDllIn *bank_In, QMF_QueryAccountDllOut *bank_out)
    'QMF_PayAccount_DLL':['int',[CharPtrArray,CharPtrArray]],//6.信用卡还款
    'QMF_KKZZ':['int',[CharPtrArray,CharPtrArray]], //卡卡转账
    'UMS_Query_Dll':['int',[CharPtrArray]]//余额查询
});
function get_money_str(money){
    var pm2 = (money * 100).toString().split('.')[0];
    if(pm2.length < 12){
        var c = 12 - pm2.length;
        for(var i =0;i<c;i++){
            pm2 = '0'+pm2;
        }
    }
    return pm2;
}

/**
 * 支付
 * @param money
 * @param cb
 */
exports.pay = function(money,cb){
    var pm2 = get_money_str(money);
    CharPtrArray3.size =12;
    var b1 = ref.alloc(CharPtrArray3);
    b1.write(pm2);
    var buf = new Buffer(139);
    logger.info('银联付款请求',pm2);
    libm.UMS_Pay_Dll.async(b1,buf,function(err,result){
        if(err){
            cb(err);
        }else{
            var ps = getResult(buf);
            logger.info('银联支付返回：',JSON.stringify(ps));
            ErrorHandler.payInfoTjs('pay',JSON.stringify(ps));
            cb(null,getResponse(ps));
        }
    });
}
function getResponse(ps){
    var bc = {
        success: ps[0] == '00',
        message: YinLianRes[ps[0]] || (ps[0] + '-未知异常'),
        kahao: ps[0] == '00' ? ps[2] : '',
        jiaoyihao: ps[0] == '00' ? ps[10] : ''
    }
    console.log('yinlian returns',ps[0],YinLianRes[ps[0]]);
    return bc;
}
function getResult(d){
    var ps =
        [
            d.toString('ascii',0,2),//返回码 00 表示成功，其它表示失败
            d.toString('ascii',2,6),//银行行号 发卡行代码
            d.toString('ascii',6,26),//卡号
            d.toString('ascii',26,30), //有效期
            d.toString('ascii',30,36),//批次号
            d.toString('ascii',36,42),  //凭证号
            d.toString('ascii',42,54),//金额
            d.toString('ascii',54,94),//备注
            d.toString('ascii',94,109),//商户号
            d.toString('ascii',109,117),//终端号
            d.toString('ascii',117,129),//交易参考号
            d.toString('ascii',129,133),//交易日期
            d.toString('ascii',133,139)//交易时间
        ];
    return ps;
}
exports.pay_phone = function(money,phone,fws,cb){
    var money = get_money_str(money);
    var l = phone.length;
    for(var i = l;i<20;i++){
        phone = phone + ' ';
    }
    var phone_code = fws + phone;
    var bfstr = money + phone_code;
    //console.log(bfstr,'--');
    var bi = new Buffer(bfstr);
    var bout  = new Buffer(139);
    logger.info('银联手机充值请求:',bfstr);
    libm.QMF_PayMobel_Dll.async(bi,bout,function(err,result){
       if(err){
           cb(err);
           logger.error('phone charge error:',err);
       } else{
           var ps = [
                   bout.toString('ascii',0,2),//返回码 00 表示成功，其它表示失败
                   bout.toString('ascii',2,6),//银行行号 发卡行代码
                   bout.toString('ascii',6,26),//卡号（屏蔽部分，保留前6后4）
                   bout.toString('ascii',26,30), //有效期
                   bout.toString('ascii',30,36),//批次号
                   bout.toString('ascii',36,42),  //凭证号
                   bout.toString('ascii',42,54),//金额
                   bout.toString('ascii',54,94),//备注
                   bout.toString('ascii',94,109),//商户号
                   bout.toString('ascii',109,117),//终端号
                   bout.toString('ascii',117,129),//交易参考号
                   bout.toString('ascii',129,133),//交易日期
                   bout.toString('ascii',133,139),//交易时间
                   bout.toString('ascii',139,159),//手机号码
                   bout.toString('ascii',159,171),//中间业务平台流水号
                  ];
           logger.info('手机充值返回',JSON.stringify(ps));
           ErrorHandler.payInfoTjs('phone',JSON.stringify(ps));
           cb(null,getResponse(ps));
       }
    });
}

exports.searchBill = function(cardno,phoneNum,cb){
    if(cardno.length<20){
        for(var i = cardno.length;i<20;i++){
            cardno = cardno+ ' ';
        }
    }else if(cardno > 20){
        cardno = cardno.substr(0,20);
    }
    var c = ref.alloc(CharPtrArray2);
    libm.APPS_Login.async(3,c,function(err,open){
       // console.log(c.toString());
        if(err){
            console.log(err);
            cb(err);
        }else if(c.toString('ascii',0,2) == '00'){
            var bf1 = new Buffer(cardno + phoneNum);
            var bf2 = new Buffer(38);
            libm.QMF_QueryAccount_DLL.async(bf1,bf2,function(err,result){
                if(err){
                    cb(err);
                }else{
                    var ar = [
                        bf2.toString('ascii',0,2),
                        bf2.toString('ascii',2,14),
                        bf2.toString('ascii',14,26),
                        bf2.toString('ascii',26,38)
                    ];
                    logger.info('信用卡查询返回：',JSON.stringify(ar));
                    ErrorHandler.payInfoTjs('credit_bill',JSON.stringify(ar));
                    if(ar[0] == 00){
                        cb(null,parseInt(ar[1]) / 100,parseInt(ar[2]) / 100,parseInt(ar[3]) / 100);
                    }else{
                        cb(new Error('查询出错'));
                    }
                }
            });
        }else{
            cb(new Error('POS注册失败'));
        }
    });
}

exports.pay_credit = function(money,card_no,cb){
    for(var i = card_no.length;i<20;i++){
        card_no = card_no + ' ';
    }
    var pm = get_money_str(money);
    var b1 = new Buffer(pm+card_no);
    var b2 = new Buffer(139);
    logger.info('银联信用卡还款请求',pm,card_no);
    libm.QMF_PayAccount_DLL.async(b1,b2,function(err,result){
        if(err){
            cb(err);
        }else{
            var r = getResult(b2);
            logger.info('信用卡还款返回',JSON.stringify(r));
            ErrorHandler.payInfoTjs('credit',JSON.stringify(r));
            var bc = getResponse(r);
            cb(null,bc);
        }
    });
}
/**
 * 卡卡转账
 * @param money
 * @param tocard_no
 * @param cb
 */
exports.pay_cardtocard = function(money,tocard_no,cb){
    for(var i = tocard_no.length;i<20;i++){
        tocard_no = tocard_no + ' ';
    }
    var pm = get_money_str(money);
    var b1 = new Buffer(pm+tocard_no);
    var b2 = new Buffer(139);
    logger.info('银联卡卡请求',pm,tocard_no);
    libm.QMF_KKZZ.async(b1,b2,function(err,result){
        if(err){
            cb(err);
        }else{
            var r = getResult(b2);
            logger.info('卡卡转账返回:',JSON.stringify(r));
            ErrorHandler.payInfoTjs('cardtocard',JSON.stringify(r));
            var bc = getResponse(r);
            cb(null,bc);
        }
    });
}
/**
 * 银行卡余额查询
 * @param cb
 */
exports.chayu = function(cb){
    var bo = new Buffer(271);
    libm.UMS_Query_Dll.async(bo,function(err,result){
        if(err){
            cb(err);
        }else{
            var bf = getResult(bo);
            logger.info('余额查询返回:',JSON.stringify(bf));
            ErrorHandler.payInfoTjs('chayu',JSON.stringify(bf));
            var bc = {
                success: bf[0] == '00',
                message: YinLianRes[bf[0]],
                money:parseFloat(bf[6]) / 100
            }
            cb(null,bc);
        }
    })
}
var tinert;
var key_done;
exports.readKey = function(cb,cancel_cb,type_cb,retype_cb,time_cb){
    key_done = false;
    var lastTimespan = new Date().valueOf()
    libm.PIN_Open();
    tinert = setInterval(function(){
     //   console.log('key_done--',key_done);
        if(key_done){
            clearInterval(tinert);
            return;
        }
        if((new Date().valueOf() - lastTimespan)/1000 > 40){ //输入密码超时
            console.log('key press time out');
            clearInterval(tinert);
            libm.PIN_Destroy();
            logger.debug('输入密码超时');
            key_done = true;
            cb(new Error('输入密码超时'),null);
            return;
        }
        var key = libm.PIN_ReadOneByte();
        if(key == 13 ){ //确认--自动或手动
            console.log(tinert);
            key_done = true;
            clearInterval(tinert);
            //console.log('enter -13',key_done);
            var pv = -1;
            for(var i =0;i<3;i++){
                if(pv != 0){
                    pv = libm.PIN_GetPinValue();
                    console.log('pin_getpinvalue returns ',pv);
                }
            }
            if(pv !== 0){
           //     console.log('get_pivvalue is not 0',pv);
                logger.error('PIN_GetPinValue不等于0');
                ErrorHandler.SubError(2,'PIN_GetPinValue不等于0',pv,1);
            }
            libm.PIN_Destroy();
            cb(null);
        }else if(key == 27){ //取消-只能退卡
            key_done = true;
            clearInterval(tinert);
            libm.PIN_Destroy();
            cancel_cb();
        }else if(key ==8){//更正
        //    console.log('gegnzheng');
            if(retype_cb){
                retype_cb();
            }
        }else if(key == 42){ //正常密码输入--包括两个0的，只有一次
          //  console.log('enter one key');
            lastTimespan = new Date().valueOf();
            if(type_cb){
                type_cb();
            }
        }else if(key == 2){
            key_done = true;
            clearInterval(tinert);
            libm.PIN_Destroy();
         //   console.log('key is 2!!!');
            cb(new Error('输入密码超时'),null);
        }else{
            console.log('get key is not expect',key);
        }
    },300);
}
var timer_out;
var inter;
exports.readCard=function(loginType,timeout,open_cb,cb){
    console.log(loginType);
    //var c = ref.alloc(CharPtrArray2);
    var bout = new Buffer(2);
    var r1 = libm.APPS_Login(loginType,bout);
    console.log('APPS_Login Return:',r1.toString());
    var r2 = libm.UMS_OpenCard();
    if( r2 != 0){
        ErrorHandler.SubError(1,'读卡器打开设备失败',r2,1);
        logger.error('打开读卡器失败');
        cb(new Error('打开设备失败'));
        return;
    }
    open_cb();
    var istime_out =false;
    timer_out = setTimeout(function(){
        istime_out =true;
        clearInterval(inter);
        var r1 = libm.UMS_Close();
        libm.UMS_Eject();
        if(r1 != 0){
            ErrorHandler.SubError(1,'关闭读卡器失败',r1,1);
            logger.error('关闭读卡失败',r1);
            cb(new Error("关闭读卡器失败啦，请联系我们客服"));
        }else{
            cb(new Error("超时了"));
        }
    },timeout);
    var status = -1;
    inter = setInterval(function(){
        if(istime_out){
            clearInterval(inter);
            return;
        }
        if(status != 2){
            status =libm.UMS_CheckCard();
        }else{
            clearInterval(inter);
            clearTimeout(timer_out);
            libm.UMS_ReadCard();
            var buf = new Buffer(50);
            libm.UMS_GetCardData(buf);
            var regex = new RegExp('\\d+');
            var m = regex.exec(buf.toString());
            libm.UMS_Close();
            libm.UMS_Eject();
            cb(null, m ? m[0] :'');
        }
    },200);
}
exports.readCardData=function(timeout,open_cb,cb){
    var r2 = libm.UMS_OpenCard();
    if( r2 != 0){
        ErrorHandler.SubError(1,'读卡器打开设备失败',r2,1);
        logger.error('打开读卡器失败',r2);
        console.log('open status',r2);
        cb(new Error('打开设备失败'));
        return;
    }
    open_cb();
    var istime_out =false;
    timer_out = setTimeout(function(){
        istime_out =true;
        clearInterval(inter);
        var r1 = libm.UMS_Close();
        libm.UMS_Eject();
        if(r1 != 0){
            ErrorHandler.SubError(1,'关闭读卡器失败',r1,1);
            logger.error('关闭读卡失败',r1);
            cb(new Error("关闭读卡器失败啦，请联系我们客服"));
        }else{
            cb(new Error("超时了"));
        }
    },timeout);
    var status = -1;
    inter = setInterval(function(){
        if(istime_out){
            clearInterval(inter);
            return;
        }
        if(status != 2){
            status =libm.UMS_CheckCard();
        }else{
            clearInterval(inter);
            clearTimeout(timer_out);
            var buf = new Buffer(50);
            libm.UMS_GetCardData(buf);
            var regex = new RegExp('\\d+');
            var m = regex.exec(buf.toString());
            libm.UMS_Close();
            libm.UMS_Eject();
            cb(null, m ? m[0] :'');
        }
    },200);
}

exports.returnCard=function(){
    clearInterval(inter);
    clearTimeout(timer_out);
    console.log('ums_close',libm.UMS_Close());
    console.log('ums_eject',libm.UMS_Eject());
}
exports.return_card = function(){
    clearInterval(inter);
    clearTimeout(timer_out);
    console.log('ums_close',libm.UMS_Close());
    console.log('ums_eject',libm.UMS_Eject());
}

exports.force_return_card=function(){

    clearInterval(inter);
    clearTimeout(timer_out);
    console.log('ums_close',libm.UMS_Close());
    console.log('ums_eject',libm.UMS_Eject());

    var bout = new Buffer(2);
    var r1 = libm.APPS_Login('1',bout);
    console.log('APPS_Login Return:',r1.toString());
    var r2 = libm.UMS_OpenCard();
    if( r2 != 0){
        ErrorHandler.SubError(1,'读卡器打开设备失败',r2,1);
        logger.error('打开读卡器失败');
        cb(new Error('打开设备失败'));
        return;
    }
    clearInterval(inter);
    clearTimeout(timer_out);
    console.log('ums_close',libm.UMS_Close());
    console.log('ums_eject',libm.UMS_Eject());

}