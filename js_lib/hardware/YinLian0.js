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
var fs=require('fs');

var path = process.execPath.substr(0,process.execPath.lastIndexOf('\\') + 1)+'newpos_dll\\umsapi.dll';
var libm = ffi.Library(path, {
    'UMS_Init': ['int', ['int']],
    'UMS_EnterCard': ['int', []],
    'UMS_CheckCard': ['int', [CharPtrArray]],//byte
    'UMS_ReadCard': ['int', [CharPtrArray]],
    'UMS_StartPin': ['int', []],//打开密码键盘
    'UMS_GetOnePass': ['int', [CharPtrArray]],
    'UMS_GetPin': ['int', []],
    'UMS_TransCard': ['int', ['string', CharPtrArray2]],
    'UMS_EjectCard': ['int', []],
    'Tlv_Init': ['int', [CharPtrArray,'int']],///有问题
    'Tlv_AddTag': ['int', ['string', 'string', 'int']],
    'Tlv_GetTag': ['int', ['string', 'string', CharPtrArray3]],
    'Tlv_GetAscData': ['int', [CharPtrArray, CharPtrArray3]]
});
var strCounterId='00000000';//款台号
var strOperId='11111111';//操作员号

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
function formartStr(parm,length){
    if(parm.length<length){
        var d=length-parm.length;
        for(var i=0;i<d;i++){
            parm=' '+parm;
        }
    }
    return parm;
}
function getphone(phone){
    if(phone.length<20){
        var d=20-phone.length;
        for(var i=0;i<d;i++){
            phone=phone+' ';
        }
    }
    return phone;
}

function getResponse(ps){
    var bc = {
        success: ps[0] == '00',
        message: YinLianRes[ps[0]] || (ps[0] + '-未知异常'),
        kahao: ps[0] == '00' ? ps[2] : '',
        jiaoyihao: ps[0] == '00' ? ps[8] : ''
    }
    return bc;
}
function getResult(d){
    var ps =
        [
            d.toString('ascii',0,2),//strRespCode	2	应答码
            d.toString('ascii',2,42),//strRespInfo	40	应答码说明信息
            d.toString('ascii',42,62),//strCardNo	20	交易卡号
            d.toString('ascii',62,74),//strAmount	12	金额
            d.toString('ascii',74,80),//strTrace	6	终端流水号（凭证号）
            d.toString('ascii',80,86),//strBatch	6	批次号
            d.toString('ascii',86,90),//strTransDate	4	交易日期MMDD
            d.toString('ascii',90,96),//strTransTime	6	交易时间hhmmss
            d.toString('ascii',96,108),//strRef	12	系统参考号（中心流水号）
            d.toString('ascii',108,114),//strAuth	6	授权号
            d.toString('ascii',114,626),//strMemo	512	48域附加信息（采用第4章所述格式传出）
            d.toString('ascii',626,629)//strLrc	3	3个校验字符
        ];
    return ps;
}
function setstrMemo(paytype,transtype,params){
    if(transtype=='01'){//01:手机充值
        var buf=new Buffer(1024);
        var ret=libm.Tlv_Init(buf,1024);
        logger.info('初始化返回:'+ret);
        if(ret=='0'){
            logger.info('手机充值TLV初始化成功',ret);
            logger.info('tag值',params.opraBusiness,params.phone);
            var r=libm.Tlv_AddTag('0F13',params.opraBusiness,2);
            var res=libm.Tlv_AddTag('0F12',params.phone,11);
            logger.info('手机充值TLV初始化成功',ret,r,res);
            if(r>0){
                logger.info('手机充值添加tag成功',r);
            }else{
                logger.error('手机充值添加tag失败',r);
            }
        }
        logger.info('手机充值添加tag=end,\0');
        return buf;
    }else if(transtype=='00'){//00:消费
        var tg1=formartStr(' ',1024);
        return tg1;
    }else if(transtype=='03'&&paytype=='1'){//03:查余 传统类交易： 全民付交易：
        var tg1=formartStr(' ',1024);
        return tg1;
    }else if(transtype=='03'&&paytype=='2'){//03:信用卡还款缴费
        var tg1=new Buffer(1024);
        var ret=libm.Tlv_Init(tg1,1024);
        if(ret=='0'){
            logger.info('信用卡还款TLV初始化成功',ret);
            libm.Tlv_AddTag('0F14',params.cardNo,params.cardNo.length);
            libm.Tlv_AddTag('0F12','18621321780', 11);
        }
        return tg1;
    }else if(transtype=='02'){//02:信用卡还款查询
        var tg1=new Buffer(1024);
        var ret=libm.Tlv_Init(tg1,1024);
        if(ret=='0'){
            var r=libm.Tlv_AddTag('0F14',params.cardNo,params.cardNo.length);
            var ret1 = libm.Tlv_AddTag('0F12', '18621321780', 11);
            logger.info('信用卡还款查询TLV初始化成功',ret,r,ret1);
        }
        return tg1;
    }else if(transtype=='04'){//04：卡卡转账
        var tg1=new Buffer(1024);
        var ret=libm.Tlv_Init(tg1,1024);
        if(ret=='0'){
            logger.info('卡卡转账tlv_init初始化成功',ret);
            libm.Tlv_AddTag('0F16',params.tocardno,params.tocardno.length);
        }
        return tg1;
    }
    return tg1;
}
function getstrReq(paytype,strTransType,money,params){
    if(paytype=='1'&&strTransType=='00'){//00:消费  05:签到 logger.info()
        var strAmount=get_money_str(money);
        var strMemo=setstrMemo(paytype,00,params);
        var bw=strCounterId+strOperId+'00'+strAmount+'333333'+'44444444'+'555555555555'
            +'666666'+'777777'+strMemo.toString()+'888';
        return bw;
    }else if(strTransType=='01'){//01:手机充值
        //logger.info('组织手机充值报文==============start,\0');
        var strAmount=get_money_str(money);
        var strMemo=setstrMemo(paytype,01,params);
        var bw=strCounterId+strOperId+'01'+strAmount+'333333'+'44444444'+'555555555555'
            +'666666'+'777777'+strMemo.toString()+'888';
        logger.info('组织手机充值报文==============end,\0',bw);
        return bw;
    }else if(strTransType=='03'){//03:查余   03:信用卡还款缴费
        var strAmount=get_money_str(money);
        var strMemo=setstrMemo(paytype,03,params);
        var bw=strCounterId+strOperId+'03'+strAmount+'333333'+'44444444'+'555555555555'
            +'666666'+'777777'+strMemo.toString()+'888';
        return bw;
    }else if(strTransType=='02'){//02:信用卡还款查询
        var strAmount=get_money_str(100);
        var strMemo=setstrMemo(paytype,02,params);
        var bw=strCounterId+strOperId+'02'+strAmount+'333333'+'44444444'+'555555555555'
            +'666666'+'777777'+strMemo.toString()+'888';
        return bw;
    }else if(strTransType=='04'){//04：卡卡转账
        var strAmount=get_money_str(money);
 var strMemo=setstrMemo(paytype,04,params);
        var bw=strCounterId+strOperId+'04'+strAmount+'333333'+'44444444'+'555555555555'
            +'666666'+'777777'+strMemo.toString()+'888';
        return bw;
    }
}
function checkcard(){
    var buf=new Buffer(8);
    libm.UMS_CheckCard(buf);
    logger.info('检测状态：',buf,buf.toString());
    var state =parseInt(buf[0]);
    if(state==0x31){
        return 0;
    }else if(state==0x32){
        return 0;
    }else if(state==0x33){
        return 0;
    }else if(state==0x34){
        logger.info('卡在卡口位置',buf);
        return -1;
    }else if(state==0x35){
        logger.info('未检测到卡');
        return -1;
    }else if(state==0x36){
        return  2;
    }else if(state==0x37){
        logger.info('内部有卡');
        return 0;
    }else{
        return -1;
    }
}
//彩票付款
exports.pay= function (money,cb) {
    var params='';
    var b1=getstrReq(1,'00',money,params);
    var buf=new Buffer(1200);
    logger.info('银联付款请求',money);
    //console.log('付款银联付款请求',b1);
    libm.UMS_TransCard.async(b1,buf, function (err,res) {
        if(err){
            cb(err);
            logger.error('lottery error:',err);
        } else{
            var rest=getResult(buf);
            logger.info('付款结果',rest);
            cb(null,getResponse(rest));
        }
    })
}
//手机充值
exports.pay_phone = function(money,phone,fws,cb){
    logger.info('手机充值交易');
    //  手机充值	手机号码（0F12）、运营商类别（0F13）
    var params={phone:getphone(phone),opraBusiness:fws}
    var b1=getstrReq(2,'01',money,params);
    logger.info('请求报文：'+params,b1);
    var buf=new Buffer(1200);
    libm.UMS_TransCard.async(b1,buf, function (err,res) {
        if(err){
            logger.error('手机充值error:',err);
        }else{
            var r=getResult(buf);
            logger.info('手机充值 info:',getResponse(getResult(r)));
            cb(null,getResponse(r));
        }
    });
}
//信用卡查询
exports.searchBill = function(cardno,phoneNum,cb){
    libm.UMS_Init(2);
    var params={cardNo:cardno,phoneno:phoneNum};
    var b1=getstrReq(2,'02','',params);
    var buf=new Buffer(1200);
    libm.UMS_TransCard.async(b1,buf, function (err,res) {
        logger.info('查询手续费：',b1,buf,buf.toString());
        if(err){
            logger.error('信用卡查询 error:',err);
        }else{
            var r=getResult(buf);
            var buf1=new Buffer(512);
            var iret=libm.Tlv_GetTag(r[10],'0F15',buf1);
            if(iret=='0'){
                logger.info('getTag success:',iret)
            }
            var regex = new RegExp('\\d+');
            var m = regex.exec(buf1.toString());
            logger.info('48域返回结果', r,r[10]);
            logger.info('信用卡查询 info:',iconv.decode(buf1,'gbk'), m);
            cb(null,'',m?m[0]:'');
        }
    });
}
//信用卡还款
exports.pay_credit = function(money,card_no,phoneNum,cb) {
    var params={cardNo:card_no,phoneno:phoneNum};
    var b1=getstrReq(2,'03',money,params);
    var buf=new Buffer(1200);
    logger.info('还款金额',money);
    libm.UMS_TransCard.async(b1,buf, function (err,res) {
        if(err){
            logger.error('信用卡还款 error:',err);
        }else{
            var r=getResult(buf);
            logger.info('信用卡还款 info:',r);
            cb(null,getResponse(r));
        }
    })
}
//卡卡转账
exports.pay_cardtocard = function(money,tocard_no,cb){
    var params={tocardno:tocard_no};
    var b1=getstrReq('2','04',money,params);
    var buf=new Buffer(1200);
    logger.info('转账金额',money);
    libm.UMS_TransCard.async(b1,buf, function (err,res) {
        if(err){
            logger.error('交易出错：',err.message);
        }else{
            var r=getResult(buf);
            logger.info('卡卡转账 info:',getResponse(getResult(r)));
            cb(null,getResponse(r));
        }
    })
}

//银行卡余额查询
exports.chayu = function(cb){
    var params='';
    var b1=getstrReq('1','03','',params);
    var buf=new Buffer(1200);
    libm.UMS_TransCard.async(b1,buf, function (err,res) {
        if(err){
            logger.error('查询余额出错：'+err);
        }else{
            var r=getResult(buf);
            if(r[0]=='00')
            {
                var count =parseInt(r[3]);
                //console.log(count/100);
                var result={
                    success:true,
                    message:YinLianRes[r[0]] || (r[0] + '-未知异常'),
                    money:count/100
                }
                logger.info('查询余额：'+r,iconv.encode(JSON.stringify(result),'gbk'));
                //console.log('查询余额：'+r,iconv.encode(JSON.stringify(result),'gbk'));
                cb(null,result);//返回余额
            }else{
                var result={
                    success:false,
                    message:YinLianRes[r[0]] || (r[0] + '-未知异常'),
                    money:0
                }
                logger.info('查询余额：'+r,result);
                cb(null,result);//返回余额
            }
        }
    })
}

var tinert;
var key_done;
exports.readKey = function(cb,cancel_cb,type_cb,retype_cb,time_cb){
    key_done = false;
    var lastTimespan = new Date().valueOf();
    libm.UMS_StartPin();//开启密码键盘
    tinert = setInterval(function(){
        if(key_done){
            clearInterval(tinert);
            return;
        }
        if((new Date().valueOf() - lastTimespan)/1000 > 40){ //输入密码超时
            console.log('key press time out');
            clearInterval(tinert);
            logger.debug('输入密码超时');
            key_done = true;
            cb(new Error('输入密码超时'),null);
            return;
        }
        var key=new Buffer(10);
        libm.UMS_GetOnePass.async(key, function (err,res) {
            if(parseInt(key[0])== 13 ){ //确认--自动或手动
                console.log(tinert);
                key_done = true;
                clearInterval(tinert);
                var pv = -1;
                for(var i =0;i<3;i++){
                    if(pv != 0){
                        pv = libm.UMS_GetPin();
                        logger.info('pin_getpinvalue returns ',pv);
                    }
                }
                if(pv !== 0){
                    logger.error('PIN_GetPinValue不等于0');
                    //ErrorHandler.SubError(2,'PIN_GetPinValue不等于0',pv,1);
                }
                cb(null);
            }else if(parseInt(key[0])== 27){ //取消-只能退卡
                key_done = true;
                clearInterval(tinert);
                cancel_cb();
            }else if(parseInt(key[0]) == 8){//更正
                lastTimespan = new Date().valueOf();
                if(retype_cb){
                    retype_cb();
                }
            }else if(parseInt(key[0]) == 42){ //正常密码输入--包括两个0的，只有一次
                //  console.log('enter one key');
                lastTimespan = new Date().valueOf();
                if(type_cb){
                    type_cb();
                }
            }else{
                logger.info('没接收到返回值',parseInt(key[0]));
            }
            /*else if(parseInt(key[0]) == 2){
                key_done = true;
                clearInterval(tinert);
                logger.info('输入超时');
                cb(new Error('输入密码超时'),null);
            }*/
        });
    },300);
}
var timer_out;
var inter;
exports.readCard = function (loginType, timeout, open_cb, cb) {
    var r1 = libm.UMS_Init(loginType);
    logger.info('UMS_init Return:', r1.toString());
    var r2 = libm.UMS_EnterCard();
    if (r2 != 0) {
        ErrorHandler.SubError(1, '读卡器打开设备失败', r2, 1);
        logger.error('打开读卡器失败',r2);
        cb(new Error('打开设备失败'));
        return;
    }
    open_cb();
    var istime_out = false;
    timer_out = setTimeout(function () {
        istime_out = true;
        clearInterval(inter);
        libm.UMS_EjectCard();
        cb({message:'读卡超时，请取卡'});
    }, timeout);
    var status = -1;
    inter = setInterval(function () {
        if (istime_out) {
            clearInterval(inter);
            return;
        }
        if (status != 0 && status != 2) {
            status = checkcard();
        }else if(status==2){
            clearInterval(inter);
            clearTimeout(timer_out);
            libm.UMS_EjectCard();
            cb({message:'不支持的卡，请取卡'});
        }else {
            clearInterval(inter);
            clearTimeout(timer_out);
            var buf = new Buffer(100);
            buf.fill(' ');
            buf.write("0");//联机账户
            var ret=-1;
            for(var i=0;i<3;i++){
                ret= libm.UMS_ReadCard(buf);
                if(ret == 0){
                    break;
                }
            }
            if(ret==0){
                console.log('读卡成功',buf,buf.toString().trim());
               var regex = new RegExp('\\d+');
               var m = regex.exec(buf.toString().trim());
               logger.info('读卡成功',buf,m ? m[0] : '',buf.toString('ascii',0,19).trim());
               cb(null, m ? m[0] : '');
                //cb(null,buf.toString().trim() ? buf.toString().trim() : '');
            }else{
                libm.UMS_EjectCard();
                cb({message:'读卡失败，请取卡'});
            }
        }
    },1000);
};
exports.readCardData=function(timeout,open_cb,cb){
    libm.UMS_Init(2);
    var r2 = libm.UMS_EnterCard();
    if( r2 != 0){
        ErrorHandler.SubError(1,'读卡器打开设备失败',r2,1);
        logger.error('打开读卡器失败',r2);
        cb(new Error('打开设备失败'));
        return;
    }
    open_cb();

    var istime_out =false;
    timer_out = setTimeout(function(){
        istime_out =true;
        clearInterval(inter);
        var r1=libm.UMS_EjectCard();
        if(r1 != 0){
            ErrorHandler.SubError(1,'关闭读卡器失败',r1,1);
            logger.error('关闭读卡失败',r1);
            cb({message:"关闭读卡器失败啦，请联系我们客服"});
        }else{
            cb({message:'读卡失败，请取卡'});
        }
    },timeout);
    var status = -1;
    inter = setInterval(function(){
        if(istime_out){
            clearInterval(inter);
            libm.UMS_EjectCard();
            cb({message:'读卡超时，请取卡'});
            return;
        }
        if(status != 0){
            status =checkcard();
        }else if(status==2){
            clearInterval(inter);
            clearTimeout(timer_out);
            libm.UMS_EjectCard();
            cb({message:'不支持的卡，请取卡'});
        }else{
            clearInterval(inter);
            clearTimeout(timer_out);
            var b=new Buffer(100);
            b.fill(' ');
            b.write("0");//联机账户
            var ret=-1;
            for(var i=0;i<3;i++){
                ret= libm.UMS_ReadCard(b);
                if(ret == 0){
                    break;
                }
            }
            if(ret==0){
                console.log('读卡成功',b,b.toString().trim());
                var regex = new RegExp('\\d+');
                var m = regex.exec(b.toString().trim());
                logger.info('读卡成功',b,m ? m[0] : '',b.toString('ascii',0,19).trim());
                cb(null, m ? m[0] : '');
                libm.UMS_EjectCard();
               // cb(null,buf.toString().trim() ? buf.toString().trim() : '');
            }else{
                libm.UMS_EjectCard();
                cb({message:'读卡失败，请取卡'});
            }
        }
    },1000);
}
exports.returnCard=function(){
    clearInterval(inter);
    clearTimeout(timer_out);
    console.log('ums_eject',libm.UMS_EjectCard());
}
exports.return_card = function(){
    clearInterval(inter);
    clearTimeout(timer_out);
    console.log('ums_eject',libm.UMS_EjectCard());
}
exports.force_return_card=function(cb){
    clearInterval(inter);
    clearTimeout(timer_out);
    var bout = new Buffer(2);
    var r1 = libm.UMS_Init(1);
    var r2 = libm.UMS_EnterCard();
    if( r2 != 0){
        ErrorHandler.SubError(1,'读卡器打开设备失败',r2,1);
        logger.error('打开读卡器失败');
        cb(new Error('打开设备失败'));
        return;
    }
    clearInterval(inter);
    clearTimeout(timer_out);
    console.log('ums_eject',libm.UMS_EjectCard());
}

