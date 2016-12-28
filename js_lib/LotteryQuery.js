var Query = require('../js_lib/Query.js');
var encry = require('../js_lib/EncryptUtil.js');
var logger = require('../js_lib/Logger').logger;
var ErrorHandler = require('../js_lib/ErrorHandler');

function getPlayType (lottery,tzfs){
    if(lottery == 'ssq' || lottery == '307'|| lottery== '22x5'){
        if(tzfs.indexOf('直')>=0 || tzfs.indexOf('单') >=0 ){
            return '101';
        }
        if(tzfs.indexOf('复')>=0){
            return '102';
        }
        if(tzfs.indexOf('胆')){
            return '103';
        }
    }else if(lottery == '3d'){
        if(tzfs == '直选单式' ){
            return '201';
        }else if(tzfs == '组3单式'){
            return '202';
        }else if(tzfs == '组6单式'){
            return '203';
        }else if(tzfs == '直选复式'){
            return '204';
        }else if(tzfs == '组3复选'){
            return '205';
        }else if(tzfs == ' 组6复选'){
            return '206'
        }else if(tzfs == '直选包点'){
            return '207';
        }else if(tzfs == '组三包点'){
            return '208';
        }else if(tzfs == '组六包点'){
            return '209';
        }else if(tzfs == '直选组合包胆'){
            return '210';
        }else if(tzfs == '直选组合复式'){
            return '211';
        }else if(tzfs=='组选包点'){
            return '212';
        }else if(tzfs=='组选包胆'){
            return '213';
        }else if(tzfs=='包号'){
            return '214';
        }
    }else if(lottery=='k3'){
        if(tzfs==''){

        }
    }
    return '';
}
//普通下单
exports.makeOrder = function(user,password,lotteryInfo,cb){
    var tempssq=[],temp307=[],temp3d=[],temp22x5=[];
    var lot_list = [];

    for(var i=0;i<lotteryInfo.tickets.length;i++){
        var ticket = lotteryInfo.tickets[i];
        var obj = {
            lottery_type:ticket.lottery_type,
            play_type_code:ticket.play_type_code,
            beishu:ticket.beishu,
            zhuihao:ticket.zhuihao,
            zhushu:ticket.zhushu?ticket.zhushu:'',//如果快三专用
            money:ticket.money,
            issue:ticket.issue
        };
        if(ticket.lottery_type == 'ssq'){
            if(ticket.play_type_code == '103'){
                obj.nums = ticket.nums.dan.toString() + '$' + ticket.nums.tuo.toString() + '#' + ticket.nums.blue.toString();
            }else{
                obj.nums = ticket.nums.red.toString() + '#' + ticket.nums.blue.toString();
            }

        }else if(ticket.lottery_type == '307'){
            if(ticket.play_type_code == '103'){
                obj.nums = ticket.nums.dan.toString() + '$' + ticket.nums.tuo.toString();
            }else{
                obj.nums = ticket.nums.red.toString();
            }

        }else if(ticket.lottery_type == '3d'){
            if(ticket.play_type_code == '201'){
                obj.nums =  ticket.nums.bai.toString() + ',' + ticket.nums.shi.toString() + ',' + ticket.nums.ge.toString();
            }else if(ticket.play_type_code == '202' || ticket.play_type_code == '203'){
                obj.nums = ticket.nums.hao1.toString() + ',' + ticket.nums.hao2.toString() + ',' + ticket.nums.hao3.toString();
            }else if(ticket.play_type_code == '204'){
                obj.nums =  ticket.nums.bai.join('') + ',' + ticket.nums.shi.join('') + ',' + ticket.nums.ge.join('');
            }else if(ticket.play_type_code == '205'){
                obj.nums = ticket.nums.z3fs.toString();
            }else if(ticket.play_type_code == '206'){
                obj.nums = ticket.nums.z6fs.toString();
            }else if(ticket.play_type_code == '207'){
                obj.nums = ticket.nums.zhxbd.toString();
            }else if(ticket.play_type_code == '208'){
                obj.nums = ticket.nums.z3bd.toString();
            }else if(ticket.play_type_code == '209'){
                obj.nums = ticket.nums.z6bd.toString();
            }else if(ticket.play_type_code == '212'){
                obj.nums = ticket.nums.zxbd.toString();
            }else if(ticket.play_type_code == '214'){
                obj.nums = (ticket.nums.bai && ticket.nums.bai.length > 0 ? ticket.nums.bai.toString() : '255') + ',' + (ticket.nums.shi && ticket.nums.shi.length > 0 ? ticket.nums.shi.toString() : '255')+ ',' + (ticket.nums.ge && ticket.nums.ge.length > 0 ? ticket.nums.ge.toString() : '255');
            }

        }else if(ticket.lottery_type == '22x5'){
            if(ticket.play_type_code == '103' || ticket.play_type_code == '108' || ticket.play_type_code == '111' || ticket.play_type_code == '114' ){
                obj.nums = ticket.nums.dan.toString() + '$' +ticket.nums.tuo.toString();
            }else{
                obj.nums  = ticket.nums.red.toString();
            }
        }else if(ticket.lottery_type=='k3'){
            if(ticket.play_type_code=='102'||ticket.play_type_code=='108'){
                obj.nums='255,255,255';
            }else if(ticket.play_type_code=='107'||ticket.play_type_code=='104'){
                obj.nums=ticket.nums.red.toString().substr(0,1)+','+ticket.nums.red.toString().substr(1,1)+',255';
            }else if(ticket.play_type_code=='101'){
                obj.nums=ticket.nums.red.toString();
            }else{
                obj.nums=ticket.nums.red.toString().substr(0,1)+','+ticket.nums.red.toString().substr(1,1)+','+ticket.nums.red.toString().substr(2,1);
            }
        }
        lot_list.push(obj);

    }
    var order_info ={
        backbonusType:lotteryInfo.backbonusType,
        orderbonus:lotteryInfo.orderbonus,
        tickets:encry.des3cbc(JSON.stringify(lot_list))
    };
    var params = {CpOrdermap:encry.des3cbc(JSON.stringify(order_info))};
    logger.info('=======interface:makeorder========',order_info);
    Query.doMethodWithHeadAllReturn(user,password,'CpOrderTjs',params,function(err,returns){
        if(err){
            logger.error(err);
            cb(err,null);
        }else{
            if(returns.status.errorCode =='0000'){
                logger.info('==========make order success:======',JSON.stringify(lot_list),'--number:',returns.bizObj);
                cb(null,returns.bizObj);
            }else if(returns.status.errorCode=='0015'){
                cb(new Error(returns.status.errorMsg),'');
            }else{
                logger.error('======make order error:====',JSON.stringify(lot_list),' -- returns:',JSON.stringify(returns));
                cb(new Error("下单失败"),'');
            }
        }
    })
}

//普通下单
exports.makeOrderk3 = function(user,password,lotteryInfo,cb){
    var lot_list = [];

    for(var i=0;i<lotteryInfo.tickets.length;i++){
        var ticket = lotteryInfo.tickets[i];
        var obj = {
            lottery_type:ticket.lottery_type,
            play_type_code:ticket.play_type_code,
            beishu:ticket.beishu,
            zhuihao:ticket.zhuihao,
            zhushu:ticket.zhushu?ticket.zhushu:'',//如果快三专用
            money:ticket.money,
            issue:ticket.issue
        };
        if(ticket.lottery_type == 'ssq'){
            if(ticket.play_type_code == '103'){
                obj.nums = ticket.nums.dan.toString() + '$' + ticket.nums.tuo.toString() + '#' + ticket.nums.blue.toString();
            }else{
                obj.nums = ticket.nums.red.toString() + '#' + ticket.nums.blue.toString();
            }

        }else if(ticket.lottery_type == '307'){
            if(ticket.play_type_code == '103'){
                obj.nums = ticket.nums.dan.toString() + '$' + ticket.nums.tuo.toString();
            }else{
                obj.nums = ticket.nums.red.toString();
            }

        }else if(ticket.lottery_type == '30x5'){
            if(ticket.play_type_code == '103'){
                obj.nums = ticket.nums.dan.toString() + '$' + ticket.nums.tuo.toString();
            }else{
                obj.nums = ticket.nums.red.toString();
            }

        }else if(ticket.lottery_type == '3d'){
            if(ticket.play_type_code == '201'){
                obj.nums =  ticket.nums.bai.toString() + ',' + ticket.nums.shi.toString() + ',' + ticket.nums.ge.toString();
            }else if(ticket.play_type_code == '202' || ticket.play_type_code == '203'){
                obj.nums = ticket.nums.hao1.toString() + ',' + ticket.nums.hao2.toString() + ',' + ticket.nums.hao3.toString();
            }else if(ticket.play_type_code == '204'){
                obj.nums =  ticket.nums.bai.join('') + ',' + ticket.nums.shi.join('') + ',' + ticket.nums.ge.join('');
            }else if(ticket.play_type_code == '205'){
                obj.nums = ticket.nums.z3fs.toString();
            }else if(ticket.play_type_code == '206'){
                obj.nums = ticket.nums.z6fs.toString();
            }else if(ticket.play_type_code == '207'){
                obj.nums = ticket.nums.zhxbd.toString();
            }else if(ticket.play_type_code == '208'){
                obj.nums = ticket.nums.z3bd.toString();
            }else if(ticket.play_type_code == '209'){
                obj.nums = ticket.nums.z6bd.toString();
            }else if(ticket.play_type_code == '212'){
                obj.nums = ticket.nums.zxbd.toString();
            }else if(ticket.play_type_code == '214'){
                obj.nums = (ticket.nums.bai && ticket.nums.bai.length > 0 ? ticket.nums.bai.toString() : '255') + ',' + (ticket.nums.shi && ticket.nums.shi.length > 0 ? ticket.nums.shi.toString() : '255')+ ',' + (ticket.nums.ge && ticket.nums.ge.length > 0 ? ticket.nums.ge.toString() : '255');
            }

        }else if(ticket.lottery_type == '22x5'){
            if(ticket.play_type_code == '103' || ticket.play_type_code == '108' || ticket.play_type_code == '111' || ticket.play_type_code == '114' ){
                obj.nums = ticket.nums.dan.toString() + '$' +ticket.nums.tuo.toString();
            }else{
                obj.nums  = ticket.nums.red.toString();
            }
        }else if(ticket.lottery_type=='k3'){
            if(ticket.play_type_code=='102'||ticket.play_type_code=='108'){
                obj.nums='255,255,255';
            }else if(ticket.play_type_code=='107'||ticket.play_type_code=='104'){
                obj.nums=ticket.nums.red.toString().substr(0,1)+','+ticket.nums.red.toString().substr(1,1)+',255';
            }else if(ticket.play_type_code=='101'){
                obj.nums=ticket.nums.red.toString();
            }else{
                obj.nums=ticket.nums.red.toString().substr(0,1)+','+ticket.nums.red.toString().substr(1,1)+','+ticket.nums.red.toString().substr(2,1);
            }
        }
        lot_list.push(obj);

    }
    var order_info ={
        backbonusType:lotteryInfo.backbonusType,
        orderbonus:lotteryInfo.orderbonus,
        tickets:encry.des3cbc(JSON.stringify(lot_list))
    };
    var params = {CpOrdermap:encry.des3cbc(JSON.stringify(order_info))};
    logger.info('=======interface:makeorder========',order_info);
    Query.doMethodWithHeadAllReturn(user,password,'cpTjs',params,function(err,returns){
        if(err){
            logger.error(err);
            cb(err,null);
        }else{
            if(returns.status.errorCode =='0000'){
                logger.info('==========make order success:======',JSON.stringify(lot_list),'--number:',returns.bizObj);
                cb(null,returns.bizObj);
            }else if(returns.status.errorCode=='0015'){
                cb(new Error(returns.status.errorMsg),'');
            }else{
                logger.error('======make order error:====',JSON.stringify(lot_list),' -- returns:',JSON.stringify(returns));
                cb(new Error("下单失败"),'');
            }
        }
    })
}
//使用账户余额支付
exports.payOrderByAccount = function(user,password,orderNumber,paypassword,payAmount,coupon_info,cb){
    var pay = {
        orderNumber:orderNumber,
        userName:encry.des3cbc(user),
        payType :"0",//0余额，1银行卡
        cardNo:'',
        payAmount:payAmount.toString(),
        trandeNo:'',
        paypwd:encry.des3cbc(paypassword),
        couponsAmount:coupon_info && coupon_info.money ? coupon_info.money : '',
        couponsMsg:coupon_info && coupon_info.num ? coupon_info.num : ''
    }
    //console.log(pay);
    var params = {pay:encry.des3cbc(JSON.stringify(pay))};
    Query.doMethodWithHeadAllReturn(user,password,'payment',params,function(err,returns){
        //console.log('余额支付：',user,password,pay,returns);
        if(err){
            logger.error('payment request error:',err,'user:',user,'params:',JSON.stringify(params));
            cb(err,null);
        }else{
            if(returns.status.errorCode =='0000' || returns.status.errorCode == '0017'){
                var res = {success:true,info:JSON.parse(encry.decodeDes3cbc(returns.bizObj))};
                //var res = {success:true,info:returns.bizObj};
                logger.info('=====余额支付成功：====',JSON.stringify(res));
                cb(null,res);
            }else{
                logger.error('=====余额支付失败：====',JSON.stringify(returns));
                cb(null,{success:false,message : returns.status.errorMsg});
            }
        }
    })
}
//付款--银行卡
exports.payOrder = function(user,password,orderNum,cardNo,payAmount,tradNo,coupon_info,cb){
    var pay = {
        orderNumber:orderNum,
        userName:encry.des3cbc(user),
        payType :"1",//0余额，1银行卡
        cardNo:cardNo,
        payAmount:payAmount,
        trandeNo:tradNo,
        paypwd:'',
        couponsAmount:coupon_info ? coupon_info.money : '',
        couponsMsg:coupon_info ? coupon_info.num : ''
    }
    var params = {pay:encry.des3cbc(JSON.stringify(pay))};
    logger.info('=====银行卡pay order=====',JSON.stringify(pay),params);
    Query.doMethodWithHeadAllReturn(user,password,'payment',params,function(err,returns){
        if(err){
            logger.error('payment request error:',err,'user:',user,'params:',JSON.stringify(pay));
            ErrorHandler.payInfoTjs(pay.payType,JSON.stringify(pay));
            cb(err,null);

        }else{
            if(returns.status.errorCode =='0000' || returns.status.errorCode == '0017'){
                var res = {success:true,info:JSON.parse(encry.decodeDes3cbc(returns.bizObj))};
                //var res = {success:true,info:returns.bizObj};
                logger.info('====pay success returns:======',JSON.stringify(res));
                cb(null,res);
            }else{
                logger.error('支付失败：',JSON.stringify(returns));
                cb(null,{success:false,message : returns.status.errorMsg});
            }
        }
    })
}
//获得最新奖期
exports.getAward = function(gs,cb){
    var p={gameStatus:encry.des3cbc(gs)};
    Query.doMethodWithAllReturn('getaward',p,function(err,infos){
        if(err){
            logger.error('=====获得最新奖期出错：====',err);
            //console.log(err);
            cb(err);
        } else{
            if(infos.status.errorCode != '0000'){
                logger.error('获得最新奖期失败：',infos);
                //console.log(infos);
                cb(new Error('获得最新奖期失败'));
            }else{
                //logger.info('获得最新奖期成功：',JSON.stringify(infos));
                cb(null,JSON.parse(encry.decodeDes3cbc(infos.bizObj)));
            }
        }
    });
}
//获得所有彩票的开奖信息
exports.getAllKaiJiang = function(cb){
    Query.doMethodWithAllReturn('getAllKaiJiangInfo','',function(err,infos){
        if(err){
            logger.error('获取所有开奖信息错误：',err);
            cb(err);
        }else{
            if(infos.status.errorCode != '0000'){
                logger.error('获取所有开奖信息失败：',JSON.stringify(infos));
                cb(new Error('获取所有开奖信息失败'));
            }else{
                logger.info('获取所有开奖信息成功：',JSON.stringify(infos));
                cb(null,JSON.parse(encry.decodeDes3cbc(infos.bizObj)));
            }
        }
    });
}

exports.getnotice= function (cb) {
    Query.doMethodWithAllReturn('GetNotice','',function (err,res) {
        if(err){
        }else{
            if(res.status.errorCode == '0001'){
                cb(res.status.errorCode);
            }else if(res.status.errorCode == '0000'){
                //logger.info('获取开奖信息成功：',JSON.stringify(infos));
                cb(null,encry.decodeDes3cbc(res.bizObj));
            }
        }
    })
}

//获得某个彩票开奖的信息
exports.getKaiJiangByLottery = function(lotteryType,cb){
    var params = {type:lotteryType};
    Query.doMethodWithAllReturn('getKaiJiangInfo',params,function(err,infos){
        if(err){
            //console.log(err);
            logger.error('获取开奖信息错误：',err);
            cb(err);
        }else{
            if(infos.status.errorCode != '0000'){
                logger.error('获取开奖信息失败：',JSON.stringify(infos));
                cb(new Error('获取开奖信息失败'));
            }else{
                //logger.info('获取开奖信息成功：',JSON.stringify(infos));
                cb(null,JSON.parse(encry.decodeDes3cbc(infos.bizObj)) );
            }
        }
    });
}

//获取当前服务器时间
exports.getCurrentServerTime = function (cb) {
    Query.doMethodWithAllReturn('getDateTime', '',function (err,time) {
        if(err){
            logger.error('获取当前服务器时间出错：',err);
            cb(err);
        }else{
            //console.log(time.bizObj);
            if(time.status.errorCode != '0000'){
                logger.error('获取当前服务器时间出错：',time);
                cb(new Error('获取当前服务器时间出错'));
            }else{
                logger.info('获取当前服务器时间成功：',JSON.stringify(time));
                cb(null,time.bizObj);
            }
        }
    })
}
//开奖详情
exports.getKaijiangDetail = function(lottery,round,cb){
    var params = {lotteryType:lottery,issueNumber:round};
    logger.info('=====开奖详情====',JSON.stringify(params));
    Query.doMethodWithAllReturn('getlotterydetails',params,function(err,infos){
        if(err){
            //console.log(err);
            logger.error('获取开奖详情错误：',err);
            cb(err);
        }else{
            if(infos.status.errorCode != '0000'){
                //console.log(infos);
                logger.error('获取开奖详情失败',infos);
                cb(new Error('获取开奖详情失败'));
            }else{
                logger.info('=====开奖详情====',JSON.stringify(infos));
                cb(null,JSON.parse(encry.decodeDes3cbc(infos.bizObj)));
            }
        }
    });
}
//获取遗漏次数 //2014044
exports.getBallMiss = function(lotteryType,issue,cb){
    Query.doMethodWithAllReturn('getOmission',{gameName:lotteryType,qihao:issue},function(err,returns){
        if(err){
            logger.error('获得球遗漏出错:',err);
            cb(err);
        }else{
            if(returns.status.errorCode == '0000'){
                logger.info('=====获取遗漏次数====',JSON.stringify(returns));
                cb(null,JSON.parse(encry.decodeDes3cbc(returns.bizObj)));
            }else{
                //console.log(returns);
                logger.error('获得球遗漏错误',returns)
                cb(new Error('获得球遗漏错误'));
            }
        }
    });
}

//基本走势图
exports.getTrend = function(lotteryType,issue_num,paging,pagesize,cb){
    Query.doMethodWithAllReturn('getSimpleTrend',{gameName:lotteryType,qishu:issue_num,paging:paging,pagesize:pagesize},function(err,returns){
        if(err){
            logger.error('获得趋势图出错:',err);
            cb(err);
        }else{
            if(returns.status.errorCode == '0000'){
                var res=JSON.parse(encry.decodeDes3cbc(returns.bizObj.list));
                logger.info('=====基本走势图====',JSON.stringify(res));
                cb(null,res,returns.bizObj.pageInfo);
            }else{
                logger.error('获得趋势图错误',JSON.stringify(returns));
                cb(new Error('获得趋势图错误'));
            }
        }
    });
}

/**
 * 更新纸的数量
 * @param count
 * @param cb
 */
exports.updatePapers = function(count,cb){
    Query.doMethodWithAllReturn('updatePrtCount',{type:'0',prtCount:count},function(err,returns){
        if(err){
            logger.error('提交打印纸信息出错:',err);
            cb(err);
        }else{
            if(returns.status.errorCode == '0000'){
                logger.info('=====更新纸的数量====',JSON.stringify(returns));
                cb(null,returns.bizObj);
            }else{
//                console.log(returns);
                logger.error('提交打印纸信息出错',returns);
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
    Query.doMethodWithAllReturn('updatePrtCount',{type:'2',prtCount:count},function(err,returns){
        if(err){
            logger.error('提交打印纸信息出错:',err);
        }else{
            if(returns.status.errorCode != '0000'){
                logger.error('提交打印纸信息出错',returns);
            }else{
                logger.info('===提交打印纸信息===',returns);
                //console.log(returns);
            }
        }
    });
}

// 管理员登录
exports.adminLogin=function(password,cb)
{
    var p=encry.md5(password);
    var u=process.env.xx_clientid;
    Query.doMethodWithAllReturn('clientAdminLogin',{userName:u,password:p},function(err,returns){
        if(err){
            logger.error('管理员登录出错:',err);
            cb(err);
        }else{
            if(returns.status.errorCode != '0000'){
                logger.error('=====管理员登录失败====',JSON.stringify(returns));
                cb(new Error('管理员登录返回失败'));
            }else{
                logger.info('=====更新纸的数量====',JSON.stringify(returns));
                cb(null,returns.bizObj);
            }
        }
    });
}

// 管理员密码修改
exports.adminChangePassword=function(password,newPassword,cb)
{
    var p=encry.md5(password);
    var np=encry.md5(newPassword);
    var u=process.env.xx_clientid;
    Query.doMethodWithAllReturn('clientAdminChangePassword',{userName:u,password:p,newPassword:np},function(err,returns){
        if(err){
            logger.error('管理员修改密码出错:',err);
            cb(err);
        }else{
            if(returns.status.errorCode != '0000'){
               logger.error('=====管理员修改密码失败====',JSON.stringify(returns));
                cb(new Error('管理员修改密码返回失败'));
            }else{
                logger.info('=====管理员修改密码成功====',JSON.stringify(returns));
                cb(null,returns.bizObj);
            }
        }
    });
}

// 获取终端销量
exports.getSales=function(bTime,eTime,cb)
{
    var u=process.env.xx_clientid;
    var params={clientid:u,beginTime:bTime,endTime:eTime};
    Query.doMethodWithAllReturn('getSale',params,function(err,returns){
        console.log(returns);
        if(err){
            logger.error('获取终端销量出错:',err);
            cb(err);
        }else{
            if(returns.status.errorCode != '0000'){
//                console.log(returns);
                logger.error('=====获取终端销量返回失败====',JSON.stringify(returns));
                cb(new Error('获取终端销量返回失败'));
            }else{
//                console.log(returns);
                var res = JSON.parse(encry.decodeDes3cbc(returns.bizObj));
                logger.info('=====获取终端销量成功====',JSON.stringify(res));
                cb(null,res);
            }
        }
    });
}

/**
 * 根据卡号查询手机号码（普通彩种）
 * @param card_no
 * @param cb
 */
exports.queryPhone = function(card_no,cb){
    Query.doMethodWithAllReturn('CheckUser',{cardno:card_no},function(err,returns){
        if(err){
            logger.error('（普通彩种）查询手机号网络失败:',err);
            cb(err);
        }else{
            if(returns.status.errorCode != '0000'){
                //console.log(returns);
                logger.error('=====根据卡号查询手机号码（普通彩种）失败====',JSON.stringify(returns));
                cb(new Error('返回失败'));
            }else{
                //console.log('00000',returns);
                var res = JSON.parse(encry.decodeDes3cbc(returns.bizObj));
                logger.info('=====根据卡号查询手机号码（普通彩种）====',JSON.stringify(res));
                cb(null,res.tel);
            }
        }
    });
}
//用户登陆 K3
exports.login= function (phoneno,pwd,cb) {
    var params={userName:encry.des3cbc(phoneno),password:encry.des3cbc(pwd)};
    Query.doMethodWithHeadAllReturn(phoneno,pwd,'login',params,function(err,returns){
        if(err){
            logger.error('查询手机号网络失败:',err);
            cb(err);
        }else{
            //console.log('登录：',returns)
            if(returns.status.errorCode=='0024'){
                logger.error('用户登陆账户锁定:',returns);
                cb(new Error('对不起您的账户锁定，请联系客服处理！'));
            }else if(returns.status.errorCode=='0003'){
                logger.error('用户登陆密码错误:',returns);
                cb(new Error('密码错误'));
            }else{
                if(returns.status.errorCode != '0000'){
                    //console.log(returns);
                    logger.error('用户登陆返回失败:',JSON.stringify(returns));
                    cb(new Error('用户登陆返回失败'));
                }else{
                    var res = JSON.parse(encry.decodeDes3cbc(returns.bizObj));
                    logger.info('用户登陆成功:',JSON.stringify(res));
                    cb(null,res);
                }
            }
        }
    });
}
//注册验证 K3
exports.resgisterVal= function (userName,cb) {
    Query.doMethodWithAllReturn('registerVal',{userName:encry.des3cbc(userName)},function(err,returns){
        if(err){
            logger.error('注册验证失败:',err);
            cb(err);
        }else{
            if(returns.status.errorCode == '9997'){
                logger.error('注册验证失败',JSON.stringify(returns));
                cb(new Error('返回失败'));
            }else{
                logger.info('注册验证:',JSON.stringify(returns));
                cb(null,returns.bizObj);
            }
        }
    });
}
//注册 K3
exports.register= function (checkCode,phone,name,sex,email,pwd,paypwd,idno,bankcard,cb) {
   var userinfo={
       userid:phone,
       name:phone,
       sex:'',
       email:email,
       tel:phone,
       user:encry.des3cbc(phone),
       pwd:encry.des3cbc(pwd),
       paypwd:encry.des3cbc(paypwd),
       idCard:idno,
       tkbankcardno:bankcard?bankcard:''
   }
    var params={checkCode:checkCode,user:encry.des3cbc(JSON.stringify(userinfo))};
    Query.doMethodWithAllReturn('register',params,function(err,returns){
        //console.log(params,returns);
        if(err){
            logger.error('注册失败:',err);
            cb(err);
        }else{
            if(returns.status.errorCode != '0000'){
                if(returns.status.errorCode == '9998')//验证码不正确或者请求超时
                {
                    logger.error('注册失败:验证码不正确或者请求超时',returns);
                    cb(new Error('验证码不正确或者请求超时'));
                }else if(returns.status.errorCode == '0023')//验证码下发失败
                {
                    logger.error('注册失败:验证码下发失败',returns);
                    cb(new Error('验证码下发失败'));
                }else if(returns.status.errorCode == '0011')//用户已注册
                {
                    logger.error('注册失败:用户已注册',returns);
                    cb(new Error('用户已注册'));
                }else{
                    logger.error('注册失败:注册返回失败',returns);
                    cb(new Error('注册返回失败'));
                }
            }else{
                var res = JSON.parse(encry.decodeDes3cbc(returns.bizObj));
                logger.info('注册成功',JSON.stringify(res));
                cb(null,{res:res,retcode:returns.status.errorCode});
            }
        }
    });
}
/**
 * 根据卡号查询手机号码（K3）
 * @param card_no
 * @param cb
 */
exports.getTelbyCard=function(card_no,cb)
{
    Query.doMethodWithAllReturn('getTelbyCard',{cardno:card_no},function(err,returns){
        if(err){
            logger.error('根据卡号查询手机号码（K3）失败:',err);
            cb(err);
        }else{
            if(returns.status.errorCode != '0000'){
                logger.error('根据卡号查询手机号码（K3）失败:',returns);
                cb(new Error('返回失败'));
            }else{
                //console.log('00000',returns);
                var res = JSON.parse(encry.decodeDes3cbc(returns.bizObj));
                logger.info('根据卡号查询手机号码（K3）成功:',JSON.stringify(res));
                cb(null,res.phoneNumber);
            }
        }
    });
}

//获取卡列表
exports.getcardlist= function (phoneNo,pass,cb) {
    Query.doMethodWithHeadAllReturn(phoneNo,pass,'getCardList',{userName:phoneNo},function(err,returns){
        //console.log(returns);
        if(err){
            logger.error('获取卡列表出错:',err);
            cb(err);
        }else{
            if(returns.status.errorCode != '0000'){
                logger.error('获取卡列表出错:',JSON.stringify(returns));
                cb(new Error('返回失败'));
            }else{
                var res = JSON.parse(encry.decodeDes3cbc(returns.bizObj));
                logger.info('获取卡列表成功:',JSON.stringify(res));
                cb(null,res);
            }
        }
    });
}

//修改用户信息
exports.updateUserinfo= function (user,pwd,idcardtj,userinfo,cb) {
    var userin={
        user:encry.des3cbc(userinfo.user),
        tkbankcardno:userinfo.tkbankcardno
    }
    var params={pwdtj:encry.des3cbc(pwd),idCardtj:encry.des3cbc(idcardtj),checkCode:userinfo.checkCode,user:encry.des3cbc(JSON.stringify(userin))};
    logger.info('======绑定卡===',userin,params);
    Query.doMethodWithHeadAllReturn(user,pwd,'updateUserinfo',params,function(err,returns){
        if(err){
            logger.error('修改用户信息出错',err);
            cb(err);
        }else{
            console.log('xxxxxxxxxxxxxxxxxxxx');
            console.log(returns);
            if(returns.status.errorCode != '0000'){
                logger.error('修改用户信息出错',JSON.stringify(returns));
                cb(new Error('修改用户信息失败'));
            }else{
                //logger.info('修改用户信息出错',JSON.stringify(returns));
                cb(null,returns.status.errorCode);
            }
        }
    });
}

//登出
exports.loginOut= function (userName,password,cb) {
    var params={userName:encry.des3cbc(userName),password:encry.des3cbc(password)}
    Query.doMethodWithAllReturn('logOut',params, function (err, res) {
        if(err){
            logger.error('登出失败',err);
            cb(err);
        }else{
            if(res.status.errorCode != '0000'){
                logger.error('登出失败',res);
                cb(new Error('返回失败'));
            }else{
                logger.info('登出成功',JSON.stringify(res));
                cb(null,res);
            }
        }
    })
}

//取消订单，（订单在未付款状态）//冲正
exports.cancelOrder= function (orderNumber,type,btid,cb) {
    var params={number:orderNumber,type:type,btid:btid};
    Query.doMethodWithAllReturn('cancelOrder',params, function (err,res) {
        if(err){
            logger.error('订单取消出错');
            cb(err,null);
        }else{
            if(res.status.errorCode!='0000'){
                logger.error('订单取消失败',res);
                cb(new Error('返回失败'));
            }else{
                var res = JSON.parse(encry.decodeDes3cbc(res.bizObj));
                logger.info('取消订单成功',JSON.stringify(res));
                cb(null,res);
            }
        }
    })
}

//获取用户购彩记录
exports.getOrders= function (phone,pwd,query,cb) {
   var params= {query:encry.des3cbc(JSON.stringify(query))}
    Query.doMethodWithHeadAllReturn(phone,pwd,'getOrders',params, function (err,res) {
        //console.log('订单记录-----------',res);
        if(err){
            logger.error('获取用户购彩记录出错');
             cb(err,null);
        }else{
            if(res.status.errorCode!='0000'){
                logger.error('获取用户购彩记录失败',res);
                cb(new Error(res.status.errorMsg),null);
            }else{
                var ret = JSON.parse(encry.decodeDes3cbc(res.bizObj.list));
                logger.info('获取订单记录成功',JSON.stringify(ret));
                cb(null,ret,res.bizObj.pageInfo);
            }
        }
    })
}

//获取订单详情
exports.getOrderDetail= function (phone,pwd,orderNumber,cb) {
    Query.doMethodWithHeadAllReturn(phone,pwd,'getOrder',{orderNumber:orderNumber}, function (err,res) {
        if(err){
            logger.error('订单详情获取失败');
            cb(err,null);
        }else{
            if(res.status.errorCode!='0000'){
                logger.error('订单详情获取失败',res);
                cb(new Error('返回失败'));
            }else{
                var res = JSON.parse(encry.decodeDes3cbc(res.bizObj));
                res.lottList=JSON.parse(encry.decodeDes3cbc(res.lottList));
                logger.info('获取订单详情成功',JSON.stringify(res));
                cb(null,res);
            }
        }
    })
}

//获取账户余额
exports.getBalance= function (user,cb) {
    //getbalance
    Query.doMethodWithHeadAllReturn(user.id,user.pwd,'getbalance',{userName:encry.des3cbc(user.id)}, function (err,res) {
        //console.log(res);
        if(err){
            logger.error('获取账户余额出错');
            cb(err,null);
        }else{
            if(res.status.errorCode!='0000'){
                logger.error('获取账户余额失败',res);
                cb(new Error('返回失败'));
            }else{
                var res = JSON.parse(encry.decodeDes3cbc(res.bizObj));
                logger.info('获取账户余额成功',JSON.stringify(res));
                cb(null,res);
            }
        }
    })
}

//获取用户账户明细
exports.getAccountDetail= function (userName,pwd,beginTime,endTime,paging,pagesize,cb) {
   var params={userName:encry.des3cbc(userName),beginTime:beginTime,endTime:endTime,paging:paging,pagesize:pagesize};
    Query.doMethodWithHeadAllReturn(userName,pwd,'getuseramount',params, function (err,res) {
        console.log('获取用户账户明细===',res);
        if(err){
            logger.error('获取用户账户明细出错');
            cb(err,null);
        }else{
            if(res.status.errorCode!='0000'){
              logger.error('获取用户账户明细失败',res);
              cb(new Error(res.status.errorMsg),null);
            }else{
                var ret = JSON.parse(encry.decodeDes3cbc(res.bizObj.list));
                logger.info('获取用户账户明细成功',JSON.stringify(ret));
                console.log(res.bizObj,ret);
                cb(null,ret,res.bizObj.pageInfo);
            }
        }
    })

}

//下发验证码
exports.sendVali= function (phoneno,cb) {
    Query.doMethodWithAllReturn('getCheckMaskCode',{tel:phoneno}, function (err,res) {
        //console.log('下发验证码',err,res);
        if(err){
            logger.error("下发验证码出错");
            cb(err,null);
        }else{
            if(res.status.errorCode!='0000'){
                logger.error('下发验证码失败',res);
                cb(new Error('返回失败'));
            }else{
                //var res = JSON.parse(encry.decodeDes3cbc(res.bizObj));
                logger.info('下发验证码成功',JSON.stringify(res));
                cb(null,res.bizObj);
            }
        }
    })
}

//修改用户密码
exports.updatePwd= function (checkCode,user,pwd,paypwd,cb) {
    var userin={user:encry.des3cbc(user.id),pwd:encry.des3cbc(pwd),paypwd:encry.des3cbc(paypwd)};
    var params={checkCode:checkCode,user:encry.des3cbc(JSON.stringify(userin))};
    logger.info('修改用户密码',JSON.stringify(params));
    Query.doMethodWithHeadAllReturn(user.id,user.pwd,'updateUserPass',params, function (err, res) {
        //console.log(res,res.status.bizObj);
        if(err){
            logger.error('修改密码出错',err);
            cb(err);
        }else{
            if(res.status.errorCode != '0000'){
                if(res.status.errorCode == '9998')//验证码不正确或者请求超时
                {
                    logger.error('修改密码出错验证码不正确或者请求超时',res);
                    cb(new Error('验证码不正确或者请求超时'));
                }else if(res.status.errorCode == '0023')//验证码下发失败
                {
                    logger.error('修改密码出错验证码下发失败',res);
                    cb(new Error('验证码下发失败'));
                }else{
                    logger.error('重置密码失败',res);
                    cb(new Error('重置密码失败'));
                }
            }else{
                var ret=JSON.parse(encry.decodeDes3cbc(res.bizObj));
                logger.info('修改用户密码成功',JSON.stringify(ret));
                cb(null,res.status);
            }
        }
    })
}

//银行卡号登录
exports.loginBycard= function (bankcard, cb) {
    Query.doMethodWithAllReturn('loginByCard',{bankcard:bankcard}, function (err,res) {
        if(err){
            logger.error('银行卡登录失败',err);
            cb(err);
        }else{
            if(res.status.errorCode!='0000'){
                logger.error('银行卡登录失败',err);
                cb(new Error('返回失败'));
            }else{
                var res = JSON.parse(encry.decodeDes3cbc(res.bizObj));
                logger.info('银行卡号登录成功',JSON.stringify(res));
                cb(null,res);
            }
        }
    })
}

//银行卡解绑（暂时不用）
exports.unwrapBankCard= function (tel,cardno,cb) {
//cancelCard
    var parmas={userName:tel,cardno:cardno}
    logger.info('银行卡解绑',JSON.stringify(params));
    Query.doMethodWithHeadAllReturn('18758295232','123456','CancelCard',parmas, function (err,res) {
        if(err){
            logger.error('银行卡解绑出错',err);
            cb(err);
        }else{
            if(res.status.errorCode != '0000'){
                logger.error('银行卡解绑失败',res);
                cb(new Error('返回失败'));
            }else{
                //var res = JSON.parse(encry.decodeDes3cbc(res.bizObj));
                logger.info('银行卡解绑成功',JSON.stringify(res));
                cb(null,res);
            }
        }
    })

}

//提交充值订单
exports.makeRechargeOrder= function (user,charheSum,cb) {
    var params={userName:encry.des3cbc(user.id),chargeSum:charheSum};
    logger.info('提交充值订单',JSON.stringify(params));
    Query.doMethodWithHeadAllReturn(user.id,user.pwd,'tjRechargeOrder',params,function (err, res) {
        if(err){
            logger.error('提交充值订单出错',err);
            cb(err);
        }else{
            if(res.status.errorCode != '0000'){
                logger.error('提交充值订单失败',res);
                cb(new Error('提交充值订单返回失败'));
            }else{
                //var res = JSON.parse(encry.decodeDes3cbc(res.bizObj));
                logger.info('提交充值订单成功',JSON.stringify(res));
                cb(null,res.bizObj);
            }
        }
    })
}

//提交提现订单
exports.makeCashOrder= function (user,paypwd,cashSum,cb) {
    var params={userName:encry.des3cbc(user.id),paypwd:encry.des3cbc(paypwd),cashSum:cashSum,bankCardNumber:user.tkBankcardNo,phoneNumber:user.tel};
    logger.info('====提交提现订单=====',JSON.stringify(params));
    Query.doMethodWithHeadAllReturn(user.id,user.pwd,'tjCashOrder',params, function (err, res) {
        //console.log(params,res);
        if(err){
            logger.error('提交提现订单出错',err);
            //ErrorHandler.orderinfo(user.id,'',err.message);
            cb(err);
        }else{
            if(res.status.errorCode=='0003'){
                logger.error('提交提现订单失败',res);
                cb(new Error('密码错误'));
            }else{
                if(res.status.errorCode != '0000'){
                    logger.error('提交提现订单失败',res);
                    cb(new Error('返回失败'));
                }else{
                    //var res = JSON.parse(encry.decodeDes3cbc(res.bizObj));
                    logger.info('提交提现订单成功',JSON.stringify(res));
                    cb(null,res);
                }
            }
        }
    });
}

