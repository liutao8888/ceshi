var PayView = Backbone.View.extend({
    // payType:'account' 我的账户
    el: $('#paymodal'),
    events: {
        'click #duka_cancel': 'duka_cancel',
        'click .cls_paymodal': 'hide_modal',
        'click .pay_duka': 'read_card',
        'click #cofirm_phone': 'cofirm_phone',
        'click #cx_phone': 'checkuser',
        'click #edit_phone': 'edit_phone',
        'click #rg_send_vali,#rspwd_send_vali': 'sendPhoneCode',
        'focus #pay_phone,#pay_phone2,#rg_valicode,#login_yuepwd,#new_bankcard,#rspwd_valicode,#rspwd_newpwd,#login_pass,#rspwd_re_pwd,#newcardno,#rg_password,#rg_paypasswd,#rg_repeat_password,#rg_idcard': 'show_keyboard',
        'click #sub_login': 'login',
        'click #pay_yue_show': 'payyueshow',
        'click #pay_dukaqi': 'paydukaqi',//登陆后银行卡支付
        'click #sub_register': 'register',
        'click #changecard': 'showchangecard',
        'click #sub_upcard': 'qzbinkcard',
        'click #sub_loginyue': 'pay_yue',
        'click #re_enter_phone': 're_enter_phone',
        'click #cx_yuephone': 'chooseyue',
        'click .enter_phone': 'enter_phone',

        //新流程添加事件
        'click #notreg': 'nrmakeorder',
        'click #show_register': 'show_register',
        'click #forget_pwd': 'forgetpwd',
        'click #sub_vali': 'sub_resetpwd',
        'click #sub_yuepay': 'pay_yue',
        'click #yhxy': 'show_yhxy',//显示用户协议
        'click #qr_yhxy': 'qr_yhxy',//确认用户协议
        'click #yonghuxiyi': 'checked_yhxy',//判断用户是否勾选
        'click #btn-back': 'close_back',
//      'click #printAgain':'printAgain'
    },
    //确认用户协议
    qr_yhxy: function () {
    },
    close_back: function () {
        $('#modal_yhxy').modal('hide');
    },
    //显示用户协议
    show_yhxy: function () {
        $('#modal_yhxy').modal('show');
    },
    //判断用户是否勾选
    checked_yhxy: function () {
        if ($("#yonghuxiyi").is(':checked')) {
            //console.log(1);
            $("#sub_register").removeAttr("disabled");
        } else {
            //console.log(0);
            $('#sub_register').attr('disabled', 'true');
        }
    },
    show_keyboard: function (e) {
        $(e.currentTarget).numberKeyboard();
    },
    modal_content: function (html, buttons) {
        buttons = buttons || '';
        var cont = '<div class="pop-all text-center">' + html + '<div class="pop-button text-center">' + buttons + '</div></div>';
        $('#paymodal .modal-content').html(cont);
    },

    inti: function (payment) {
        this.payment = payment;
        this.orderNum = null;
        this.phoneNo = null;
        this.password = null;
        this.retry = 0;
        this.temt = 1;//注册用户 1 非注册用户0
        var descr = '';
        var money = 0;
        if (this.payment.payType == 'lottery') {
            descr = '彩票交易';
            money = this.payment.info.money;
        } else if (this.payment.payType == 'phone') {
            descr = '手机充值交易';
            money = this.payment.info.money;
        } else if (this.payment.payType == 'credit') {
            descr = '信用卡还款业务';
            money = this.payment.info.money;
        } else if (this.payment.payType == 'cardtocard') {
            descr = '卡卡转账';
            money = this.payment.info.money;
        } else if (this.payment.payType == 'recharge') {
            descr = '账户充值';
            money = this.payment.info.money;
            this.phoneNo = this.payment.info.account;
        } else if (this.payment.payType == 'chase') {
            descr = '提现';
        } else if (this.payment.payType == 'account') {//手机登录
            descr = '福彩宝账户';
        } else if (this.payment.payType == 'register') {//手机登录
            descr = '福彩宝账户注册';
        }
        logger.info('=======当前交易======' + JSON.stringify(payment));
        $('#paymodal .modal-header').html('您正在支付一笔金额为【<b class="fg-orange" >' + money + '</b>】元的' + descr);
        if (this.payment.payType == 'lottery') {
            this.enter_phone();
        } else if (this.payment.payType == 'recharge' || this.payment.payType == 'cardtocard' || this.payment.payType == 'credit') {
            this.make_order();
        } else if (this.payment.payType == 'account') {
            $('#paymodal .modal-header').html('');
            this.enter_phone();
        } else {//全民付
            this.read_card();
        }
    },
    //输入手机号
    enter_phone: function () {
        if(window.sessionStorage&&sessionStorage.getItem("userInfo")){
            this.user=sessionStorage.getItem("userInfo");
            this.phoneNo=JSON.parse(this.user).tel;
            this.password=this.encry.decodeDes3cbc(sessionStorage.getItem("pwd"));
        }
        if(sessionStorage.getItem("userInfo")){
            var that =this;
            lotteryQuery.login(this.phoneNo, this.password, function (err, userInfo) {
                if (err) {
                    that.modal_content('<div class="jycl-h2">登录失败【' + err.message + '】,请稍后再试。</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
                } else {
                    that.user = {
                        id: userInfo.user,
                        tel: that.phoneNo,
                        pwd: userInfo.pwd,
                        name: userInfo.user,
                        idCard: userInfo.idCard,
                        balance: userInfo.balance,
                        lockbalance: userInfo.lockbalance,
                        tkBankcardNo: userInfo.tkbankcardno,
                        sendbalance: userInfo.sendbalance,
                        rechargebalance: userInfo.rechargebalance
                    };
                    that.temt = 1;
                    if(window.sessionStorage){
                        sessionStorage.setItem("pwd",that.encry.des3cbc(that.password));
                        sessionStorage.setItem("userInfo",JSON.stringify(that.user));
                    }
                    if (that.payment.payType == 'account') {
                        that.go_to_way();
                    } else {
                        that.make_order();
                    }
                }
            });
        }else{
            this.modal_content($('#temp_enterphone').html());
            $(this.el).modal({
                backdrop: 'static',
                show: true
            });
            if (this.payment.payType == 'account') {
                $('.tj-header').addClass("hidden");
            }
            $('#pay_phone').focus();
        }
    },


    //验证用户  普通彩种可“匿名”购买  快三强制注册
    checkuser: function (e) {
        var user_phone;
        user_phone = $.trim($('#pay_phone').val());
        var regex = new RegExp('^1\\d{10}$');
        if (regex.test(user_phone)) {
            this.phoneNo = user_phone;
            $('#pay_phone').parent().removeClass('has-error');
            $('#pay_phone').removeClass('has_error');
            var that = this;
            that.modal_content('<div class="jycl-h2">业务处理中，请稍后&nbsp;&nbsp;&nbsp;<img src="images/loading.gif" width="60" height="60" /></div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
            lotteryQuery.resgisterVal(that.phoneNo, function (err, res_code) {
                logger.info('验证用户============================' + res_code);
                if (err) {
                    that.show_error(err.message);
                } else if (res_code == '0011') {//用户存在
                    that.show_login();//登录
                } else if (res_code == '0002') {//不存在
                    if (that.payment.lotteryType == 'k3') {
                        that.show_register();
                    } else if (that.payment.payType == 'account') {
                        that.modal_content('<div class="jycl-h2">对不起当前用户不存在！</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
                    } else {
                        that.chooseregister()
                    }
                }
            });
        }
    },

    //普通彩种 选择是否注册
    chooseregister: function () {
        this.modal_content(_.template($('#temp_chooseregister').html())({phone: this.phoneNo}));
    },

    //显示登录界面 输入密码
    show_login: function () {
        this.modal_content(_.template($('#temp_login').html())({phone: this.phoneNo}));
        $('#login_pass').focus();
    },

    //银联支付
    paydukaqi: function () {
        this.read_card();
    },

    //登录
    login: function (e) {
        var that = this;
        this.password = $('#login_pass').val();
        var btn = $(e.currentTarget);
        btn.button('loading');
        lotteryQuery.login(this.phoneNo, this.password, function (err, userInfo) {
            btn.button('reset');
            console.log(userInfo);
            if (err) {
                that.modal_content('<div class="jycl-h2">登录失败【' + err.message + '】,请稍后再试。</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
            } else {
                that.user = {
                    id: userInfo.user,
                    tel: that.phoneNo,
                    pwd: userInfo.pwd,
                    name: userInfo.user,
                    idCard: userInfo.idCard,
                    balance: userInfo.balance,
                    lockbalance: userInfo.lockbalance,
                    tkBankcardNo: userInfo.tkbankcardno,
                    sendbalance: userInfo.sendbalance,
                    rechargebalance: userInfo.rechargebalance
                };
                that.temt = 1;
                if(window.sessionStorage){
                    sessionStorage.setItem("pwd",that.encry.des3cbc(that.password));
                    sessionStorage.setItem("userInfo",JSON.stringify(that.user));
                }
                if (that.payment.payType == 'account') {
                    that.go_to_way();
                } else {
                    //this.confirmTicket();
                    that.make_order();
                }
            }
        });
    },

    //跳转(我的账户登录后转过来、注册成功后转过来登录)
    go_to_way: function () {
        var that = this;
        if (this.payment.payType == 'account') {
            $('.modal').modal('hide');
            window.location.href = '#account/' + JSON.stringify(that.user);
        } else {//注册后登录
            lotteryQuery.login(that.user.id, that.password, function (err, res) {
                if (err) {
                    that.modal_content('<div class="jycl-h2">登录失败【' + err.message + '】,请稍后再试。</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
                } else {
                    //that.password=res.pwd;
                    that.user = {
                        id: res.user,
                        tel: that.user.tel,
                        pwd: res.pwd,
                        name: res.name,
                        idCard: res.idCard,
                        balance: res.balance,
                        lockbalance: res.lockbalance,
                        tkBankcardNo: res.tkbankcardno,
                        sendbalance: res.sendbalance,
                        rechargebalance: res.rechargebalance
                    };
                    that.make_order();
                }
            });
        }
    },

    //普通彩种直接下单//匿名购买
    nrmakeorder: function () {
        this.make_order();
        this.temt = 0;
    },

    //3-下单
    make_order: function () {
        if (!this.orderNum) { //未下过单
            this.modal_content('<div class="jycl-h2">订单生成中&nbsp;&nbsp;&nbsp;<img src="images/loading.gif" width="60" height="60" /></div>', '');
            $('#paymodal').modal('show');
            var that = this;
            that['makeOrder_' + that.payment.payType](function (err, returns) {
                if (err) {
                    that.modal_content('<div class="jycl-h2">订单生成失败【' + err.message + '】，请稍后再试.</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">确定</button>');
                    return;
                } else {
                    that.orderNum = returns;
                    //var fs = require("fs");
                    //if (returns) {
                    //    fs.writeFile(process.execPath.substr(0, process.execPath.lastIndexOf('\\') + 1) + '\\ordernum.txt', new Date() + '|' + returns, function (err) {
                    //    });
                    //}
                    if(window.sessionStorage){
                        sessionStorage.setItem("ordernum",returns);
                    }
                    logger.info('recharge 读卡开始====' + that.orderNum);
                    if (that.payment.payType == 'recharge') {//账户|手机 充值
                        that.read_card();
                    } else if (that.payment.payType == 'phone') {
                        that.read_key();
                    } else if (that.payment.payType == 'cardtocard' || that.payment.payType == 'credit') {
                        that.read_card();
                    } else {
                        if (that.temt == 0 && that.payment.lotteryType != 'k3') {//匿名购买
                            logger.info(' 匿名购买读卡开始====' + that.orderNum, that.temt, that.payment.lotteryType);
                            that.read_card();
                        } else {
                            //下单成功选择支付方式
                            logger.info('=======普通订单下单成功选择支付方式=======' + that.orderNum);
                            that.choosepay();
                        }
                    }
                }
            });
        } else {
            this.choosepay();
        }
    },

    //1-读卡（充值、普通支付）
    read_card: function () {
        this.modal_content('<div class="jycl-h2">初始化读卡器中，请稍后&nbsp;&nbsp;&nbsp;<img src="images/loading.gif" width="60" height="60" /></div>');
        $(this.el).modal({
            backdrop: 'static',
            show: true
        });
        this.cardNo = 'no_card';
        var that = this;
        var paytype = that.payment.payType;
        logger.info('========读卡开始=======', that.orderNum);
        setTimeout(function () {
            that.dukaqi['read_card_' + paytype](
                function () {
                    that.modal_content('<div class="jycl-h2">请插入您的银行卡</div>', '<button class="btn btn-mg btn-default fg-white" id="duka_cancel">取消</button>');
                    that.speaker('chaka');
                },
                function (err, card_no) {
                    if (err) {
                        that.modal_content('<div class="jycl-h2">' + err.message + '</div>', '<button class="btn btn-mg btn-default fg-white pay_duka">重试</button><button class="btn btn-mg btn-default fg-white cls_paymodal" >返回</button>');
                    } else {
                        that.cardNo = card_no;
                        logger.info('**********读卡结果********' + paytype, card_no, that.orderNum, that.temt);
                        if (that.payment.payType == 'phone') {
                            that.make_order();
                        } else {
                            that.read_key();//读完卡号直
                        }
                    }
                });
        }, 500);
    },

    //4-输入-读取密码
    read_key: function () {
        this.modal_content('<div class="jycl-h2">请输入银行卡密码</div><div class="pop-button text-center" id="mima_contain"></div>');
        this.speaker('mima');
        var that = this;
        var paytype = that.payment.payType;
        logger.info('=======输入密码=======', that.orderNum);
        setTimeout(function () {
            that.jianpan['read_key_' + paytype](function (err) {
                if (err) {
                    that.modal_content('<div class="jycl-h2">出错了，' + err.message + '交易已取消，请收好银行卡</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal" >返回</button>');
                    return;
                }
                that.modal_content('<div class="jycl-h2">订单支付中，请稍等&nbsp;&nbsp;&nbsp;<img src="images/loading.gif" width="60" height="60" />', '');
                setTimeout(function () {
                    that.pos['pay_' + that.payment.payType](that.payment.info, function (err, result) {
                        logger.info('=========银联交易结果=======' + JSON.stringify(result), that.orderNum);
                        if (err) {
                            that.modal_content('<div class="jycl-h2">系统出错！请 重新交易 或者 取消。</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">取消</button><button class="btn btn-mg btn-inverse fg-white pay_duka">重新交易</button></div></div>');
                        } else if (!result.success) {
                            that.modal_content('<div class="jycl-h2">交易失败！【' + result.message + '】请 重新交易 或者 返回。</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal" >取消</button><button class="btn btn-mg btn-inverse fg-white pay_duka">重新交易</button>');
                        } else if (result.success) {
                            //var fs = require('fs');
                            //if (!that.orderNum) {
                            //    that.orderNum=fs.readFileSync(process.execPath.substr(0, process.execPath.lastIndexOf('\\') + 1) + '\\ordernum.txt','utf-8').split('|')[1];
                            //    logger.info('------文件中读取到的订单号--',that.orderNum);
                            //}
                            if(window.sessionStorage){
                                that.orderNum=sessionStorage.getItem("ordernum");
                                that.logger.info('------文件中读取到的订单号--',that.orderNum);
                            }
                            that.cardNo=result.kahao;
                            that.Errhandler.payInfoTjs(that.payment.payType, JSON.stringify(result), that.orderNum);
                            that.modal_content('<div class="jycl-h2">支付成功！订单提交中，请<b class="fg-orange">&nbsp;及时取走您的银行卡！</b></div>');
                            that.pay_order(result);
                        }
                    });
                }, 20);
            }, function () {
                var qx = '<div class="pop-all text-center"><div class="jycl-h2">您已经取消支付。</div>' +
                    '<div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>' +
                    '<button class="btn btn-mg btn-inverse fg-white pay_duka" >重新交易</button></div></div>';
                $('#paymodal .modal-content').html(qx);

            }, function () {
                $('#mima_contain').append("<span>*</span>");
            }, function () {
                $('#mima_contain span').remove();
            });
        }, 60);
    },

    //忘记密码
    forgetpwd: function () {
        this.modal_content($('#temp_resetpwd').html());
        $(this.el).modal({
            backdrop: 'static',
            show: true
        });
    },

    //确认修改
    sub_resetpwd: function (e) {
        var rspwd_valicode = $.trim($('#rspwd_valicode').val()), rspwd_newpwd = $.trim($('#rspwd_newpwd').val()), rspwd_re_pwd = $.trim($('#rspwd_re_pwd').val());
        if (rspwd_newpwd && rspwd_newpwd.length >= 6) {
            $('#rspwd_newpwd').parent().parent().removeClass('has-error');
        } else {
            $('#rspwd_newpwd').parent().parent().addClass('has-error');
            this.show_error(!rspwd_newpwd ? '请输入密码' : '密码不能少于6位');
            return;
        }
        if (rspwd_newpwd != rspwd_re_pwd) {
            $('#rspwd_re_pwd').parent().parent().addClass('has-error');
            this.show_error('两次输入的密码不一致，请正确输入');
            return;
        } else {
            $('#rspwd_re_pwd').parent().parent().removeClass('has-error');
        }
        if (!rspwd_valicode || rspwd_valicode.length != 6) {
            $('#rspwd_valicode').parent().parent().addClass('has-error');
            this.show_error(!!$('#rspwd_valicode').val() ? '请输入验证码' : '验证码的长度为6位');
            return;
        } else {
            $('#rspwd_valicode').parent().parent().removeClass('has-error');
        }
        var user = {
            id: this.phoneNo
        }
        var btn = $(e.currentTarget);
        btn.button('loading');
        var that = this;
        lotteryQuery.updatePwd(rspwd_valicode, user, rspwd_newpwd, rspwd_newpwd, function (err, rest) {
            btn.button('reset');
            if (err) {
                that.show_error(err.message);
            } else {
                lotteryQuery.login(user.id, rspwd_newpwd, function (error, res) {
                    if (error) {
                        that.modal_content('<div class="jycl-h2">登录失败【' + err.message + '】,请稍后再试。</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
                    } else {
                        that.user = {
                            id: res.tel,
                            tel: res.tel,
                            pwd: res.pwd,
                            name: res.name,
                            idCard: res.idCard,
                            balance: res.balance,
                            lockbalance: res.lockbalance,
                            tkBankcardNo: res.tkbankcardno,
                            sendbalance: res.sendbalance,
                            rechargebalance: res.rechargebalance
                        };
                        if (that.payment.payType == 'account') {
                            that.go_to_way();
                        } else {
                            that.make_order();
                        }
                    }
                });
            }
        })
    },

    //2-（可选）确定手机号码（普通彩票）
    cofirm_phone: function (e) {
        if ($('#pay_phone').length == 11) {
            var phone_regex = new RegExp('^\\d{11}$');
            if (!phone_regex.test($('#pay_phone').val())) {
                $('#pay_phone').addClass('txt_error');
                return;
            } else {
                this.phoneNo = $('#pay_phone').val();
                this.make_order();
            }
        } else {
            this.make_order();
        }
    },

    //银行卡有对应手机号---银行卡登录
    gomakeorder: function () {
        this.make_order();
    },

    //显示更换绑定卡界面
    showupdatecard: function () {
        this.modal_content($('#temp_selectupdatecard').html());
        $(this.el).modal({
            backdrop: 'static',
            show: true
        });
    },

    //返回重新输入手机号
    re_enter_phone: function () {
        this.modal_content('<div style="position:relative;width: 1280px;overflow: hidden;"> <p style="position:relative;left:100px;color:#a00610;">温馨提示：为了方便您兑奖首次购彩请输入您有效的手机号码，您中奖后，请积极配合工作人员核对您相关信息以便及时返奖，谢谢。</p> </div><div class="jycl-h2 row"><div class="col-md-3 col-md-offset-3">请输入您的手机号：</div><div class="col-md-3"><input type="text" class="form-control" id="pay_phone2"/></div></div>', '<button class="btn btn-mg btn-inverse fg-white" id="cofirm_phone2">确定</button><button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
        $('#pay_phone2').focus();
    },

    //5-银联交易完成 支付提交订单记录到服务器
    pay_order: function (result) {
        var that = this;
        var phone = that.phoneNo || '13656687882';
        var pass = '12345678';
        if (this.payment.lotteryType == 'k3') {
            phone = that.user.id || phone;
            pass = that.user.pwd;
        }
        that.retry++;
        var kahao = $.trim(result.kahao) || this.cardNo;
        var money;
        money = that.payment.info.money;
        //var fs = require('fs');
        //if (!that.orderNum) {
        //    that.orderNum=fs.readFileSync(process.execPath.substr(0, process.execPath.lastIndexOf('\\') + 1) + '\\ordernum.txt','utf-8').split('|')[1];
        //}
        if(window.sessionStorage){
            that.orderNum=sessionStorage.getItem("ordernum");
            that.logger.info('------文件中读取到的订单号--',that.orderNum);
        }
        lotteryQuery.payOrder(phone, pass, that.orderNum, kahao, money, result.jiaoyihao, null, function (err, pay_result) {
            that.logger.info('====payOrder：pay_result=====' + JSON.stringify(pay_result), result, that.orderNum);
            if (err) {
                if (that.retry <= 5) {
                    that.modal_content('<div class="jycl-h2">网络不给力，正在进行第' + that.retry + '次重试</div>', '');
                    setTimeout(function () {
                        that.pay_order(result);
                        that.logger.info('=======交易重试====' + that.retry, err.message);
                    }, 1000 * 3);
                } else {

                    if (that.retry > 5) {
                        var type = 1;
                        if (that.temt == 0 && that.payment.lotteryType != 'k3') {//非注册用户
                            type = 0;
                        }
                        //if (!that.orderNum) {
                        //    that.orderNum=fs.readFileSync(process.execPath.substr(0, process.execPath.lastIndexOf('\\') + 1) + '\\ordernum.txt','utf-8').split('|')[1];
                        //    logger.info('------payOrder 重试5次失败 文件中读取到的订单号--',that.orderNum);
                        //}
                        if(window.sessionStorage){
                            that.orderNum=sessionStorage.getItem("ordernum");
                            that.logger.info('------payOrder 重试5次失败 文件中读取到的订单号--',that.orderNum);
                        }
                        //that.Errhandler.orderinfotjs('1', type, that.orderNum, err.message, that.cardNo);
                    }
                    if (that.payment.payType == 'lottery') {
                        that.modal_content('<div class="jycl-h2">抱歉，订单提交失败了【' + err.message + '】，请联系客服退款，快三订单金额会直接返到账户中，请<b class="fg-orange">&nbsp;及时取走您的银行卡！</b></div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal" >返回</button>');
                    } else {
                        $('#paymodal .modal-content').html('<div class="pop-all text-center"><div class="jycl-h2">您的业务已经办理成功，<b class="fg-orange">但系统未记录到您业务信息，请及时取走您的银行卡！</b></div><div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button></div></div>');
                    }
                    that.speaker('quka');
                    that.dukaqi.return_card();
                }
            } else if (!pay_result.success) {//request error
                if (that.payment.payType == 'lottery') {
                    that.modal_content('<div class="jycl-h2">订单付款失败了，【' + pay_result.message + '】，我们客服会联系您退款请放心，快三订单金额会直接返到账户中，请<b class="fg-orange">&nbsp;及时取走您的银行卡！</b></div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal" >返回</button>');
                } else {
                    $('#paymodal .modal-content').html('<div class="pop-all text-center"><div class="jycl-h2">您的业务已经办理完成，<b class="fg-orange">但系统未记录到您业务信息，请及时取走您的银行卡！</b></div><div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button></div></div>');
                }
                that.dukaqi.return_card();
                that.speaker('quka');
            } else {
                if (that.payment.payType != 'lottery') {
                    tickets.reset();
                    that.modal_content('<div class="jycl-h2">您的业务已办理成功！<b class="fg-orange">&nbsp;及时取走您的银行卡！</b></div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
                    that.dukaqi.return_card();
                    that.speaker('quka');
                    return;
                }
                $('#paymodal .modal-content').html('<div class="pop-all text-center"><div class="jycl-h2">订单提交成功！打印票据中</div></div>');
                that.dukaqi.return_card();
                //console.log('银行卡支付打印信息',pay_result.info);
                that.logger.info('=======银行卡支付打印信息====' + JSON.stringify(pay_result.info));
                setTimeout(function () {
                    that.print_ticket(pay_result.info);
                }, 150);
                
            }
        });
    },

    //6-打印彩票
    print_ticket: function (pay_result) {
        var that = this;
        that.dayinji.write_lottery(tickets, that.orderNum, pay_result, function (err) {
            if (that.payment.payType == 'lottery') {
                tickets.reset();
                $('.on-redball').removeClass('on-redball');
            }
            //console.log('开始打印');
            if (err) {
                that.modal_content('<div class="jycl-h2">票据打印失败了！<b class="fg-orange">但：彩票已购买成功，中奖后会通知到您，请放心！请收好银行卡</b></div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>')
            } else {
                that.modal_content('<div class="jycl-h2">票据打印成功！<b class="fg-orange">&nbsp;请收好银行卡和票据！</b></div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
            }
            that.speaker('lottery');
        });

    },
    
    //显示注册界面
    show_register: function () {
        this.modal_content(_.template($('#temp_register').html())({phone: this.phoneNo}));
    },

    //下发验证码
    sendPhoneCode: function (e) {
        var btn = $(e.currentTarget);
        if (btn.hasClass('disabled')) {return;}
        btn.addClass('disabled').text('发送中..');
        var that = this;
        lotteryQuery.sendVali(this.phoneNo, function (err, info) {
            that.countdown(btn);
        });
    },
    count_down_interv: null,
    countdown: function (item) {
        if (this.count_down_interv || item.length <= 0) {
            clearInterval(this.count_down_interv);
        }
        var secs = 60;
        var that = this;
        this.count_down_interv = setInterval(function () {
            if (item.length <= 0) {
                clearInterval(that.count_down_interv);
                return;
            }
            secs = secs - 1;
            if (secs < 0) {
                clearInterval(that.count_down_interv);
                item.removeClass('disabled').text('重发');
            } else {
                item.text('重发 ' + secs + ' 秒');
            }
        }, 1000);
    },
    checkIdcard:function (idcard){
        var Errors=new Array(
            "验证通过",
            "身份证号码位数不对",
            "身份证号码出生日期超出范围或含有非法字符",
            "身份证号码校验错误",
            "身份证地区非法"
        );
        var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
        var Y,JYM,ereg,S,M;;
        var idcard_array;
        idcard_array = idcard.split("");
        //地区检验
        if(area[parseInt(idcard.substr(0,2))]==null) return Errors[4];
        //身份号码位数及格式检验
        switch(idcard.length){
            case 15:
                if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
                    ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
                } else {
                    ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
                }
                if(ereg.test(idcard)) return Errors[0];
                else return Errors[2];
                break;
            case 18:
                //18位身份号码检测
                //出生日期的合法性检查
                //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){
                    ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
                } else {
                    ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
                }
                if(ereg.test(idcard)){//测试出生日期的合法性
                    //计算校验位
                    S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                        + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                        + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                        + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                        + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                        + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                        + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                        + parseInt(idcard_array[7]) * 1
                        + parseInt(idcard_array[8]) * 6
                        + parseInt(idcard_array[9]) * 3 ;
                    Y = S % 11;
                    M = "F";
                    JYM = "10X98765432";
                    M = JYM.substr(Y,1);//判断校验位
                    if(M == idcard_array[17]) return Errors[0]; //检测ID的校验位
                    else return Errors[3];
                }
                else return Errors[2];
                break;
            default:
                return Errors[1];
                break;
        }

    },
    //用户注册
    register: function (e) {
        var password = $.trim($('#rg_password').val()), valicode = $.trim($('#rg_valicode').val()), idcard = $.trim($('#rg_idcard').val());
        if (password && password.length >= 6) {
            $('#rg_password').parent().parent().removeClass('has-error');
        } else {
            $('#rg_password').parent().parent().addClass('has-error');
            this.show_error(!password ? '请输入密码' : '密码不能少于6位');
            return;
        }
        var paypassword = password;
        var email = 'zytftest@163.com';
        if (!paypassword || paypassword.length < 6) {
            $('#rg_paypassword').parent().parent().addClass('has-error');
            this.show_error('支付密码格式不正确');
            return;
        }
        if (password != $.trim($('#rg_repeat_password').val())) {
            $('#rg_repeat_password').parent().parent().addClass('has-error');
            this.show_error('两次输入的密码不一致，请正确输入');
            return;
        } else {
            $('#rg_repeat_password').parent().parent().removeClass('has-error');
        }
        if (!$('#rg_valicode').val() || $('#rg_valicode').val().length != 6) {
            $('#rg_valicode').parent().parent().addClass('has-error');
            this.show_error(!!$('#rg_valicode').val() ? '请输入验证码' : '验证码的长度为6位');
            return;
        } else {
            $('#rg_valicode').parent().parent().removeClass('has-error');
        }
        if (this.checkIdcard(idcard)!='验证通过') {
            $('#rg_idcard').parent().parent().addClass('has-error');
            this.show_error(!!$('#rg_idcard').val() ? '请输入身份证号' : '请输入正确的身份证号码');
            return;
        } else {
            $('#rg_idcard').parent().parent().removeClass('has-error');
        }
        var that = this;
        var btn = $(e.currentTarget);
        btn.button('loading');
        that.password = password;
        lotteryQuery.register(valicode, this.phoneNo, '', '', email, password, paypassword, idcard, that.cardNo, function (err, info) {
            btn.button('reset');
            if (err) {
                that.modal_content('<div class="jycl-h2">注册失败！【' + err.message + '】</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
            } else {
                if (info.retcode == '0000') {
                    that.user = {
                        id: info.res.user,
                        tel: that.phoneNo,
                        pwd: info.res.pwd,
                        name: info.res.name,
                        balance: info.res.balance,
                        lockbalance: 0,
                        tkBankcardNo: info.res.tkBankcardNo,
                        sendbalance: info.res.sendbalance,
                        rechargebalance: info.res.rechargebalance,
                        lastLogin: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
                    }
                    that.temt = 1;
                    that.go_to_way();
                } else {
                    that.modal_content('<div class="jycl-h2">注册失败！【' + info.retcode + '】</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
                }
            }
        });
    },

    //选择支付方式
    choosepay: function () {
        var paytype = this.payment.payType ? this.payment.payType : this.payment.czinfo.payType;
        if (paytype == 'upcard' || paytype == 'account' || paytype == 'login' || paytype == 'register') {
            paytype = 'lottery';
        }
        this.dukaqi['return_card_' + paytype]();//显示选择支付页面前退卡
        $('#paymodal .modal-header').html('您正在支付一笔金额为【<b class="fg-orange" >' + this.payment.info.money + '</b>】元的交易');
        logger.info('选择支付========', paytype, this.user.balance, this.orderNum);
        this.modal_content(_.template($('#temp_choosepay').html())({
            phone: this.phoneNo,
            balance: this.user.balance,
            money: this.payment.info.money
        }));
    },

    //选择余额支付
    payyueshow: function (e) {
        this.temt = 1;
        this.modal_content(_.template($('#temp_loginyue').html())({phone: this.phoneNo}));
        $('#login_yuepwd').focus();
    },
    //余额支付
    pay_yue: function (e) {
        var that = this;
        var orderinfo = {
            backbonusType: '0',
            tickets: tickets.toJSON(),
            money: this.payment.info.money
        };
        var btn = $(e.currentTarget);
        that.retry++;
        var paypwd = $.trim($('#login_yuepwd').val());
        if (!paypwd || paypwd.length < 6) {
            $('#login_yuepwd').parent().parent().addClass('has-error');
            that.show_error('支付密码格式不正确');
            return;
        } else {
            $('#login_yuepwd').parent().parent().removeClass('has-error');
        }
        btn.button('loading');
        lotteryQuery.payOrderByAccount(that.user.id, that.user.pwd, that.orderNum, paypwd, this.payment.info.money, orderinfo, function (err, res) {
            btn.button('reset');
            if (err) {
                if (that.retry <= 5) {
                    that.modal_content('<div class="jycl-h2">网络不给力，正在进行第' + that.retry + '次重试</div>', '');
                    setTimeout(function () {
                        that.pay_yue();
                        logger.info('===========余额支付重试========' + that.retry, err.message);
                    }, 1000 * 3);
                } else {
                    if (that.retry > 5) {
                        that.Errhandler.orderinfotjs('0', '1', that.orderNum, err.message);
                    }
                    if (that.payment.payType == 'lottery') {
                        that.modal_content('<div class="jycl-h2">抱歉，订单提交失败了【' + err.message + '】，请稍后再尝试，如有疑问请联系客服。</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal" >返回</button>');
                    } else {
                        $('#paymodal .modal-content').html('<div class="pop-all text-center"><div class="jycl-h2">您的业务已经办理成功，<b class="fg-orange">但系统未记录到您业务信息。</b></div><div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button></div></div>');
                    }
                }
            } else if (!res.success) {//request error
                if (that.payment.payType == 'lottery') {
                    that.modal_content('<div class="jycl-h2">抱歉，您的订单付款失败了，【' + res.message + '】。</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal" >返回</button>');
                } else {
                    $('#paymodal .modal-content').html('<div class="pop-all text-center"><div class="jycl-h2">您的业务已经办理成功，<b class="fg-orange">但系统未记录到您业务信息。</b></div><div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button></div></div>');
                }
            } else {
                if (that.payment.payType != 'lottery') {
                    tickets.reset();
                    that.modal_content('<div class="jycl-h2">您的业务已办理成功！</div>', '<button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button>');
                    return;
                }
                $('#paymodal .modal-content').html('<div class="pop-all text-center"><div class="jycl-h2">订单提交成功！打印票据中</div></div>');
                logger.info('===========余额支付结果========', res);
                setTimeout(function () {
                    that.print_ticket(res.info);
                }, 150);
            }
        })
    },

    //显示错误
    show_error: function (msg) {
        if (msg) {
            $('#paymodal .modal-footer p').text(msg);
            $('#paymodal .modal-footer').show();
        } else {
            $('#paymodal .modal-footer').hide();
        }
    },
    hide_modal: function (e) {
        $('#paymodal').modal('hide');
        if(this.payment.is_record){
            tickets.reset();
        }
        this.duka_cancel();
    },
    dukaqi: require(process.cwd() + '/js_lib/DuKaQiHandler.js'),
    jianpan: require(process.cwd() + '/js_lib/JianPanHandler.js'),
    pos: require(process.cwd() + '/js_lib/PosHandler.js'),
    dayinji: require(process.cwd() + '/js_lib/DaYinJi.js'),
    publicQuery: require(process.cwd() + '/js_lib/PublicQuery.js'),
    logger: require(process.cwd() + '/js_lib/Logger.js').logger,
    Errhandler: require(process.cwd() + '/js_lib/ErrorHandler'),
    encry:require(process.cwd() + '/js_lib/EncryptUtil.js'),
    speaker: function (key) {
        var exec = require('child_process').exec;
        var speakerPath = process.execPath.substr(0, process.execPath.lastIndexOf('\\') + 1);
        exec('Speaker.exe ' + key, {cwd: speakerPath}, function (err, stdout, stdrr) {
            //console.log(speakerPath,err,stdout,stdrr);
        });
    },
    duka_cancel: function () {
        var paytype = this.payment.payType ? this.payment.payType : this.payment.czinfo.payType;
        if (paytype == 'upcard' || paytype == 'account' || paytype == 'login' || paytype == 'register') {
            paytype = 'lottery';
        }
        this.dukaqi['return_card_' + paytype]();
        $('#paymodal').modal("hide");
    },
    makeOrder_lottery: function (cb) {//密码要求密文
        var orderinfo = {
            backbonusType: '1',
            tickets: tickets.toJSON(),
            orderbonus: this.payment.info.money
        }
        var phone = this.phoneNo || '13656687882';
        var pass = this.password || '12345678';
        //console.log(this.payment,this.payment.lotteryType,orderinfo);
        if (this.payment.lotteryType == 'k3') {
            pass = this.user.pwd || this.password;
            lotteryQuery.makeOrderk3(phone, pass, orderinfo, function (err, returns) {
                cb(err, returns);
            });
        } else {
            lotteryQuery.makeOrderk3(phone, '12345678', orderinfo, function (err, returns) {
                cb(err, returns);
            });
        }
    },
    makeOrder_phone: function (cb) {
        var info = this.payment.info;
        this.publicQuery.MakeTelChargeOrder('13656687882', '12345678', info.phone_num, info.money, info.mianzhi, info.fws, cb);
    },
    makeOrder_credit: function (cb) {
        var params = {
            cardNo: this.payment.info.card_no,
            tel: '',
            orderBonus: this.payment.info.money.toString(),
            fee: this.payment.info.money_sx.toString(),
            creditBonus: this.payment.info.money_credit.toString()
        };
        this.publicQuery.MakeCreditOrder('13656687882', '12345678', params, cb);
    },
    makeOrder_cardtocard: function (cb) {
        var params = {
            cardNo: this.payment.info.card_no,
            tel: '',
            orderBonus: this.payment.info.money.toString(),
            fee: this.payment.info.money_sx.toString(),
            creditBonus: this.payment.info.money_credit.toString()
        };
        this.publicQuery.MakeCardToCardOrder('13656687882', '12345678', params, cb);
    },
    makeOrder_recharge: function (cb) {
        var temp = {
            tel: this.payment.info.account || this.phoneNo,
            pwd: this.user.pwd || '12345678',
            id: this.payment.info.account || this.phoneNo
        };
        //console.log('========',this.user,this.payment);
        lotteryQuery.makeRechargeOrder(temp, this.payment.info.money.toString(), function (err, res) {
            cb(err, res);
        });

    },


    //-----------------2-2 修改手机号码（普通彩票）
    edit_phone: function () {
        this.modal_content('<div><div class="jycl-h2 row"><div class="col-md-3 col-md-offset-3">请输入您的手机号：</div><div class="col-md-3"><input type="text" class="form-control" id="pay_phone"/></div></div>', '<button class="btn btn-mg btn-inverse fg-white" id="cofirm_phone">确定</button><button class="btn btn-mg btn-default fg-white cls_paymodal">返回</button></div>');
        $('#pay_phone').focus();
    }

});