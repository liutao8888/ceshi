var HomeView = Backbone.View.extend({
    el: $('#content'),
    rendTime: function () {
        var now = new Date();
        var n_hour = now.getHours();
        var n_minut = now.getMinutes();
        var n_sec = now.getSeconds();
        var day = now.getDay();
        var n_day;
        if (day == 0) {
            n_day = '星期日';
        } else if (day == 1) {
            n_day = '星期一';
        } else if (day == 2) {
            n_day = '星期二';
        } else if (day == 3) {
            n_day = '星期三';
        } else if (day == 4) {
            n_day = '星期四';
        } else if (day == 5) {
            n_day = '星期五';
        } else if (day == 6) {
            n_day = '星期六';
        }
        $('#hm_day').text(n_day);
        var year_m = now.getFullYear().toString() + '-';
        year_m += ( (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1 ) + '-';
        year_m += now.getDate() < 10 ? ('0' + now.getDate() ) : now.getDate()
        $('#hm_date').text(year_m);
        var h_time = (n_hour < 10 ? ('0' + n_hour) : n_hour).toString() + ":";
        h_time += (n_minut < 10 ? ('0' + n_minut) : n_minut).toString() + ':';
        h_time += (n_sec < 10 ? ('0' + n_sec) : n_sec);
        $('#hm_time').text(h_time);
    },
    inti: function () {
        var isk3Version=process.env.xx_isk3||0;
        if (this.interV) {
            clearInterval(this.interV);
        }
        if (this.interVjrkj) {
            clearInterval(this.interVjrkj);
        }
        $(this.el).html($('#temp_home').html());

        //$('.winindex-login-status').hide();
        if(isk3Version==0){
            $('#isk3visible').addClass('hidden');
        }


        if(window.sessionStorage&&sessionStorage.getItem("userInfo")){
            $(".winindex-login-status").show();
            var u=sessionStorage.getItem("userInfo");
            var showname=JSON.parse(u).id.substring(0,3)+"****"+JSON.parse(u).id.substr(7);
            $(".uname").text(showname);
        }else{
            $(".winindex-login-status").hide();
        }
        this.renewJrkj();
        var that = this;
        if (LOTTERYINFO) {
            this.rendTime();
        } else {
            lotteryQuery.getAward('', function (err, infos) {
                if (err) {
                    $('#home_error').text('现在网络可能不稳定');
                } else {
                    $('#home_error').empty();
                    LOTTERYINFO = infos;
                    that.rendTime();
                }
            });
        }
        this.interV = setInterval(function () {
            if (!$('#home_interval') || $('#home_interval').length == 0) {
                clearInterval(that.interV);
            } else {
                that.rendTime();
            }
        }, 1000);
        this.interVjrkj = setInterval(function () {
            that.renewJrkj();
        }, 1000 * 60 * 30);

        $('#home_notes p').stop();
        var reverse = false;
        var total = 1000;
        var piece = 20;
        var road = -50;
        var randomColor = "#444444";
        var show_notes = function () {
            if ($('#home_interval') && $('#home_interval').length > 0) {
                $('#home_notes p').animate({
                    left: road + 'px'
                }, 250, 'linear', function () {
                    road += piece;
                    randomColor = getRandomColor();
                    $('#home_notes p').css({color: randomColor});
                    if (road > total) {
                        road = -500;
                        $('#home_notes p').css({left: '-850px'});
                    }
                    show_notes();
                });
            }
        }
        var show_ggnotes = function () {
            if ($('#home_interval') && $('#home_interval').length > 0) {
                $('#home_gg p').animate({
                    left: road + 'px'
                }, 250, 'linear', function () {
                    road += piece;
                    randomColor = getRandomColor();
                    $('#home_gg p').css({color: randomColor});
                    if (road > total) {
                        road = -500;
                        $('#home_gg p').css({left: '-850px'});
                    }
                    show_ggnotes();
                });
            }
        }
        var getRandomColor = function () {
            var colors = ['#EE0000', '#EE8220', '#FF8C00', '#9F79EE', '#32CD32', '#36648B', '#00CED1'];
            return colors[parseInt(Math.random() * colors.length)];
        }
        var fs = require('fs');
        var that = this;
        fs.readFile(process.execPath.substr(0, process.execPath.lastIndexOf('\\') + 1) + '\\setting.txt', function (err, data) {
            if (!err && data) {
                //console.log("-------", data.toString());
                home_note_status = data.toString();
                if (home_note_status == 0 && isk3Version!=0) {
                    show_notes();
                    that.getk3kjhm();
                }
            }
        });


        setInterval(function () {
            if (K3KJINFO) {
                $('.issue_num').text(K3KJINFO[0].qihao);
                $('.kjhao').text(K3KJINFO[0].res);
            }
        }, 3000);
        show_ggnotes();
        that.getnotice();
    },
    getnotice: function () {
        lotteryQuery.getnotice(function (err,res) {
            if(res){
                console.log(JSON.parse(res)[0].content);
                $('.gginfo').text(JSON.parse(res)[0].content);
            }
        })
    },
    getk3kjhm: function () {
        lotteryQuery.getKaiJiangByLottery('k3', function (err, res) {
            //console.log(res);
            K3KJINFO = res;
            if (K3KJINFO) {
                $('.issue_num').text(K3KJINFO[0].qihao);
                $('.kjhao').text(K3KJINFO[0].res);
            }
        });
    },
    events: {
        'click .chayu_duka,#chayu': 'chayu',
        'click #cy_back': 'cy_back',
        'click #sy_cancel': 'sy_cancel',
        'click #miss_model': 'miss_model',
        'click #force_return_card': 'force_return_card',
        'click #force_sub': 'force_sub',
        'click .updating': 'updating',
        'click #upating_close': 'upating_close',
        'click #account': 'showaccount',
        'click #logut':'dengchu',
        'click #clearuser':'clearuser',
//      'click #printAgain': 'printAgain'
    },

    //彩宝账户登录
    showaccount: function () {
        var info = {payType: 'account', info: {money: ''}};
        pay_view.inti(info);
    },
    dengchu: function () {
        $('#cxmodal .modal-content').html('<div class="pop-all text-center"><div class="jycl-h2">您即将注销登录，即将清空您的登录信息，确定退出</div><div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white" id="clearuser">确定</button><button class="btn btn-mg btn-default fg-white" id="sy_cancel">取消</button></div></div>');
        $('#cxmodal').modal({
            backdrop: 'static',
            show: true
        });
    },
    clearuser: function () {
        if(window.sessionStorage){
            sessionStorage.clear();
        }
        $('#cxmodal').modal("hide");
        $('.winindex-login-status').hide();

        //window.location.href="#home";
    },

    renewJrkj: function () {
        var day = (new Date()).getDay();
        if (day == 0 || day == 2 || day == 4) {
            $('.jrkj:eq(0)').show();
        } else {
            $('.jrkj:eq(0)').hide();
        }
        if (day == 1 || day == 3 || day == 5) {
            $('.jrkj:eq(2)').show();
        } else {
            $('.jrkj:eq(2)').hide();
        }
    },

    miss_model: function () {
        $('#return_card_modal').modal('hide');
    },
    force_return_card: function (e) {
        $('#return_card_modal').modal('show');
    },
    force_sub: function (e) {
     this.dukaqi.force_return_card();

    },
    

    dukaqi: require(process.cwd() + '/js_lib/DuKaQiHandler.js'),
    jianpan: require(process.cwd() + '/js_lib/JianPanHandler.js'),
    yinlian: require(process.cwd() + '/js_lib/hardware/YinLian0.js'),
    cy_back: function () {
        $('#cxmodal').modal('hide');
        this.yinlian.returnCard();
    },
    sy_cancel: function (e) {
        $('#cxmodal').modal('hide');
        this.yinlian.returnCard();
    },
    speaker: function (key) {
        var exec = require('child_process').exec;
        var speakerPath = process.execPath.substr(0, process.execPath.lastIndexOf('\\') + 1);
        exec('Speaker.exe ' + key, {cwd: speakerPath}, function (err, stdout, stdrr) {
            //console.log(speakerPath,err,stdout,stdrr);
        });
    },
    chayu: function (e) {
        $('#cxmodal .modal-content').html('<div class="pop-all text-center"><div class="jycl-h2">您正在进行余额查询服务，设备初始化中请稍后</div><div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white" id="sy_cancel">取消</button></div></div>');
        $('#cxmodal').modal({
            backdrop: 'static',
            show: true
        });
        ;
        var that = this;
        setTimeout(function () {
            that.chayu_func();
        }, 100);
    },
    chayu_func: function () {
        var that = this;
        this.dukaqi['read_card_chayu'](
            function () {
                that.speaker('chaka');
                $('#cxmodal .modal-content').html('<div class="pop-all text-center"><div class="jycl-h2">您正在进行余额查询服务，请插入您的银行卡</div><div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white" id="sy_cancel">取消</button></div></div>');
            },
            function (err) {
                if (err) {
                    var cs = '<div class="pop-all text-center"><div class="jycl-h2">' + err.message + '</div><div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white chayu_duka">重试</button><button class="btn btn-mg btn-default fg-white" id="cy_back">返回</button></div></div>';
                    $('#cxmodal .modal-content').html(cs);
                } else {
                    $('#cancel').addClass('disabled');
                    that.speaker('mima');
                    var mm = '<div class="pop-all text-center"><div class="jycl-h2">请输入银行卡密码</div><div class="pop-button text-center" id="mima_contain"></div></div>';
                    $('#cxmodal .modal-content').html(mm);
                    setTimeout(function () {
                        that.jianpan['read_key_chayu'](function (err) {
                            if (err) {
                                var err = '<div class="pop-all text-center"><div class="jycl-h2">出错了，' + err.message + '查询已取消，请收好银行卡</div><div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white closemodal" id="cy_back">返回</button></div></div>'
                                $('#cxmodal .modal-content').html(err);
                                that.speaker('quka');
                                return;
                            }
                            var zifu = '<div class="pop-all text-center"><div class="jycl-h2">余额查询中，请稍等&nbsp;&nbsp;&nbsp;<img src="images/loading.gif" width="60" height="60" /></div><div class="pop-button text-center"></div></div>'
                            $('#cxmodal .modal-content').html(zifu);
                            setTimeout(function () {
                                that.yinlian.chayu(function (err, result) {
                                    if (err) {
                                        var sb = '<div class="pop-all text-center"><div class="jycl-h2">系统出错！请 重新查询 或者 返回。</div>' +
                                            '<div class="pop-button text-center">' + '<button class="btn btn-mg btn-default fg-white" id="cy_back">取消</button>' +
                                            '<button class="btn btn-mg btn-inverse fg-white chayu_duka">重新查询</button></div></div>';
                                        $('#cxmodal .modal-content').html(sb);
                                    } else if (!result.success) {
                                        var sb = '<div class="pop-all text-center"><div class="jycl-h2">查询失败！【' + result.message + '】请 重新查询 或者 返回。</div>' +
                                            '<div class="pop-button text-center">' + '<button class="btn btn-mg btn-default fg-white" id="cy_back">取消</button>' +
                                            '<button class="btn btn-mg btn-inverse fg-white chayu_duka">重新查询</button></div></div>';
                                        $('#cxmodal .modal-content').html(sb);
                                    } else if (result.success) {
                                        var rh = '<div class="pop-all text-center"><div class="jycl-h2">您的余额为：【' + result.money + '】元，<b class="fg-orange">&nbsp;请及时取走您的银行卡！</b></div>' +
                                            '<div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white" id="cy_back">返回</button></div></div>';
                                        $('#cxmodal .modal-content').html(rh);
                                    }
                                    that.speaker('quka');
                                });
                            }, 2);
                        }, function () {
                            var qx = '<div class="pop-all text-center"><div class="jycl-h2">您已经取消查询。</div>' +
                                '<div class="pop-button text-center"><button class="btn btn-mg btn-default fg-white" id="cy_back">返回</button>' +
                                '<button class="btn btn-mg btn-inverse fg-white chayu_duka" >重新交易</button></div></div>';
                            $('#cxmodal .modal-content').html(qx);
                            that.dukaqi.return_card();
                            that.speaker('quka');
                        }, function () {
                            $('#mima_contain').append("<span>*</span>");
                        }, function () {
                            $('#cxmodal span').remove();
                        });
                    }, 1);
                }
            });
    }
});
