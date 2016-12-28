var LotteryView = Backbone.View.extend({
    el: $('#content'),
    lottery_play_types: {
        ssq: [{code: '101', name: '单式投注'}, {code: '102', name: '复式投注'}, {code: '103', name: '胆拖投注'}],
        '307': [{code: '101', name: '单式投注'}, {code: '102', name: '复式投注'}, {code: '103', name: '胆拖投注'}],
        '3d': [{code: '201', name: '直选单式'}, {code: '202', name: '组3单式'}, {code: '203', name: '组6单式'},
            {code: '204', name: '直选复式'}, {code: '205', name: '组3复选'}, {code: '206', name: '组6复选'},
            {code: '207', name: '直选包点'}, {code: '208', name: '组三包点'}, {code: '209', name: '组六包点'},
            {code: '212', name: '组选包点'}, {code: '214', name: '包号'}],
        '22x5': [{code: '101', name: '单式投注'}, {code: '102', name: '复式投注'}, {code: '103', name: '胆拖投注'},
            {code: '104', name: '好运一单式'}, {code: '105', name: '好运一复式'}, {code: '106', name: '好运二单式'},
            {code: '107', name: '好运二复式'}, {code: '108', name: '好运二胆拖'}, {code: '109', name: '好运三单式'},
            {code: '110', name: '好运三复式'}, {code: '111', name: '好运三胆拖'}, {code: '112', name: '好运四单式'},
            {code: '113', name: '好运四复式'}, {code: '114', name: '好运四胆拖'}],
        'k3': [{code: '101', name: '和值'}, {code: '102', name: '三同号通选'}, {code: '103', name: '三同号单选'},
             {code: '104', name: '二同号复选'},{code: '105', name: '二同号单选'},{code: '106', name: '三不同号'},
             {code: '107', name: '二不同号'},{code: '108', name: '三连号通选'}]
    },
    //获取彩种名称
    get_lottery_name: function (lottery) {
        if (lottery == 'ssq') {
            return '双色球'
        } else if (lottery == '307') {
            return '7乐彩';
        } else if (lottery == '3d') {
            return '3D';
        } else if (lottery == '22x5') {
            return '22选5';
        } else if (lottery == 'k3') {
            return '快三'
        }
    },
    //奖期和倒计时
    renderTime: function () {
        if (LOTTERYINFO) {
            this.timeTick();
            var that = this;
            this.interTimer = setInterval(function () {
                if (!$('#lottery_view_confirm_' + that.lotteryType) || $('#lottery_view_confirm_' + that.lotteryType).length <= 0) {
                    clearInterval(that.interTimer);
                } else {
                    if (that.lotteryType == 'k3' && $('#hx_time').text() == '本期已停') {
                        that.timeTickNext();
                    } else {
                        that.timeTick();
                    }
                }
            }, 1000);
        }
    },
    timeTick: function () {
        var now = new Date();
        var l = _.findWhere(LOTTERYINFO, {gameName: this.lotteryType});
        //console.log(l);
        $('#lcenter_round').text(l.number);
        var endTime = (new Date(l.stopTime)).getTime();
        var lag = (endTime - now.getTime()) / 1000;
        if (lag > 0 && this.lotteryType != 'k3') {
            var second = Math.floor(lag % 60);
            var minite = Math.floor((lag / 60) % 60);
            var day = Math.floor((lag / 3600) / 24);
            var hour = day * 24 + Math.floor((lag / 3600) % 24);
            $('.djsts').html("距离投注截止时间还剩");
            $('#hx_time').html(hour + '小时' + minite + '分' + second + '秒');
        } else if (lag >= 20 && this.lotteryType == 'k3') {
            lag = lag - 20;
            var second = Math.floor(lag % 60);
            var minite = Math.floor((lag / 60) % 60);
            var day = Math.floor((lag / 3600) / 24);
            var hour = day * 24 + Math.floor((lag / 3600) % 24);
            $('.djsts').html("距离投注截止时间还剩");
            $('#hx_time').html(hour + '小时' + minite + '分' + second + '秒');
        } else {
            if (this.lotteryType == 'k3') {
                var now = new Date();
                var l = _.findWhere(LOTTERYINFO, {gameName: this.lotteryType});
                $('#lcenter_round').text(l.number);
                var endTime = (new Date(l.stopTime)).getTime();
                var lag = (endTime - now.getTime()) / 1000;
                var second = Math.floor(lag % 60);
                var minite = Math.floor((lag / 60) % 60);
                var day = Math.floor((lag / 3600) / 24);
                var hour = day * 24 + Math.floor((lag / 3600) % 24);
                $('.djsts').html("<span class='fg-red'>本期已截止距离下期还有</span>");
                if (lag > 0) {
                    $('#hx_time').html(hour + '小时' + minite + '分' + second + '秒');
                } else {
                    $('#hx_time').html('0小时0分0秒');
                }
            } else {
                $('#hx_time').html('本期已停');
            }
        }
    },
    events: {
        'click #play_type_nav li': 'changeGame',
        'click #beishu_minus': 'beishu_minus',
        'click #beishu_plus': 'beishu_plus',
        'click #zhuihao_minus': 'zhuihao_minus',
        'click #zhuihao_plus': 'zhuihao_plus',
        'click #balls ul li span,#balls ul .k3-num': 'selectBall',
        //'click #add_to_cart':'add_to_cart',
        'click #cart_nav a': 'cart_nav',
        'click .remove_cart': 'remove_cart',
        'click #empty_cart': 'empty_cart',
        'click #buy_lottery': 'buy_lottery',
        'click #back': 'Backhome',
        'click .close_modal': 'closemodal',
        'click #jixuan button': 'jixuan',
        'focus #beishu': 'selectMul',
        'blur #beishu': 'inputchange',
        'click .back': 'back',
        'click .lottery-r-back':'qhelp',
        'click #Randomfull5': 'bqjixuan5'

    },
    ticket: new LotteryTicket(),
    logger: require(process.cwd() + '/js_lib/Logger.js').logger,
    initialize: function () {
        this.listenTo(tickets, 'add', this.addTicket);
        this.listenTo(tickets, 'remove', this.removeTicket);
        this.listenTo(tickets, 'reset', this.resetTickets);
        this.listenTo(this.ticket, 'invalid', this.ticketInvalid);
        this.listenTo(this.ticket, 'change', this.ticketChange);

    },
    //初始化
    inti: function (params) {
        this.lotteryType = params.lotteryType;
        var temp = _.template($('#temp_lottery').html());
        var that = this;
        $(that.el).html(temp({
            lottery_name: that.get_lottery_name(that.lotteryType),
            lottery: that.lotteryType,
            play_types: that.lottery_play_types[that.lotteryType]
        }));
        if(this.lotteryType=='k3'){

            this.empty_cart();
            this.reset_ticket();
            this.resetTickets();

        }
        if (params.detail) {
            if(this.lotteryType=='3d'){
                this.renderPlayType('201');
            }else{
                this.renderPlayType('101');
            }
            this.render_record_tickets(params.detail);
            this.is_record = true;//跟号
            this.buy_lottery();
        } else {
            that.renderPlayType(that.lottery_play_types[that.lotteryType][0].code);
        }
        tickets.each(function (item) {
            that.renderTicket(item);
        }, that);
        if (that.interTimer) {
            clearInterval(that.interTimer);
        }
        that.renderTime();
    },
    //记录里重新购买的加载选号区并把号码添加号码到购物车
    render_record_tickets: function (tks) {
        var bai, shi, ge, hao1, hao2, hao3, z3fs, z6fs, zxbd,zhxbd, z3bd, z6bd, dan, tuo,red,blue;
        var iss = _.findWhere(LOTTERYINFO, {gameName: this.lotteryType});
        var tlist = tks.lott_list;
        for (var i = 0; i < tlist.length; i++) {
            var oj = this.ticket.clone();

            oj.set({'beishu':tks.multiple,play_type_code:tks.play_type_code,play_type_name:tks.play_type_name, issue: iss.number, issue_end: iss.stopTime});
            if (this.lotteryType == 'ssq') {
                if (tlist[i].playType == '101') {
                    red = tlist[i].number.split('#')[0].toString().split(',');
                    blue = tlist[i].number.split('#')[1].toString();
                    oj.set({nums: {red: red, blue: [blue]}});
                } else if (tlist[i].playType == '102') {
                    red = tlist[i].number.split('#')[0].toString().split(',');
                    blue = tlist[i].number.split('#')[1].toString().split(',');
                    oj.set({nums: {red: red, blue: blue}});
                } else if (tlist[i].playType == '103') {
                    dan = tlist[i].number.split('$')[0].toString().split(',');
                    tuo = tlist[i].number.split('$')[1].toString().split('#')[0].toString().split(',');
                    blue = tlist[i].number.split('#')[1].toString().split(',');
                    oj.set({nums: {dan: dan, tuo: tuo, blue: blue}});
                }
            } else if (this.lotteryType == '307') {
                if (tlist[i].playType == '101') {
                    red = tlist[i].number.toString().split(',');
                    oj.set({nums: {red: red}});
                } else if (tlist[i].playType == '102') {
                    red = tlist[i].number.toString().split(',');
                    oj.set({nums: {red: red}});
                } else if (tlist[i].playType == '103') {
                    dan = tlist[i].number.split('$')[0].toString().split(',');
                    tuo = tlist[i].number.split('$')[1].toString().split(',');
                    oj.set({nums: {dan: dan, tuo: tuo}});
                }
            } else if (this.lotteryType == '3d') {
                if (tlist[i].playType == '201') {
                    bai=tlist[i].number.toString().split(',')[0];
                    shi=tlist[i].number.toString().split(',')[1];
                    ge=tlist[i].number.toString().split(',')[2];
                    oj.set({nums: {bai: bai, shi: shi,ge:ge}});
                }else  if (tlist[i].playType == '202'|| tlist[i].playType == '203') {
                    hao1=tlist[i].number.toString().split(',')[0];
                    hao2=tlist[i].number.toString().split(',')[1];
                    hao3=tlist[i].number.toString().split(',')[2];
                    oj.set({nums: {hao1: hao1, hao2: hao2,hao3:hao3}});
                }else  if (tlist[i].playType == '204') {
                    bai=tlist[i].number.toString().split(',')[0];
                    shi=tlist[i].number.toString().split(',')[1];
                    ge=tlist[i].number.toString().split(',')[2];
                    oj.set({nums: {bai: bai, shi: shi,ge:ge}});
                }else  if (tlist[i].playType == '205') {
                    z3fs=tlist[i].number.toString().split(',');
                    oj.set({nums:{z3fs:z3fs}});
                }else  if (tlist[i].playType == '206') {
                    z6fs=tlist[i].number.toString().split(',');
                    oj.set({nums:{z6fs:z6fs}});
                }else  if (tlist[i].playType == '207') {
                    zhxbd=tlist[i].number.toString().split(',');
                    oj.set({nums:{zhxbd:zhxbd}});
                }else  if (tlist[i].playType == '208') {
                    z3bd=tlist[i].number.toString().split(',');
                    oj.set({nums:{z3bd:z3bd}});
                }else  if (tlist[i].playType == '209') {
                    z6bd=tlist[i].number.toString().split(',');
                    oj.set({nums:{z6bd:z6bd}});
                }else  if (tlist[i].playType == '212') {
                    zxbd=tlist[i].number.toString().split(',');
                    oj.set({nums:{zxbd:zxbd}});
                }else  if (tlist[i].playType == '214') {
                    bai=tlist[i].number.toString().split(',')[0].toString()=='255'?undefined:tlist[i].number.toString().split(',')[0];
                    shi=tlist[i].number.toString().split(',')[1].toString()=='255'?undefined:tlist[i].number.toString().split(',')[1];
                    ge=tlist[i].number.toString().split(',')[2].toString()=='255'?undefined:tlist[i].number.toString().split(',')[2];;
                    oj.set({nums: {bai: bai, shi: shi,ge:ge}});
                }

            }else if(this.lotteryType == '22x5'){
                 if (tlist[i].playType == '108'||tlist[i].playType == '103'||tlist[i].playType == '111'||tlist[i].playType == '114') {
                     dan = tlist[i].number.split('$')[0].toString().split(',');
                     tuo = tlist[i].number.split('$')[1].toString().split(',');
                     oj.set({nums: {dan: dan, tuo: tuo}});
                 }else{
                     red=tlist[i].number.toString().split(',');
                     oj.set({nums:{red:red}});
                 }
            }else if(this.lotteryType=='k3'){
                if (tlist[i].playType == '101') {
                    red=[tlist[i].number.toString()];
                    oj.set({nums:{red:red}});
                }else  if (tlist[i].playType == '102') {
                    red=['111 222 333 444 555 666'];
                    oj.set({nums:{red:red}});
                }else  if (tlist[i].playType == '103'||tlist[i].playType == '105'||tlist[i].playType == '106') {
                    red=tlist[i].number.toString().replace(new RegExp(',+','gm'),'');
                    oj.set({nums:{red:[red]}});
                }else  if (tlist[i].playType == '107'||tlist[i].playType == '104') {
                    red=tlist[i].number.toString().replace('255','').replace(new RegExp(',+','gm'),'');
                    oj.set({nums:{red:[red]}});
                }else  if (tlist[i].playType == '108') {
                    red=['123 234 345 456'];
                    oj.set({nums:{red:red}});
                }
            }
            var money = oj.getMoney();
            oj.set({money: money}, {silent: true});
            tickets.add(oj);
        }
    },
    //号码增删改
    reset_ticket: function () {
        //重置ticket对象
        var ob = {'beishu': 1, 'zhuihao': 1, 'money': 0, 'nums': {}};
        this.ticket.set(ob);
        setTimeout(function () {
            $('#balls .on-redball').removeClass('on-redball');
        }, 100);
    },

    ticketChange: function (model, options) {
        var money = model.getMoney();
        model.set({money: money}, {silent: true});
        //自动添加到购物车中
        if (money > 0) {
            var lotname = this.get_lottery_name(this.lotteryType);
            var ptype = this.lottery_play_types[this.lotteryType];
            var p = _.findWhere(ptype, {code: this.playType});
            var txt = lotname + '-' + p.name + '玩法';
            var oj = this.ticket.clone();
            var lotype = this.lotteryType;
            var iss = _.findWhere(LOTTERYINFO, {gameName: lotype});
            if ((this.lotteryType == 'ssq' && this.playType == '101') || (this.lotteryType == '307' && this.playType == '101')
                || (this.lotteryType == '3d' && (this.playType == '201' || this.playType == '202' || this.playType == '203'))
                || (this.lotteryType == '22x5' && (this.playType == '101' || this.playType == '104' || this.playType == '106' || this.playType == '109' || this.playType == '112'))
                ||(this.lotteryType=='k3'&&(this.playType == '101' || this.playType == '103' || this.playType == '104' || this.playType == '105' || this.playType == '106' || this.playType == '107'))) { //可以最多五注

                    //if (tickets.length >= 5) {
                //    $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">' + txt + '最多一次购买5注' + '</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
                //    $('#myModal').modal('show');
                //    this.reset_ticket();
                //    return;
                //}
                setTimeout(function () {
                    oj.set({issue: iss.number, issue_end: iss.stopTime});
                    tickets.add(oj);
                }, 80);
            //}else if(this.lotteryType == 'k3'){
            //    if(this.playType == '101' || this.playType == '103' || this.playType == '104' || this.playType == '105' || this.playType == '106' || this.playType == '107'){
            //        if (tickets.length >= 5) {
            //            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">' + txt + '最多一次购买5注' + '</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            //            $('#myModal').modal('show');
            //            this.reset_ticket();
            //            return;
            //        }
            //        setTimeout(function () {
            //            oj.set({issue: iss.number, issue_end: iss.stopTime});
            //            tickets.add(oj);
            //        }, 80);
            //    }else{
            //        this.empty_cart();
            //        if (tickets.length >= 1) {
            //            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">' + txt + '最多一次购买1注' + '</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            //            $('#myModal').modal('show');
            //            this.reset_ticket();
            //            return;
            //        }
            //        setTimeout(function () {
            //            oj.set({issue: iss.number, issue_end: iss.stopTime});
            //            tickets.add(oj);
            //        }, 80);
            //    }
            } else {
                this.empty_cart();
                if (tickets.length >= 1) {
                    $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">' + txt + '最多一次购买1注' + '</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
                    $('#myModal').modal('show');
                    this.reset_ticket();
                    return;
                }
                setTimeout(function () {
                    oj.set({issue: iss.number, issue_end: iss.stopTime});
                    tickets.add(oj);
                }, 80);
            }
        }
    },

    renderTicket: function (item) {
        var tmp = _.template($('#temp_cart').html());
        if (item.get('lottery_type') == 'ssq' && item.get('play_type_code') == '101') {
            var nums = {'red': item.get('nums').red, 'blue': item.get('nums').blue};
            item.attributes.nums = nums;
        }
        var t = item.toJSON();
        t.cid = item.cid;
        t.lType = this.lotteryType;
        t.pType = this.playType;
        $('#cart_list').prepend(tmp(t));
        $('#cart_counts').text(parseInt($('#cart_counts').text()) + 1);
        $('#cart_money').text(parseInt($('#cart_money').text()) + item.get('money'));
    },

    removeTicket: function (item) {
        $('#cart_list li[cid="' + item.cid + '"]').remove();
        $('#cart_counts').text(parseInt($('#cart_counts').text()) - 1);
        $('#cart_money').text(parseInt($('#cart_money').text()) - item.get('money'));
    },
    //添加到购物车事件
    addTicket: function (item) {
        var t = $('#cart_nav a[the_href="#cart_list_' + item.get('lottery_type') + '"]');
        if (!t.hasClass('active')) {
            $('#cart_nav a.active').removeClass('active');
            t.addClass('active');
            $('#cart_list_ssq,#cart_list_3d,#cart_list_307,#cart_list_k3,#cart_list_22x5').hide();
            $('#cart_list_' + item.get('lottery_type')).show();
        }
        var yleft = $(".inside-ball").offset().left + ($(".inside-ball").width() / 2);
        var ytop = $(".inside-ball").offset().top;
        $(".on-redball").each(function (index) {
            var num = $(".on-redball").eq(index).text();
            $(".on-redball").eq(index).before("<div class='on-redball-s'>" + num + "</div>");
            var mleft = $(".on-redball-s").eq(index).offset().left;
            var mtop = $(".on-redball-s").eq(index).offset().top;
            var mar = (ytop - mtop + 60) + 'px 0 0 ' + (yleft - mleft) + 'px';
            $(".on-redball-s").eq(index).animate({margin: mar, height: "28", width: "28"}, 700, function () {
                $(".on-redball-s").remove();
            });
        });
        this.renderTicket(item);
        if ((this.lotteryType == 'k3' && (this.playType == '101' || this.playType == '105' || this.playType == '103' || this.playType == '104' || this.playType == '106' || this.playType == '107'))) {
            $('#balls .on-redball').removeClass('on-redball');
            var ob = {'beishu': 1, 'zhuihao': 1, 'money': 0, 'nums': {}};
            this.ticket.set(ob);
        }
        else if((this.lotteryType == 'ssq' && this.playType == '101') || (this.lotteryType == '307' && this.playType == '101')
            || (this.lotteryType == '3d' && (this.playType == '201' || this.playType == '202' || this.playType == '203'))
            || (this.lotteryType == '22x5' && (this.playType == '101' || this.playType == '104' || this.playType == '106' || this.playType == '109' || this.playType == '112'))
            ||this.lotteryType=='k3'){
            $('#balls .on-redball').removeClass('on-redball');
            var ob = {'beishu': 1, 'zhuihao': 1, 'money': 0, 'nums': {}};
            this.ticket.set(ob);
            $('#balls .on-redball').removeClass('on-redball');
        }
    },
    remove_cart: function (e) {
        var cid = $(e.currentTarget).attr('cid');
        tickets.remove(cid);
    },

    //倍数增减和更新
    beishu_minus: function (e) {
        var t = parseInt($('#beishu').val()) - 1;
        if (t > 0 && t < 100) {
            this.beishu_renew(t);
        }
    },
    // 根据彩种玩法布局
    selectMul: function (e) {
        $(e.currentTarget).numberKeyboard();
        if(this.lotteryType=='ssq'||this.lotteryType=='k3'
            ||(this.lotteryType=='3d'&&(this.playType=='207'||this.playType=='208'||this.playType=='209'||this.playType=='212'||this.playType=='214'))
            ||(this.lotteryType=='307'&&this.playType=='103')){
            var top =  $(e.currentTarget).attr('top') ?  $(e.currentTarget).attr('top')  - 0 : -310;
            var of=$(e.currentTarget).offset();
            $('#numkeyboard').css({top:of.top+top});
        }
        $("#beishu").on("click",function(){
            var input = document.getElementById("beishu"),val = input.value;
            var click_position = getPosition(input);

            var start = val.lastIndexOf(" ",click_position);
            if(start == -1) start = 0;
            var end = val.indexOf(" ",click_position);
            if(end == -1) end = val.length;

            setSelection(input,start,end);
        });

        function setSelection(input, startPos, endPos) {
            input.focus();
            if (typeof input.selectionStart != "undefined") {
                input.selectionStart = startPos;
                input.selectionEnd = endPos;
            } else if (document.selection && document.selection.createRange) {
                input.select();
                var range = document.selection.createRange();
                range.collapse(true);
                range.moveEnd("character", endPos);
                range.moveStart("character", startPos);
                range.select();
            }
        }
        function getPosition (input) {
            var pos = 0;
            if (document.selection) {
                input.focus ();
                var selection = document.selection.createRange ();
                selection.moveStart ('character', -input.value.length);
                pos = selection.text.length;
            }
            else if (input.selectionStart || input.selectionStart == '0')
                pos = input.selectionStart;
            return pos;
        }

    },
    inputchange: function () {
        var t = parseInt($('#beishu').val());
        if (t < 1 || t == "") {
            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">当前投注倍数不能为空且最少选择1倍</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            $('#myModal').modal('show');
            $('#beishu').val('1');
            return;
        } else if (t > 100) {
            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">当前投注倍数最多支持99倍</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            $('#myModal').modal('show');
            $('#beishu').val('1');
            return;
        }
        if (t < 100 && t > 0) {
            this.beishu_renew(t);
        }
    },
    beishu_plus: function (e) {
        var t = parseInt($('#beishu').val()) + 1;
        if (t < 100) {
            this.beishu_renew(t);
        }
    },
    beishu_renew: function (beishu) {
        //$('#beishu').text(beishu);
        $('#beishu').val(beishu);
        $('#cart_counts,#cart_money').text('0');
        $('#cart_list').empty();
        tickets.each(function (tk, i) {
            tk.set({'beishu': beishu});
            tk.set({money: tk.getMoney()});
            this.renderTicket(tk);
        }, this);
    },
    //清空购物车
    resetTickets: function () {
        $('#cart_counts,#cart_money').text('0');
        $('#cart_list').empty();
        $('#beishu').val(1);
    },
    empty_cart: function () {
        tickets.reset();
    },
    showaccount: function () {
        var info = {
            lotteryType: '',
            payType: 'account',
            info: {money: ''}
        }
        pay_view.inti(info);
    },
    showregister: function () {
        var info = {
            lotteryType: '',
            payType: 'register',
            info: {money: ''}
        }
        pay_view.inti(info);
    },
    //注码格式验证
    ticketInvalid: function (model, error) {
        $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">' + error + '</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
        $('#myModal').modal('show');
    },
    cart_nav: function (e) {
        var t = $(e.currentTarget);
        if (t.hasClass('active')) {
            return;
        } else {
            $('#cart_nav .active').removeClass('active');
            t.addClass('active');
            $('#cart_list_ssq,#cart_list_3d,#cart_list_307,#cart_list_22x5,#cart_list_k3').hide();
            $($(e.currentTarget).attr('the_href')).show();
        }
    },

    //根据playType，来展示选号区
    renderPlayType: function (playType) {
        this.playType = playType;
        logger.info('==============renderPlayType=======', this.lotteryType, playType);
        if ((this.lotteryType == 'ssq' && playType == '101') || (this.lotteryType == '307' && playType == '101')
            || (this.lotteryType == '3d' && (playType == '201' || playType == '202' || playType == '203' ))
            || (this.lotteryType == '22x5' && (playType == '101' || playType == '104' || playType == '106' || playType == '109' || playType == '112'))
        ) {
            $('#jixuan').empty();
            $('#jixuan').append('<button id="random5" class="btn btn-inverse fg-white"  num="5" data-loading-text="生成中">机选五注</button><button id="Randomfull5" class="btn btn-inverse fg-white margin-L10"  num="f5" data-loading-text="生成中">补全五注</button>');
            $('#jixuan').show();
            $('#jx_label').text('机选');
            $('#jx_label2').text('自动生成注码');
        } else if (this.lotteryType == 'ssq' && playType == '102') {
            $('#jixuan').empty();
            $('#jixuan').append('<div><button id="random71" class="btn btn-inverse fg-white" num="1" data-loading-text="生成中">机选7+1</button><button id="random72"  class="btn btn-inverse fg-white margin-L10 " num="1" data-loading-text="生成中">机选7+2</button></div><div class="margin_t15"><button id="random81" class="btn btn-inverse fg-white" num="1" data-loading-text="生成中">机选8+1</button><button id="random82" class="btn btn-inverse fg-white margin-L10"  num="1" data-loading-text="生成中">机选8+2</button></div>');
            $('#jixuan').show();
            $('#jx_label').text('机选');
            $('#jx_label2').text('自动生成注码');
        } else {
            $('#jixuan').hide();
            $('#jx_label').text('倍投');
            $('#jx_label2').text('加倍投注选号');
        }
        if (this.lotteryType != 'k3') {
            $("#zone_jx_labels").show();
            $("#zone_jx_btns").show();
            //隐藏规则信息
            $("#rule").hide();
        } else {
            //显示规则信息
            $("#rule").show();
            var dic_rule = {
                "1": "对三个号码的和值进行投注，与开奖号和值相同，即中奖（奖金范围：9~240元）",
                "2": "对所有相同的三个号码（111、222、…、666）进行全包投注，与开奖号相同，即中奖（单注奖金固定40元）",
                "3": "从所有相同的三个号码（111、…、666）中任意选择一组号码进行投注，与开奖号相同，即中奖（单注奖金固定240元）",
                "4": "当期开奖号码中有两个号码相同，且投注号码中的两个相同号码与当期开奖号码中两个相同号码相符，即中奖（单注奖金固定15元）",
                "5": "当期开奖号码中有两个号码相同，且投注号码与当期开奖号码中两个相同号码和一个不同号码分别相符，即中奖（单注奖金固定80元）",
                "6": "当期开奖号码的三个号码各不相同，且投注号码与当期开奖号码全部相符，即中奖（单注奖金固定40元）",
                "7": "当期开奖号码中有两个号码不相同，且投注号码中的两个不同号码与当期开奖号码中的两个不同号码相符，即中奖（单注奖金固定8元）",
                "8": "当期开奖号码为三个相连的号码(仅限：123、234、345、456)，即中奖（单注奖金固定10元）"
            };
            var theType = playType.substr(-1, 1);
            $("#rule_content").text(dic_rule[theType]);
            this.shownote();
        }
        var tg = $('#temp_lottery_' + this.lotteryType + '_' + playType).length == 1 ? $('#temp_lottery_' + this.lotteryType + '_' + playType) : $('#temp_lottery_' + this.lotteryType);
        $('#balls').html(tg.html());
        var pname = _.find(this.lottery_play_types[this.lotteryType], function (item) {
            return item.code == this.playType
        }, this).name;
        var ob = {
            lottery_type: this.lotteryType,
            lottery_name: this.get_lottery_name(this.lotteryType),
            'play_type_code': playType,
            'play_type_name': pname,
            'beishu': 1,
            'zhuihao': 1,
            'money': 0,
            'issue': '',
            'nums': {}
        };
        this.ticket.set(ob);
        if(this.lotteryType=="ssq"||this.lotteryType=="307"){
            if(this.playType=="102"||this.playType=="103"){
                this.empty_cart();
                this.reset_ticket();
                this.resetTickets();
            }
        }
        if(this.lotteryType=="3d"){
            if(this.playType == '204'|| this.playType == '205'|| this.playType == '206'
                ||this.playType == '207'|| this.playType == '209'|| this.playType == '208'
                ||this.playType=="212"||this.playType=="214"){
                this.empty_cart();
                this.reset_ticket();
                this.resetTickets();
            }
        }
        if((this.lotteryType == '22x5' && (this.playType == '102' || this.playType == '103' || this.playType == '105'
            || this.playType == '107' || this.playType == '108'|| this.playType == '110' || this.playType == '111'
            ||this.playType=="113"||this.playType=="114"))){
            this.empty_cart();
            this.reset_ticket();
            this.resetTickets();
        }
        if(this.lotteryType=="k3"&&(this.playType=='102'||this.playType=='108')){
            this.empty_cart();
            this.reset_ticket();
            this.resetTickets();
        }
        this.shownote();
    },
    shownote: function () {
        $('#select_notes p').stop();
        var randomColor = "#ffffff";
        setInterval(function () {
            $('#show_notes p').animate({}, 250, 'linear', function () {
                randomColor = getRandomColor();
                $('#show_notes p').css({color: randomColor});
            });
            if (K3KJINFO) {
                $('.issue_num').text(K3KJINFO[0].qihao);
                $('.kjhao').text(K3KJINFO[0].res);
            }

        }, 1000);

        var getRandomColor = function () {
            var colors = ['#EE0000', '#EE8220', '#FF8C00', '#9F79EE', '#32CD32', '#36648B', '#00CED1'];
            return colors[parseInt(Math.random() * colors.length)];
        }

    },
    getk3kjhm: function () {
        lotteryQuery.getKaiJiangByLottery('k3', function (err, res) {
            K3KJINFO = res;
            if (K3KJINFO) {
                $('.issue_num').text(K3KJINFO[0].qihao);
                $('.kjhao').text(K3KJINFO[0].res);
            }
        });
    },
    changeGame: function (e) {
        if ($(e.currentTarget).hasClass('active')) {
            return;
        }
        var play_type = $(e.currentTarget).data('playtype').toString();
        $('#play_type_nav li.active').removeClass('active').addClass('stick');
        $(e.currentTarget).addClass('active');
        if(this.lotteryType=="ssq"&&(this.playType=="102"||this.playType=="103")||this.lotteryType=="307"&&(this.playType=="102"||this.playType=="103")
            ||this.lotteryType=='3d'&&(this.playType=="204"||this.playType=="205"||this.playType=="206"||this.playType=="207"||this.playType=="208"
            ||this.playType=="209"||this.playType=="210"||this.playType=="211"||this.playType=="212"||this.playType=="214")
            ||this.lotteryType=="22x5"&&(this.playType=="107"||this.playType=="102"||this.playType=="103"||this.playType=="105"||this.playType=="107"||this.playType=="108"||this.playType=="110"||this.playType=="111"||this.playType=="113"||this.playType=="114")
            ||(this.lotteryType=='k3'&&(this.playType=="108"||this.playType=="102"))){
            this.empty_cart();
            this.reset_ticket();
            this.resetTickets();
        }

        this.renderPlayType(play_type);
    },
    clone: function (obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;
        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    },
    selectBall: function (e) {
        if (!LOTTERYINFO) {
            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">现在还没有获得期次信息，请稍后</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            $('#myModal').modal('show');
            return;
        }
        var tg = $(e.currentTarget);
        var tg1 = $(tg.children('dfn'));
        if (this.ticket.attributes.lottery_type == 'k3') {
            var balltype = tg1.parent().parent().attr('balltype');
        } else {
            balltype = tg.parent().parent().attr('balltype');
        }
        var p = this.ticket.toJSON();
        var nums = this.clone(p.nums);

        if (!nums[balltype]) {
            nums[balltype] = [];
        }
        var herenums = nums[balltype];
        if (tg.hasClass('on-redball')) {
            var dind = _.indexOf(herenums, tg.text());
            herenums.splice(dind, 1);
        } else { //添加num，并排序
            if (this.ticket.attributes.lottery_type == 'k3') {
                herenums.push(tg1.text());
            } else {
                herenums.push(tg.text());
                herenums.sort();
            }
        }

        var vli = this.ticket.set({'nums': nums, 'beishu': parseInt($('#beishu').val())}, {validate: true});
        if (!vli) {
        } else {
            tg.toggleClass('on-redball');
        }
    },
    buy_lottery: function (e) {
        if ($('#hx_time').text() == '本期已停' || $('.djsts .fg-red').text() == "本期已截止距离下期还有") {
            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">当前期次已经停止购买，请等待下一期！</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            $('#myModal').modal('show');
            return;
        }
        if (tickets.length > 0) {
            var m_m = 0;
            var lt = '';
            tickets.each(function (item) {
                lt = item.get('lottery_type');
                m_m += item.get('money');
            });
            var info = {lotteryType: lt, payType: 'lottery', info: {money: m_m},is_record:this.is_record};
            logger.info('=====buy_lottery===', JSON.stringify(info));
            pay_view.inti(info);
        } else {
            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">您的购物车当前为空！</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            $('#myModal').modal('show');
        }
    },

    //机选
    jixuan: function (e) {
        if (!LOTTERYINFO) {
            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">现在还没有获得期次信息，请稍后</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            $('#myModal').modal('show');
            return;
        }
        var btn = $(e.currentTarget);
        if (btn.hasClass('disabled')) {
            return;
        }
        btn.button('loading');
        var count = parseInt(btn.attr('num'));
        var id = btn.attr('id');
        //if (tickets.length + count > 5) {
        //    this.empty_cart();
        //    this.reset_ticket();
        //    this.randomFive();
        //    btn.button('reset');
            //return;
        //}
        var that = this;
        if ($('#balls .on-redball').length > 0) {
            this.ticket.set({nums: {}});
            $('#balls .on-redball').removeClass('on-redball');
            setTimeout(function () {
                if (count == 1 && id == 'random71') {
                    that.random71()
                } else if (count == 1 && id == 'random81') {
                    that.random81();
                } else if (count == 1 && id == 'random72') {
                    that.random72();
                } else if (count == 1 && id == 'random82') {
                    that.random82();
                } else if (count == 5) {
                    that.randomFive();
                }
            }, 400);
        } else {
            if (count == 1 && id == 'random71') {
                that.random71();
            } else if (count == 1 && id == 'random81') {
                that.random81();
            } else if (count == 1 && id == 'random72') {
                that.random72();
            } else if (count == 1 && id == 'random82') {
                that.random82();
            } else if (count == 5) {
                that.randomFive();
            }
        }
        btn.button('reset');
    },
    bqjixuan5: function () {
        this.speaker('select');
        var count = $('#cart_list').children().length;
        var lotype = this.lotteryType;
        var iss = _.findWhere(LOTTERYINFO, {gameName: lotype});
        var bs = parseInt($('#beishu').val());
        if (bs > 99 || !bs || bs == '') {
            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">当前投注倍数不能为空且最多支持99倍</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            $('#myModal').modal('show');
            return;
        }
        for (var c = 0; c < 5 - count; c++) {
            var oj = this.ticket.clone();
            oj.set({'beishu': bs, issue: iss.number, issue_end: iss.stopTime});
            if (this.lotteryType == 'ssq' && this.playType == '101') {
                var balls = this.getRandomBalls(6, 1, 33);
                var ballBlue = this.getRandomBalls(1, 1, 16);
                var nums = {red: this.getBallStr(balls), blue: this.getBallStr(ballBlue)};
                oj.set({'nums': nums});
            } else if (this.lotteryType == '307' && this.playType == '101') {
                var balls = this.getRandomBalls(7, 1, 30);
                var nums = {red: this.getBallStr(balls)};
                oj.set({'nums': nums});
            } else if (this.lotteryType == '3d' && this.playType == '201') {
                var b1 = this.getRandomBalls(1, 0, 9);
                var b2 = this.getRandomBalls(1, 0, 9);
                var b3 = this.getRandomBalls(1, 0, 9);
                oj.set({nums: {bai: [b1], shi: [b2], ge: [b3]}});
            } else if (this.lotteryType == '3d' && this.playType == '202') {
                var b1 = this.getRandomBalls(1, 0, 9);
                var b2 = this.getRandomBalls(1, 0, 9);
                oj.set({nums: {hao1: [b1], hao2: [b1], hao3: [b2]}});
            } else if (this.lotteryType == '3d' && this.playType == '203') {
                var balls = this.getRandomBalls(3, 0, 9);
                var b1 = [balls[0]];
                var b2 = [balls[1]];
                var b3 = [balls[2]];
                oj.set({nums: {hao1: [b1], hao2: [b2], hao3: [b3]}});
            } else if (this.lotteryType == '22x5') {
                var ball_count = this.playType == '101' ? 5 : this.playType == '104' ? 1 : this.playType == '106' ? 2 : this.playType == '109' ? 3 : 4;
                var balls = this.getRandomBalls(ball_count, 1, 22);
                oj.set({nums: {red: this.getBallStr(balls)}});
            } else if (this.lotteryType == 'k3') {
                var b = this.getRandomBalls(1, 4, 17);
                oj.set({nums: {red: this.getBallStr(b)}})
            }
            var money = oj.getMoney();
            oj.set({money: money}, {silent: true});
            tickets.add(oj);
        }
    },
    random71: function () {
        this.empty_cart();
        function c_span(balltype, balls, index) {
            if (balls.length > index) {
                $('#balls [balltype="' + balltype + '"]').find('span:eq(' + (balls[index] - 1) + ')').click();
                setTimeout(function () {
                    c_span(balltype, balls, index + 1);
                }, 100);
            }
        }

        if (this.lotteryType == 'ssq' && this.playType == '102') {
            var balls = this.getRandomBalls(7, 1, 33);
            c_span('red', balls, 0);
            var ballBlue = this.getRandomBalls(1, 1, 16);
            setTimeout(function () {
                c_span('blue', ballBlue, 0);
            }, 6 * 100);
        }
    },
    random81: function () {
        this.empty_cart();
        function c_span(balltype, balls, index) {
            if (balls.length > index) {
                $('#balls [balltype="' + balltype + '"]').find('span:eq(' + (balls[index] - 1) + ')').click();
                setTimeout(function () {
                    c_span(balltype, balls, index + 1);
                }, 100);
            }
        }

        if (this.lotteryType == 'ssq' && this.playType == '102') {
            var balls = this.getRandomBalls(8, 1, 33);
            c_span('red', balls, 0);
            var ballBlue = this.getRandomBalls(1, 1, 16);
            setTimeout(function () {
                c_span('blue', ballBlue, 0);
            }, 6 * 100);
        }
    },
    random72: function () {
        this.empty_cart();
        var lotype = this.lotteryType;
        var iss = _.findWhere(LOTTERYINFO, {gameName: lotype});
        var bs = parseInt($('#beishu').val());
        if (bs > 99 || !bs || bs == '') {
            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">当前投注倍数不能为空且最多支持99倍</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            $('#myModal').modal('show');
            return;
        }
        var oj = this.ticket.clone();
        oj.set({'beishu': bs, issue: iss.number, issue_end: iss.stopTime});
        if (this.lotteryType == 'ssq' && this.playType == '102') {
            var balls = this.getRandomBalls(7, 1, 33);
            var ballBlue = this.getRandomBalls(2, 1, 16);
            var nums = {red: this.getBallStr(balls), blue: this.getBallStr(ballBlue)};
            oj.set({'nums': nums});
        }
        var money = oj.getMoney();
        oj.set({money: money}, {silent: true});
        tickets.add(oj);

    },
    random82: function () {
        this.empty_cart();
        var lotype = this.lotteryType;
        var iss = _.findWhere(LOTTERYINFO, {gameName: lotype});
        var bs = parseInt($('#beishu').val());
        if (bs > 99 || !bs || bs == '') {
            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">当前投注倍数不能为空且最多支持99倍</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            $('#myModal').modal('show');
            return;
        }
        var oj = this.ticket.clone();
        oj.set({'beishu': bs, issue: iss.number, issue_end: iss.stopTime});
        if (this.lotteryType == 'ssq' && this.playType == '102') {
            var balls = this.getRandomBalls(8, 1, 33);
            var ballBlue = this.getRandomBalls(2, 1, 16);
            var nums = {red: this.getBallStr(balls), blue: this.getBallStr(ballBlue)};
            oj.set({'nums': nums});
        }
        var money = oj.getMoney();
        oj.set({money: money}, {silent: true});
        tickets.add(oj);
    },
    randomOne: function () {
        function c_span(balltype, balls, index) {
            if (balls.length > index) {
                $('#balls [balltype="' + balltype + '"]').find('span:eq(' + (balls[index] - 1) + ')').click();
                setTimeout(function () {
                    c_span(balltype, balls, index + 1);
                }, 100);
            }
        }

        if (this.lotteryType == 'ssq' && this.playType == '101') {
            var balls = this.getRandomBalls(6, 1, 33);
            c_span('red', balls, 0);
            var ballBlue = this.getRandomBalls(1, 1, 16);
            setTimeout(function () {
                c_span('blue', ballBlue, 0);
            }, 6 * 100);
        } else if (this.lotteryType == '307' && this.playType == '101') {
            var balls = this.getRandomBalls(7, 1, 30);
            c_span('red', balls, 0);
        } else if (this.lotteryType == '3d' && this.playType == '201') {
            var b1 = this.getRandomBalls(1, 0, 9);
            c_span('bai', b1, 0);
            var b2 = this.getRandomBalls(1, 0, 9);
            setTimeout(function () {
                c_span('shi', b2, 0);
            }, 100);
            var b3 = this.getRandomBalls(1, 0, 9);
            setTimeout(function () {
                c_span('ge', b3, 0);
            }, 2 * 100);
        } else if (this.lotteryType == '3d' && this.playType == '202') {
            var b1 = this.getRandomBalls(1, 0, 9);
            c_span('hao1', b1, 0);
            setTimeout(function () {
                c_span('hao2', b1, 0);
            }, 100);
            var b2 = this.getRandomBalls(1, 0, 9);
            setTimeout(function () {
                c_span('hao3', b2, 0);
            }, 100);
        } else if (this.lotteryType == '3d' && this.playType == '203') {
            var balls = this.getRandomBalls(3, 0, 9);
            var b1 = [balls[0]];
            var b2 = [balls[1]];
            var b3 = [balls[2]];
            c_span('hao1', b1, 0);
            setTimeout(function () {
                c_span('hao2', b2, 0);
            }, 100);
            setTimeout(function () {
                c_span('hao3', b3, 0);
            }, 100);
        } else if (this.lotteryType == '22x5') {
            var ball_count = this.playType == '101' ? 5 : this.playType == '104' ? 1 : this.playType == '106' ? 2 : this.playType == '109' ? 3 : 4;
            var balls = this.getRandomBalls(ball_count, 1, 22);
            c_span('red', balls, 0);
        }
    },
    randomFive: function () {
        this.speaker('select');
        var lotype = this.lotteryType;
        var iss = _.findWhere(LOTTERYINFO, {gameName: lotype});
        var bs = parseInt($('#beishu').val());
        if (bs > 99 || !bs || bs == '') {
            $("#myModal .modal-content").html('<div class="pop-all text-center"><div class="jycl-h2">当前投注倍数不能为空且最多支持99倍</div><div class="pop-button text-center"><button class="btn btn-mg btn-inverse fg-white close_modal">确 定</button></div></div>');
            $('#myModal').modal('show');
            return;
        }
        for (var c = 0; c < 5; c++) {
            var oj = this.ticket.clone();
            oj.set({'beishu': bs, issue: iss.number, issue_end: iss.stopTime});
            if (this.lotteryType == 'ssq' && this.playType == '101') {
                var balls = this.getRandomBalls(6, 1, 33);
                var ballBlue = this.getRandomBalls(1, 1, 16);
                var nums = {red: this.getBallStr(balls), blue: this.getBallStr(ballBlue)};
                oj.set({'nums': nums});
            } else if (this.lotteryType == '307' && this.playType == '101') {
                var balls = this.getRandomBalls(7, 1, 30);
                var nums = {red: this.getBallStr(balls)};
                oj.set({'nums': nums});
            } else if (this.lotteryType == '3d' && this.playType == '201') {
                var b1 = this.getRandomBalls(1, 0, 9);
                var b2 = this.getRandomBalls(1, 0, 9);
                var b3 = this.getRandomBalls(1, 0, 9);
                oj.set({nums: {bai: [b1], shi: [b2], ge: [b3]}});
            } else if (this.lotteryType == '3d' && this.playType == '202') {
                var b1 = this.getRandomBalls(1, 0, 9);
                var b2 = this.getRandomBalls(1, 0, 9);
                oj.set({nums: {hao1: [b1], hao2: [b1], hao3: [b2]}});
            } else if (this.lotteryType == '3d' && this.playType == '203') {
                var balls = this.getRandomBalls(3, 0, 9);
                var b1 = [balls[0]];
                var b2 = [balls[1]];
                var b3 = [balls[2]];
                oj.set({nums: {hao1: [b1], hao2: [b2], hao3: [b3]}});
            } else if (this.lotteryType == '22x5') {
                var ball_count = this.playType == '101' ? 5 : this.playType == '104' ? 1 : this.playType == '106' ? 2 : this.playType=='109'?3:4;
                var balls = this.getRandomBalls(ball_count, 1, 22);
                oj.set({nums: {red: this.getBallStr(balls)}});
            } else if (this.lotteryType == 'k3') {
                var b = this.getRandomBalls(1, 4, 17);
                oj.set({nums: {red: this.getBallStr(b)}})
            }
            var money = oj.getMoney();
            oj.set({money: money}, {silent: true});
            tickets.add(oj);
        }
    },
    getBallStr: function (ball_int) {
        var ar = [];
        for (var i = 0; i < ball_int.length; i++) {
            ar.push(ball_int[i] < 10 ? ('0' + ball_int[i].toString()) : ball_int[i].toString());
        }
        return ar;
    },
    getRandomBalls: function (count, min, max) {
        var ar = [];
        for (var i = 0; i < count; i++) {
            var b = this.random(min, max);
            if (ar.indexOf(b) >= 0) {
                count++;
            } else {
                ar.push(b);
            }
        }
        ar.sort(function (a, b) {
            return a - b;
        });
        return ar;
    },
    random: function (min, max) {
        var r = Math.floor(Math.random() * (max - min) + min) || 1;
        return r > max ? max : r;
    },
    //
    back: function () {
        $('#paymodal').modal('hide');
    },
    qhelp: function () {
        if(this.lotteryType=="ssq"||this.lotteryType=="307"){
            if(this.playType=="102"||this.playType=="103"){
                this.empty_cart();
                this.reset_ticket();
                this.resetTickets();
            }
        }
        if(this.lotteryType=="3d"){
            if(this.playType == '204'|| this.playType == '205'|| this.playType == '206'
                ||this.playType == '207'|| this.playType == '209'|| this.playType == '208'
                ||this.playType=="212"||this.playType=="214"){
                this.empty_cart();
                this.reset_ticket();
                this.resetTickets();
            }
        }
        if((this.lotteryType == '22x5' && (this.playType == '102' || this.playType == '103' || this.playType == '105'
            || this.playType == '107' || this.playType == '108'|| this.playType == '110' || this.playType == '111'
            ||this.playType=="113"||this.playType=="114"))){
            this.empty_cart();
            this.reset_ticket();
            this.resetTickets();
        }
        if(this.lotteryType=="k3"){
            this.empty_cart();
            this.reset_ticket();
            this.resetTickets();
        }
    },
    Backhome: function () {
        window.location.href="#home";
    },
    closemodal: function () {
        $('#myModal').modal('hide');
    },
    speaker: function (key) {
        var exec = require('child_process').exec;
        var speakerPath = process.execPath.substr(0, process.execPath.lastIndexOf('\\') + 1);
        exec('Speaker.exe ' + key, {cwd: speakerPath}, function (err, stdout, stdrr) {
            //console.log(speakerPath,err,stdout,stdrr);
        });
    }
});
