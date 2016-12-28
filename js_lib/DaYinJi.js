var ffi = require('ffi');
var ref = require('ref');
var iconv = require('iconv-lite');
var util = require('util');
var ArrayType = require('ref-array');
var charPtr = ref.refType('char');
var charPtrPtr = ref.refType(charPtr);
var CharPtrArray = ArrayType(charPtr);
var ErrorHandler = require('../js_lib/ErrorHandler');
var logger = require('../js_lib/Logger').logger;
var lottoQuery = require('../js_lib/LotteryQuery.js');
var clientId = process.env.xx_clientid;
var _ = require('underscore');
var com = process.env.xx_printcom || 'COM3';
var dizhi = process.env.xx_dizhi || '湖北省武汉市首义路';
var printType=process.env.xx_printdev || '0';

/*
process.env.xx_printdev
默认老打印机
0--老打印机
1--新打印机
* */
var intPtr = ref.refType('int');
var libm = ffi.Library('dlls/TKIOSKDLL.dll', {
    'TKIOSK_OpenCom':['int',['string','int','int','int','int','int']],
    'TKIOSK_CloseCom': [ 'int', [ 'int'] ],
    'TKIOSK_StartDoc':['int',['int']],
    'TKIOSK_EndDoc':['int',['int']],
    'TKIOSK_Reset':['int',['int','int']],
    'TKIOSK_SetMode':['int',['int','int','int']],
    'TKIOSK_SetOppositePosition':['int',['int','int','int','int','int']],
    'TKIOSK_S_SetLeftMarginAndAreaWidth':['int',['int','int','int','int']],
    'TKIOSK_SetRightSpacing':['int',['int','int','int']],
    'TKIOSK_SetLineSpacing':['int',['int','int','int']],
    'TKIOSK_FeedLines':['int',['int','int','int']],
    'TKIOSK_FeedLine':['int',['int','int']],
    'TKIOSK_S_Textout':['int',['int','int',CharPtrArray,'int','int','int','int','int']],
    'TKIOSK_S_PrintBarcode':['int',['int','int',CharPtrArray,'int','int','int','int','int','int','int']],
    'TKIOSK_CutPaper':['int',['int','int','int','int']],
    'TKIOSK_QueryStatus':['int',['int','int',CharPtrArray,'int']],
    'TKIOSK_S_SetAlignMode':['int',['int','int','int']]
});
var libm2 = ffi.Library('dlls/YkPosdll.dll', {
    'YkOpenDevice':['int',['int','int']],//
    'YkGetDeviceHandle':['int',[]],//获取设备的操作句柄
    'YkInitPrinter':['int',[]],//初始化打印机
    'YkPrnAndFeedPaper':['int',['int']],//走纸,
    'YkPrintStr':['int',[CharPtrArray]],//把将要打印的字符串送入打印机缓冲区(注: 达到满行时会自动打印出来)
    'YkEnter':['int',[]],//打印并回车,但不走纸
    'YkFeedPaper':['int',[]],//打印并换行，走纸到下一行首
    'YkSetDefaultLineSpace':['int',[]],//设置行间距,
    'YkEnablePM':['int',[]],//进入页模式工作,
    'YkPrintInPM':['int',[]],//页模式下，打印数据
    'YkCutPaper':['int',['int','int']], //执行切纸动作，包括进纸 - m=66 n:打印机进纸到(切纸位置+ [n × 0.125 毫米{0.0049英寸}])并切纸，一般n=0，
    'YkCloseDevice':['int',[]],//关闭打印设备
    'YkCancelPrintInPM':['int',['int']],//页模式下取消打印数据
    'YkResponse':['int',['int']],//实时响应主机请求
    'YkTabMove':['int',[]],//Tab水平定位
    'YkSetCharRightSpace':['int',['int']],//设置西文字符右间距
    'YkSetFontStyle':['int',['int']],//设置字符打印方式
    'YkSetAbsPrnPos':['int',['int','int']],//设置绝对打印位置
    'YkSelectFont':['int',['int']],//设置字符字型
    'YkSetInterCharSet':['int',['int']],//设置ASCII字符集
    'YkSetPrnAreaInPM':['int',['int','int','int','int']],//页模式下，设置设置打印区域，打印页长度范围(76~185mm),打印宽度(最大72mm)
    'YkSetRelPrnPos':['int',['int','int']],//设置相对打印位置
    'YkSetAlign':['int',['int']],//设置打印时的对齐方式
    'YkSetSensorToStopPrint':['int',['int']],//设置纸尽时停止打印
    'YkEnablePanelButton':['int',['int']],//使能或禁用打印机面板上的开关
    'YkPrnAndFeedLine':['int',['int']],//打印后走纸n字符行
    'YkFeedToStartPos':['int',[]],//走黑标纸到打印起始位置
    'YkSetCharSize':['int',['int','int']],//设置字符倍数
    'YkSetAbsVertPosInPM':['int',['int','int']],//页模式下，设置打印区域内绝对垂直打印起始位置
    'YkSetBlackMarkParam':['int',['int','int','int','int']],//设置黑标的切撕纸位置和起始打印位置
    'YkPrnAndBackToStd':['int',[]],//打印后走黑标到打印起始位置
    'YkSetHRIPos':['int',['int']],//设置条码HRI字符的打印位置
    'YkSetLeftMargin':['int',['int','int']],//设置左边距
    'YkToLineHome':['int',['int']],//打印位置设置为打印行起点
    'YkSetPrnAreaWidth':['int',['int','int']],//设置打印区域宽度
    'YkSetHRICharStyle':['int',['int']],//设置条码的HRI字符字型
    'YkSetBarCodeHeight':['int',['int']],//设置条码高度
    'YkPrintBarCode':['int',['int','int',CharPtrArray]],//打印条码
    'YkGetStatus':['int',['int']],//获取打印机状态,
    'YkGetPrinterStatus':['int',['int']],//传送打印纸传感器状态
    'YkSetBarCodeWidth':['int',['int']]//设置条码宽度
});
var getballstr = function(tk){
    var ball = '';
    if(tk.lottery_type == 'ssq'  ){
        if(tk.play_type_code == '101' || tk.play_type_code == '102'){
            ball = tk.nums.red.join(' ') +'-'+tk.nums.blue.join(' ');
        }else if(tk.play_type_code == '103'){
            ball = tk.nums.dan.join(' ') + ' - ' + tk.nums.tuo.join(' ') + ' - ' + tk.nums.blue.join(' ');
        }
    }else if(tk.lottery_type == '307'){
        if(tk.play_type_code == '101' || tk.play_type_code == '102'){
            ball = tk.nums.red.join(' ');
        }else if(tk.play_type_code == '103'){
            ball = tk.nums.dan.join(' ') + ' - ' +tk.nums.tuo.join(' ');
        }
    }else if(tk.lottery_type == '30x5'){
        if(tk.play_type_code == '101' || tk.play_type_code == '102'){
            ball = tk.nums.red.join(' ');
        }else if(tk.play_type_code == '103'){
            ball = tk.nums.dan.join(' ') + ' - ' +tk.nums.tuo.join(' ');
        }
    }else if(tk.lottery_type == '3d'){
        if(tk.play_type_code == '201'){
            ball =  tk.nums.bai.join(' ') + ' ' + tk.nums.shi.join(' ') + ' ' + tk.nums.ge.join(' ');
        }else if(tk.play_type_code == '202' || tk.play_type_code == '203'){
            ball = tk.nums.hao1.join(' ') + ' ' +tk.nums.hao2.join(' ') + ' ' +tk.nums.hao3.join(' ');
        }else if(tk.play_type_code == '204'){
            ball =  tk.nums.bai.join(' ') + ' -  ' + tk.nums.shi.join(' ') + ' - ' + tk.nums.ge.join(' ');
        }else if(tk.play_type_code == '205'){
            ball = tk.nums.z3fs.join(' ');
        }else if(tk.play_type_code == '206'){
            ball = tk.nums.z6fs.join(' ');
        }else if(tk.play_type_code == '207'){
            ball = tk.nums.zxbd.join(' ');
        }else if(tk.play_type_code == '208'){
            ball = tk.nums.z3bd.join(' ');
        }else if(tk.play_type_code == '209'){
            ball = tk.nums.z6bd.join(' ');
        }else if(tk.play_type_code == '212'){
            ball = tk.nums.zxbd.join(' ');
        }else{
            ball = (tk.nums.bai && tk.nums.bai.length > 0 ? tk.nums.bai.toString() : '*') + ' ' + (tk.nums.shi && tk.nums.shi.length > 0 ? tk.nums.shi.toString() : '*')+ ' ' + (tk.nums.ge && tk.nums.ge.length > 0 ? tk.nums.ge.toString() : '*');
        }
    }else if(tk.lottery_type == '22x5'){
        if(tk.play_type_code == '103' || tk.play_type_code == '108' || tk.play_type_code == '111' || tk.play_type_code == '114' ){
            ball = tk.nums.dan.join(' ') + ' - ' +tk.nums.tuo.join(' ');
        }else{
            ball = tk.nums.red.join(' ');
        }
    }else if(tk.lottery_type=='k3'){
        if(tk.play_type_code=='102'||tk.play_type_code=='105'){
            ball=tk.nums.red;
        }else{
            ball=tk.nums.red.join(' ');
        }
    }
    ball = ball + '（'+ tk.beishu + '）' + '\0';
    return ball;
}
function get_kaijing(lotto,issue_end){
    var d = issue_end.substr(0,10) + ' ';
    if(lotto == 'ssq'){
        d += '21:00';
    }else if(lotto =='3d'){
        d += '20:00';
    }else if(lotto == '307'){
        d += '20:00';
    }else if(lotto == '30x5'){
        d += '20:00';
    }else if(lotto=='k3'){
		d=issue_end;
	}
    return d;
}

exports.write_lottery = function(tickets,ordernum,payresult,cb)
{
    if(printType=='0'){
        write_lottery_1(tickets,ordernum,payresult,cb);
    }else if(printType=='1'){
        write_lottery_2(tickets,ordernum,payresult,cb);
    }
}
var write_lottery_1 = function(tickets,ordernum,payresult,cb){
    var tks = tickets.toJSON();
    if(!tks || tks.length == 0){
        cb(new Error('没有注码'));
        //console.log('no zhuma');
        return;
    }

    var port = libm.TKIOSK_OpenCom(com,38400,8,1,0,0);
    if(port == -1){
        console.log(libm.TKIOSK_CloseCom(port));
        ErrorHandler.SubError(3,'打印机打开失败','-1',1);
        logger.error('打印机打开失败',port);
        cb(new Error('设备打开失败'));
        return ;
    }
    var r1 = libm.TKIOSK_Reset(port,0);
    var r2 = libm.TKIOSK_SetMode(port,0,0);
    var r3 = libm.TKIOSK_SetOppositePosition(port,0,0,0,0);
    var r4 = libm.TKIOSK_S_SetLeftMarginAndAreaWidth(port,0, 30, 2500);
    var r5 = libm.TKIOSK_SetRightSpacing(port, 0, 0);
    var r6 = libm.TKIOSK_SetLineSpacing(port, 0, 27);
    //console.log(r1,r2,r3,r4,r5,r6);
    var d = new Date();
    var ds  = format_date(d);
    var gp_lottos = _.groupBy(tks,'lottery_name');
    var print_count = 0;
    for(var lotto in gp_lottos){
        var play_types = _.groupBy(gp_lottos[lotto],'play_type_name');
        for(var p in play_types){
            var count = play_types[p].length;
            for(var i=0;i<count / 5;i++){
                libm.TKIOSK_S_Textout(port, 0, iconv.encode(lotto + '\0',"gbk"), 230, 2, 2,3, 8);
                libm.TKIOSK_FeedLines(port,0,2);
                var tk = play_types[p][0];
                libm.TKIOSK_S_Textout(port, 0, iconv.encode(' 期号：'+ tk.issue + '\0','gbk'), 0, 1, 1,3, 0);
                libm.TKIOSK_S_Textout(port, 0, iconv.encode(' 多期：'+ tk.zhuihao + '\0','gbk'), 220, 1, 1,3, 0);
                libm.TKIOSK_S_Textout(port, 0, iconv.encode(' 玩法：' + tk.play_type_name + '\0','gbk'), 380, 1, 1,3, 0);
                libm.TKIOSK_FeedLines(port,0,1);
                libm.TKIOSK_S_Textout(port, 0, iconv.encode(' 站点号：' + payresult.numbercode +'\0','gbk'), 0, 1, 1,3, 0);
                libm.TKIOSK_S_Textout(port, 0, iconv.encode(' 流水号：' + payresult.ticketcode +'\0','gbk'), 220, 1, 1,3, 0);
                libm.TKIOSK_S_Textout(port, 0, iconv.encode('投注方式:自助\0','gbk'), 380, 1, 1,3, 0);
                libm.TKIOSK_FeedLines(port,0,1);

                var ball_str = [];
                var money = 0;
                var c = count > (i+1)*5 ? (i+1)*5 :count;
                var t_num_count =0;
                for(var j =i*5;j<c;j++){
                    var b = play_types[p][j];
                    var balls = getballstr(b);
                    ball_str.push(balls);
                    t_num_count++;
                    money = money + b.money;
                }
                libm.TKIOSK_S_Textout(port, 0, iconv.encode('金额：' + money + '元\0','gbk'), 0, 1, 1,3, 0);
                libm.TKIOSK_S_Textout(port, 0, iconv.encode('购买时间：' + ds +'\0','gbk'), 220, 1, 1,3, 0);
                libm.TKIOSK_FeedLines(port,0,2);


                for(var b=0;b<ball_str.length;b++){
                    var bs_ball = iconv.encode(ball_str[b],'gbk');
                    libm.TKIOSK_S_Textout(port, 0, bs_ball, 0, 2, 2,3, 8);
                    libm.TKIOSK_FeedLines(port,0,1);
                }
                for(var d=0;d<5-t_num_count;d++){
                    libm.TKIOSK_S_Textout(port, 0, iconv.encode('  \0','gbk'), 0, 2, 2,3, 8);
                    libm.TKIOSK_FeedLines(port,0,1);
                }

                libm.TKIOSK_FeedLines(port,0,1);
                if(lotto=='k3'){
                    var bs_ba_0 = iconv.encode('开奖日期：'+  tk.issue_end+'\0','gbk');
                }else {
                    bs_ba_0 = iconv.encode('开奖日期：'+  get_kaijing(tk.lottery_type,tk.issue_end)+'\0','gbk');
                }
                //var bs_ba_0 = iconv.encode('开奖日期：'+  get_kaijing(tk.lottery_type,tk.issue_end)+'\0','gbk');
                libm.TKIOSK_S_Textout(port, 0, bs_ba_0, 0, 1, 1,3, 0);
                libm.TKIOSK_FeedLines(port,0,1);

                var bs_ba_1 = iconv.encode('订单号：'+ordernum+'\0','gbk');
                libm.TKIOSK_S_Textout(port, 0, bs_ba_1, 0, 1, 1,3, 0);
                libm.TKIOSK_FeedLines(port,0,1);
                
                
                var bs_b_3 = iconv.encode('客服热线：400-9913-700\0','gbk');
                libm.TKIOSK_S_Textout(port, 0, bs_b_3, 0, 1, 1,3, 0);
                libm.TKIOSK_FeedLines(port,0,1);

                libm.TKIOSK_S_Textout(port, 0, iconv.encode('终端号：'+ clientId +'\0','gbk'), 0, 1, 1,3, 0);
                libm.TKIOSK_FeedLines(port,0,1);

                libm.TKIOSK_S_Textout(port, 0, iconv.encode('终端机地址：'+ dizhi +'\0','gbk'), 0, 1, 1,3, 0);
                libm.TKIOSK_FeedLines(port,0,1);
                

                var b_code = new Buffer('{B'+tk.play_type_code + tk.issue + payresult.numbercode + payresult.ticketcode);
                libm.TKIOSK_S_PrintBarcode(port,0,b_code,0, 73, 2, 50, 0, 0, b_code.length);
                console.log('cut result',libm.TKIOSK_CutPaper(port,0,1,0));
                print_count++;
            }
        }
    }
    var buf_state = new Buffer(8);
    var status = libm.TKIOSK_QueryStatus(port,0,buf_state,1000);
    console.log('status query ',status);
    if(status != '1001'){
        ErrorHandler.SubError(3,'打印机状态查询失败',status,1);
        logger.error('打印机状态查询失败',status);
    }else{
        var ps = [
            buf_state[0],//纸状态正常/纸将尽
            buf_state[1],//有纸/纸尽
            buf_state[2],//切刀正常/切刀错
            buf_state[3], //打印头温度正常/打印头过热
            buf_state[4]//上盖正常/上盖打开
        ];
        if(ps[0] != 0 || ps[1] !=0 || ps[2] != 0 || ps[3] !=0){
            var erromsg = '';
            erromsg =  ps[0] !=0  ? erromsg + '纸将尽' :erromsg;
            erromsg =  ps[1] !=0  ? erromsg + '纸尽' :erromsg;
            erromsg =  ps[2] !=0  ? erromsg + '切刀错' :erromsg;
            erromsg =  ps[3] !=0  ? erromsg + '打印头过热' :erromsg;
            ErrorHandler.SubError(3,erromsg,'1',2);
            logger.error('打印机状态错误',JSON.stringify(ps));
        }
    }

    var close_result  = libm.TKIOSK_CloseCom(port);
    if(close_result != '1001'){
        ErrorHandler.SubError(3,'打印机关闭失败',close_result,1);
    }
    ErrorHandler.printPapers(print_count);
    cb(null);
}

var write_lottery_2 = function(tickets,ordernum,payresult,cb){
    var tks = tickets.toJSON();

    if(!tks || tks.length == 0){
        cb(new Error('没有注码'));
        console.log('no zhuma');
        return;
    }
    var port = libm2.YkOpenDevice(parseInt(com.substr(com.length-1,1)),38400);
    if(port == -1){
        console.log(libm2.YkCloseDevice());
        ErrorHandler.SubError(3,'打印机打开失败','-1',1);
        logger.error('打印机打开失败',port);
        cb(new Error('设备打开失败'));
        return ;
    }

    var r1 = libm2.YkGetDeviceHandle();
    var r2 = libm2.YkInitPrinter();
    var r3 = libm2.YkSetLeftMargin(20,0);
    var r4 = libm2.YkFeedToStartPos();
    console.log(r1,r2,r3,r4);

    var d = new Date();
    var ds  = format_date(d);
    var gp_lottos = _.groupBy(tks,'lottery_name');
    var print_count = 0;

    for(var lotto in gp_lottos){
        var play_types = _.groupBy(gp_lottos[lotto],'play_type_name');
        for(var p in play_types){
            var count = play_types[p].length;
            for(var i=0;i<count / 5;i++){
                libm2.YkSelectFont(0);
                libm2.YkSetCharSize(1,1);
                libm2.YkSetAlign(1);
                libm2.YkPrintStr(iconv.encode(lotto + '\0',"gbk"));
                libm2.YkFeedPaper();
                libm2.YkPrintStr( iconv.encode('\0','gbk'));
                libm2.YkPrnAndFeedPaper(2);
                var tk = play_types[p][0];

                libm2.YkSelectFont(0);
                libm2.YkSetCharSize(0,0);
                libm2.YkSetAlign(0);
                libm2.YkPrintStr( iconv.encode(' 期号：'+ tk.issue + '\0','gbk'));
//                libm2.YkTabMove();
                libm2.YkPrintStr( iconv.encode('  \0','gbk'));
                libm2.YkPrintStr(iconv.encode('  多期：'+ tk.zhuihao + ' \0','gbk'));
//                libm2.YkTabMove();
                libm2.YkPrintStr( iconv.encode('   玩法：' + tk.play_type_name + '\0','gbk'));
                libm2.YkFeedPaper();

                libm2.YkPrintStr(iconv.encode(' 站点号：' + payresult.numbercode +'\0','gbk'));
                libm2.YkPrintStr( iconv.encode(' \0','gbk'));
                libm2.YkPrintStr(iconv.encode('  流水号：' + payresult.ticketcode +'\0','gbk'));
                libm2.YkTabMove();
                libm2.YkPrintStr(iconv.encode('投注方式:自助\0','gbk'));
                libm2.YkFeedPaper();

                var ball_str = [];
                var money = 0;
                var c = count > (i+1)*5 ? (i+1)*5 :count;
                var t_num_count =0;
                for(var j =i*5;j<c;j++){
                    var b = play_types[p][j];
                    var balls = getballstr(b);
                    ball_str.push(balls);
                    t_num_count++;
                    money = money + b.money;
                }
                libm2.YkPrintStr(iconv.encode(' 金额：' + money + '元\0','gbk'));
                libm2.YkTabMove();
                libm2.YkPrintStr( iconv.encode('  \0','gbk'));
                libm2.YkPrintStr(iconv.encode('    购买时间：' + ds +'\0','gbk'));
                libm2.YkFeedPaper();
                libm2.YkPrintStr( iconv.encode('\0','gbk'));
                libm2.YkPrnAndFeedPaper(2);

                libm2.YkSelectFont(1);
                libm2.YkSetCharSize(1,1);
                libm2.YkSetAlign(0);

                for(var b=0;b<ball_str.length;b++){
                    var bs_ball = iconv.encode(' '+ball_str[b],'gbk');
                    libm2.YkPrintStr(bs_ball);
                    libm2.YkFeedPaper();

                }
                for(var d=0;d<5-t_num_count;d++){
                    libm2.YkPrintStr(iconv.encode(' \0','gbk'));
                    libm2.YkFeedPaper();
                }
                libm2.YkPrintStr(iconv.encode(' \0','gbk'));
                libm2.YkPrnAndFeedPaper(2);

                libm2.YkSelectFont(0);
                libm2.YkSetCharSize(0,0);
                libm2.YkSetAlign(0);

                if(lotto=='k3'){
                    var bs_ba_0 = iconv.encode(' 开奖日期：'+  tk.issue_end+'\0','gbk');
                }else {
                     bs_ba_0 = iconv.encode(' 开奖日期：'+  get_kaijing(tk.lottery_type,tk.issue_end)+'\0','gbk');
                }

                libm2.YkPrintStr(bs_ba_0);
                libm2.YkFeedPaper();

                var bs_ba_1 = iconv.encode(' 订单号：'+ordernum+'\0','gbk');
                libm2.YkPrintStr(bs_ba_1);
                libm2.YkFeedPaper();

                var bs_b_3 = iconv.encode(' 客服热线：400-9913-700\0','gbk');
                libm2.YkPrintStr(bs_b_3);
                libm2.YkFeedPaper();

                libm2.YkPrintStr( iconv.encode(' 终端号：'+ clientId +'\0','gbk'));
                libm2.YkFeedPaper();


                libm2.YkPrintStr(iconv.encode(' 终端机地址：'+ dizhi +'\0','gbk'));
                libm2.YkFeedPaper();

                libm2.YkSetHRIPos(0);
                libm2.YkSetBarCodeHeight(60);
                libm2.YkSetBarCodeWidth(2);
                var b_code = new Buffer('{B'+tk.play_type_code + tk.issue + payresult.numbercode + payresult.ticketcode+'\0');
                libm2.YkPrintBarCode(73,b_code.length-1,b_code);
                libm2.YkPrnAndFeedPaper(2);
                libm2.YkPrnAndBackToStd();
                console.log('cut result',libm2.YkCutPaper(66,0));
                print_count++;
            }
        }
    }

    var buf_state = libm2.YkGetStatus(4);
    console.log('status query ',buf_state);
    if(buf_state == -1){
        ErrorHandler.SubError(3,'打印机状态查询失败',buf_state,1);
        logger.error('打印机状态查询失败',buf_state);
    }else{
        var a=buf_state&0x0c;
        var b=buf_state&0x60;
        if(a != 0 || b !=0){
            var erromsg = '';
            erromsg =  a !=0  ? erromsg + '纸将尽' :erromsg;
            erromsg =  b !=0  ? erromsg + '纸尽' :erromsg;
            ErrorHandler.SubError(3,erromsg,'1',2);
            logger.error('打印机状态错误',erromsg);
        }
    }
    var close_result  = libm2.YkCloseDevice();
    if(close_result != 0){
        ErrorHandler.SubError(3,'打印机关闭失败',close_result,1);
    }
    ErrorHandler.printPapers(print_count);
    cb(null);
}

exports.write_test_lottery = function(detail,cb)
{
	
    if(printType=='0'){
        write_test_lottery_1(detail,cb);
    }else if(printType=='1'){
        write_test_lottery_2(detail,cb);
    }
}
var write_test_lottery_1 = function(detail,cb){

    var port = libm.TKIOSK_OpenCom(com,38400,8,1,0,0);
    if(port == -1){
        console.log('open com error');
        console.log(libm.TKIOSK_CloseCom(port));
        ErrorHandler.SubError(3,'打印机打开失败','-1',1);
        logger.error('打印机打开失败',port);
        cb(new Error('设备打开失败'));
        return ;
    }
    var r1 = libm.TKIOSK_Reset(port,0);
    var r2 = libm.TKIOSK_SetMode(port,0,0);
    var r3 = libm.TKIOSK_SetOppositePosition(port,0,0,0,0);
    var r4 = libm.TKIOSK_S_SetLeftMarginAndAreaWidth(port,0, 30, 2500);
    var r5 = libm.TKIOSK_SetRightSpacing(port, 0, 0);
    var r6 = libm.TKIOSK_SetLineSpacing(port, 0, 27);


    libm.TKIOSK_S_Textout(port, 0, iconv.encode(detail.lottery + '\0',"gbk"), 230, 2, 2,3, 8);
    libm.TKIOSK_FeedLines(port,0,2);


    libm.TKIOSK_S_Textout(port, 0, iconv.encode(' 期号：'+ detail.issueNumber + '\0','gbk'), 0, 1, 1,3, 0);
    libm.TKIOSK_S_Textout(port, 0, iconv.encode(' 多期：'+ '1' + '\0','gbk'), 220, 1, 1,3, 0);
	libm.TKIOSK_S_Textout(port, 0, iconv.encode(' 玩法：' + '单式投注' + '\0','gbk'), 380, 1, 1,3, 0);

	libm.TKIOSK_FeedLines(port,0,1);
	libm.TKIOSK_S_Textout(port, 0, iconv.encode(' 站点号：' + '42950575' +'\0','gbk'), 0, 1, 1,3, 0);
	libm.TKIOSK_S_Textout(port, 0, iconv.encode(' 流水号：' +'6299'+'\0','gbk'), 220, 1, 1,3, 0);
	libm.TKIOSK_S_Textout(port, 0, iconv.encode('投注方式:自助\0','gbk'), 380, 1, 1,3, 0);
	libm.TKIOSK_FeedLines(port,0,1);


	libm.TKIOSK_S_Textout(port, 0, iconv.encode('金额：' + detail.orderbonus + '元\0','gbk'), 0, 1, 1,3, 0);
	libm.TKIOSK_S_Textout(port, 0, iconv.encode('购买时间：' + detail.orderTime +'\0','gbk'), 220, 1, 1,3, 0);
	libm.TKIOSK_FeedLines(port,0,2);


	for(var b=0;b<1;b++){
		var bs_ball = iconv.encode('   '+detail.bonus+' ('+detail.multiple+')\0','gbk');
		libm.TKIOSK_S_Textout(port, 0, bs_ball, 0, 2, 2,3, 8);
		libm.TKIOSK_FeedLines(port,0,1);
	}
	for(var d=0;d<5-1;d++){
		libm.TKIOSK_S_Textout(port, 0, iconv.encode('  \0','gbk'), 0, 2, 2,3, 8);
		libm.TKIOSK_FeedLines(port,0,1);
	}

	libm.TKIOSK_FeedLines(port,0,1);

	var bs_ba_0 = iconv.encode('开奖日期：'+  '2016-11-10 21:00'+'\0','gbk');

	//var bs_ba_0 = iconv.encode('开奖日期：'+  get_kaijing(tk.lottery_type,tk.issue_end)+'\0','gbk');
	libm.TKIOSK_S_Textout(port, 0, bs_ba_0, 0, 1, 1,3, 0);
	libm.TKIOSK_FeedLines(port,0,1);

	var bs_ba_1 = iconv.encode('订单号：'+detail.orderNumber+'\0','gbk');
	libm.TKIOSK_S_Textout(port, 0, bs_ba_1, 0, 1, 1,3, 0);
	libm.TKIOSK_FeedLines(port,0,1);
	
	var bs_b_2 = iconv.encode('用户：'+detail.username+'\0','gbk');
	libm.TKIOSK_S_Textout(port, 0, bs_b_2, 0, 1, 1,3, 0);
	libm.TKIOSK_FeedLines(port,0,1);

	var bs_b_3 = iconv.encode('客服热线：400-9913-700\0','gbk');
	libm.TKIOSK_S_Textout(port, 0, bs_b_3, 0, 1, 1,3, 0);
	libm.TKIOSK_FeedLines(port,0,1);

	libm.TKIOSK_S_Textout(port, 0, iconv.encode('终端号：'+ clientId +'\0','gbk'), 0, 1, 1,3, 0);
	libm.TKIOSK_FeedLines(port,0,1);

	libm.TKIOSK_S_Textout(port, 0, iconv.encode('终端机地址：'+ dizhi +'\0','gbk'), 0, 1, 1,3, 0);
	libm.TKIOSK_FeedLines(port,0,1);


	var b_code = new Buffer('{B'+'101' + '2016132' + '0' + 'HBP2016111007295600315364');
	libm.TKIOSK_S_PrintBarcode(port,0,b_code,0, 73, 2, 50, 0, 0, b_code.length);
	console.log('cut result',libm.TKIOSK_CutPaper(port,0,1,0));

    var buf_state = new Buffer(8);
    var status = libm.TKIOSK_QueryStatus(port,0,buf_state,1000);
    console.log('status query ',status);
    if(status != '1001'){
        ErrorHandler.SubError(3,'打印机状态查询失败',status,1);
        logger.error('打印机状态查询失败',status);
    }else{
        var ps = [
            buf_state[0],//纸状态正常/纸将尽
            buf_state[1],//有纸/纸尽
            buf_state[2],//切刀正常/切刀错
            buf_state[3], //打印头温度正常/打印头过热
            buf_state[4]//上盖正常/上盖打开
        ];
        if(ps[0] != 0 || ps[1] !=0 || ps[2] != 0 || ps[3] !=0){
            var erromsg = '';
            erromsg =  ps[0] !=0  ? erromsg + '纸将尽' :erromsg;
            erromsg =  ps[1] !=0  ? erromsg + '纸尽' :erromsg;
            erromsg =  ps[2] !=0  ? erromsg + '切刀错' :erromsg;
            erromsg =  ps[3] !=0  ? erromsg + '打印头过热' :erromsg;
            ErrorHandler.SubError(3,erromsg,'1',2);
            logger.error('打印机状态错误',JSON.stringify(ps));
        }
    }

    var close_result  = libm.TKIOSK_CloseCom(port);
    if(close_result != '1001'){
        ErrorHandler.SubError(3,'打印机关闭失败',close_result,1);
    }
    cb(null);
}

var write_test_lottery_2 = function(detail,cb){

    var port = libm2.YkOpenDevice(parseInt(com.substr(com.length-1,1)),38400);
    if(port == -1){
        console.log('open com error');
        console.log(libm2.YkCloseDevice());
        //ErrorHandler.SubError(2,'键盘closeCom出错=0出错',result,1);
        ErrorHandler.SubError(3,'打印机打开失败','-1',1);
        logger.error('打印机打开失败',port);
        cb(new Error('设备打开失败'));
        return ;
    }

    var r1 = libm2.YkGetDeviceHandle();
    var r2 = libm2.YkInitPrinter();
    var r3 = libm2.YkSetLeftMargin(20,0);
    var r4 = libm2.YkFeedToStartPos();
    console.log(r1,r2,r3,r4);


	libm2.YkSelectFont(0);
	libm2.YkSetCharSize(1,1);
	libm2.YkSetAlign(1);
	libm2.YkPrintStr(iconv.encode(detail.lottery + '\0',"gbk"));
	libm2.YkFeedPaper();
	libm2.YkPrintStr( iconv.encode('\0','gbk'));
	libm2.YkPrnAndFeedPaper(2);

	libm2.YkSelectFont(0);
	libm2.YkSetCharSize(0,0);
	libm2.YkSetAlign(0);
	libm2.YkPrintStr( iconv.encode(' 期号：'+ detail.issueNumber + '\0','gbk'));
//                libm2.YkTabMove();
	libm2.YkPrintStr( iconv.encode('  \0','gbk'));
	libm2.YkPrintStr(iconv.encode('  多期：'+ '1' + ' \0','gbk'));
//                libm2.YkTabMove();
	libm2.YkPrintStr( iconv.encode('   玩法：' + '单式投注' + '\0','gbk'));
	libm2.YkFeedPaper();

	libm2.YkPrintStr(iconv.encode(' 站点号：' + '42950575' +'\0','gbk'));
	libm2.YkPrintStr( iconv.encode(' \0','gbk'));
	libm2.YkPrintStr(iconv.encode('  流水号：' +'6299'+'\0','gbk'));
	libm2.YkTabMove();
	libm2.YkPrintStr(iconv.encode('投注方式:自助\0','gbk'));
	libm2.YkFeedPaper();


	libm2.YkPrintStr(iconv.encode(' 金额：' + detail.orderbonus + '元\0','gbk'));
	libm2.YkTabMove();
	libm2.YkPrintStr( iconv.encode('  \0','gbk'));
	libm2.YkPrintStr(iconv.encode('    购买时间：' + detail.orderTime +'\0','gbk'));
	libm2.YkFeedPaper();
	libm2.YkPrintStr( iconv.encode('\0','gbk'));
	libm2.YkPrnAndFeedPaper(2);

	libm2.YkSelectFont(1);
	libm2.YkSetCharSize(1,1);
	libm2.YkSetAlign(0);

	for(var b=0;b<1;b++){
		var bs_ball = iconv.encode(' '+detail.bonus+' ('+detail.multiple+')\0','gbk');
		libm2.YkPrintStr(bs_ball);
		libm2.YkFeedPaper();

	}
	for(var d=0;d<5-1;d++){
		libm2.YkPrintStr(iconv.encode(' \0','gbk'));
		libm2.YkFeedPaper();
	}
	libm2.YkPrintStr(iconv.encode(' \0','gbk'));
	libm2.YkPrnAndFeedPaper(2);

	libm2.YkSelectFont(0);
	libm2.YkSetCharSize(0,0);
	libm2.YkSetAlign(0);


	bs_ba_0 = iconv.encode(' 开奖日期：'+  '2016-11-10 21:00'+'\0','gbk');


	libm2.YkPrintStr(bs_ba_0);
	libm2.YkFeedPaper();

	var bs_ba_1 = iconv.encode(' 订单号：'+detail.orderNumber+'\0','gbk');
	libm2.YkPrintStr(bs_ba_1);
	libm2.YkFeedPaper();
	
	var bs_b_2 = iconv.encode(' 用户：'+detail.username+'\0','gbk');
	libm2.YkPrintStr(bs_b_2);
	libm2.YkFeedPaper();


	var bs_b_3 = iconv.encode(' 客服热线：400-9913-700\0','gbk');
	libm2.YkPrintStr(bs_b_3);
	libm2.YkFeedPaper();

	libm2.YkPrintStr( iconv.encode(' 终端号：'+ clientId +'\0','gbk'));
	libm2.YkFeedPaper();


	libm2.YkPrintStr(iconv.encode(' 终端机地址：'+ dizhi +'\0','gbk'));
	libm2.YkFeedPaper();

	libm2.YkSetHRIPos(0);
	libm2.YkSetBarCodeHeight(60);
	libm2.YkSetBarCodeWidth(2);
	var b_code = new Buffer('{B'+'101' + '2016132' + '0' + 'HBP2016111007295600315364'+'\0');
	libm2.YkPrintBarCode(73,b_code.length-1,b_code);
//                libm2.YkFeedPaper();
//                libm2.YkSetBlackMarkParam(2,0,44,3);//开始切纸
//                libm2.YkSetBlackMarkParam(1,0,44,3);//开始打印位置设置
//                libm2.YkFeedPaper();
	libm2.YkPrnAndFeedPaper(2);
	libm2.YkPrnAndBackToStd();
	console.log('cut result',libm2.YkCutPaper(66,0));


    var buf_state = libm2.YkGetStatus(4);
    console.log('status query ',buf_state);
    if(buf_state == -1){
        ErrorHandler.SubError(3,'打印机状态查询失败',buf_state,1);
        logger.error('打印机状态查询失败',buf_state);
    }else{
        var a=buf_state&0x0c;
        var b=buf_state&0x60;
        if(a != 0 || b !=0){
            var erromsg = '';
            erromsg =  a !=0  ? erromsg + '纸将尽' :erromsg;
            erromsg =  b !=0  ? erromsg + '纸尽' :erromsg;
            //   erromsg =  ps[2] !=0  ? erromsg + '切刀错' :erromsg;
            //   erromsg =  ps[3] !=0  ? erromsg + '打印头过热' :erromsg;
            ErrorHandler.SubError(3,erromsg,'1',2);
            logger.error('打印机状态错误',erromsg);
        }
    }
    var close_result  = libm2.YkCloseDevice();
    if(close_result != 0){
        ErrorHandler.SubError(3,'打印机关闭失败',close_result,1);
    }
    cb(null);
}

exports.test_print= function () {
    var port = libm2.YkOpenDevice(parseInt(com.substr(com.length-1,1)),38400);
    if(port == -1){
        console.log(libm2.YkCloseDevice());
        ErrorHandler.SubError(3,'打印机打开失败','-1',1);
        logger.error('打印机打开失败',port);
        return ;
    }
    var print_count=0;
    logger.info('------------------------测试打印-----------------------');
    var r1 = libm2.YkGetDeviceHandle();
    var r2 = libm2.YkInitPrinter();
    var r3 = libm2.YkSetLeftMargin(20,0);
    var r4 = libm2.YkFeedToStartPos();
    logger.info(r1,r2,r3,r4);
    libm2.YkSelectFont(0);
    libm2.YkSetCharSize(0,0);
    libm2.YkSetAlign(0);
    libm2.YkPrintStr(iconv.encode(' 这是一张打印票\0','gbk'));
    libm2.YkPrintStr(iconv.encode(' 这是一张打印票\0','gbk'));
    libm2.YkPrintStr(iconv.encode(' 这是一张打印票\0','gbk'));
    libm2.YkFeedPaper();
    libm2.YkPrnAndBackToStd();
    console.log('cut result',libm2.YkCutPaper(66,0));
    print_count++;
    var close_result  = libm2.YkCloseDevice();
    if(close_result != 0){
        ErrorHandler.SubError(3,'打印机关闭失败',close_result,1);
    }
    ErrorHandler.printPapers(print_count);
}
var format_date=function  (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    month = ((month < 10) ? '0' : '') + month;
    day = ((day < 10) ? '0' : '') + day;
    hour = ((hour < 10) ? '0' : '') + hour;
    minute = ((minute < 10) ? '0' : '') + minute;

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute ;//+ ':' + second;
}

