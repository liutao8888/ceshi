var LOTTERYINFO;
//var DATASETTINGS;
var K3KJINFO;
var isk3Version=process.env.xx_isk3||0;//0 非快三  1是
var logger = require(process.cwd() + '/js_lib/Logger.js').logger;
var lotteryQuery = require(process.cwd() + '/js_lib/LotteryQuery.js');
var iconv = require('iconv-lite');

var home_note_status;
var pay_view = new PayView();
var readCardView = new ReadCardView();


var Workspace = Backbone.Router.extend({
    routes: {
        "": "home",
        "home": "home",
        'lottery/:lottery': 'lottery',
        'qmf': 'qmf',
        'phone': 'phonecharge',
        'account/:user': 'account',
        'kaijiang(/:lottery)': 'kaijiang',
        'zoushi/:lottery': 'zoushi',
        'help/:type(/:sub)': 'help',
        'credit': 'credit',
        //'accountcenter/:user':'account_center',
        'cardtocard': 'cardtocard',
        'test': 'test',
    },

    initialize: function () {
        $('#xx_client_id').text(process.env.xx_clientid);
        process.on('uncaughtException', function (err) {
            logger.error('uncaughtException:', err);
            console.error('Error caught in uncaughtException event:', err);
        });
        var gui = require('nw.gui');
        gui.App.setCrashDumpDir('D:\\log');
        gui.App.clearCache();
        if (this.logout_inter) {
            clearInterval(this.logout_inter);
        }
        this.renewLotteryInfo();
        this.upSystemtime();
        this.getk3kjhm();
        var that = this;
        var flag = 0;
        setInterval(function () {
            if (flag >= 20 || !LOTTERYINFO) {
                that.renewLotteryInfo();
                flag = 0;
            } else {
                var now = new Date();
                var l = _.findWhere(LOTTERYINFO, {gameName: 'k3'});
                var endTime = (new Date(l.stopTime)).getTime();
                var lag = (endTime - now.getTime());
                if (lag <= 0) {
                    that.renewLotteryInfo();
                    flag = 0;
                }
            }
            flag++;
        }, 1000 * 10);
        setInterval(function () {
            if (!K3KJINFO) {
                that.getk3kjhm();
            } else {
                var cq = parseInt(K3KJINFO[0].qihao);
                var l = 999999999;
                if (LOTTERYINFO) {
                    l = _.findWhere(LOTTERYINFO, {gameName: 'k3'});
                    l = parseInt(l.number);//console.log(cq,l);
                }
                if (l - cq > 1) {
                    that.getk3kjhm();
                }
            }
        }, 5000);
        setInterval(function () {
            that.upSystemtime();
        }, 1000 * 60 * 30);
        var fs = require('fs');
        fs.readFile(process.cwd() + '/package.json', {}, function (err, data) {
            if (!err && data) {
                var s = JSON.parse(data.toString());
                var p = process.execPath;
                $('#xx_version').text(s.version);
                var pk = p.substr(0, p.lastIndexOf('\\') + 1) + s.version + '.nw';
                if (fs.existsSync(pk)) {
                    fs.unlink(pk, function (err) {
                    });
                }
            }
        });

        var exec = require('child_process').exec;
        var speakerPath = process.execPath.substr(0, process.execPath.lastIndexOf('\\') + 1);
        exec('Speaker.exe', {cwd: speakerPath}, function (err, stdout, stdrr) {
            logger.debug(speakerPath, err, stdout, stdrr);
        });
        var c_time = 120;
        this.logout_countdown = c_time;
        var that = this;
        this.logout_inter = setInterval(function () {
            var hr = window.location.href;
            if(hr.indexOf('#home') > 0&&that.logout_countdown <= 0){
                if(window.sessionStorage){
                    sessionStorage.clear();
                }
                $(".winindex-login-status").hide();
            }

            that.logout_countdown = that.logout_countdown - 10;
            if (hr.indexOf('#') < 0 || hr.indexOf('#home') > 0) {

                return;
            }
            if (that.logout_countdown == 10) {
                $('#numkeyboard,#keyboard,#hw_keyboard').hide();
                $('#cztxmodal').modal('hide');
                $('#ChangeInfo').modal('hide');
                $('#modal_back_to_home').modal('show');
                $('#back_home_model_time_down').attr('src', 'images/10m.gif');
            }
            if (that.logout_countdown <= 0) {
                $('.modal').modal('hide');
                tickets.reset();
                if(window.sessionStorage){
                    sessionStorage.clear();
                }
                $(".winindex-login-status").hide();
                window.location.href = '#home';
            }

        }, 10000);
        $('body').click(function () {
            if (that.logout_countdown && that.logout_countdown <= 10) {
                $('#modal_back_to_home').modal('hide');
            }
            that.logout_countdown = c_time;
        });
    },

    getk3kjhm: function () {
        lotteryQuery.getKaiJiangByLottery('k3', function (err, res) {
            K3KJINFO = res;
        });
    },
    upSystemtime: function () {
        var exec = require('child_process').exec;
        lotteryQuery.getCurrentServerTime(function (err, time) {
            if (!err) {
                var time1 = time.split(' ')[0].toString() + ' ' + '& time ' + time.split(' ')[1].toString();
                exec('date ' + time1, function (err, stdout, stdrr) {
                });
            }
        })
    },
    renewLotteryInfo: function () {
        lotteryQuery.getAward('', function (err, infos) {
            console.info(infos);
            if (err) {
                $('#home_error').text('现在网络可能不稳定');
            } else {
                $('#home_error').empty();
                LOTTERYINFO = infos;
            }
        });
    },
    test: function () {
        $('#footer').show();
        this.help_view = this.help_view || new HelpView();
        this.help_view.inti('tsTs', '');
    },
    home: function () {
        $('#footer').show();
        this.home_view = this.home_view || new HomeView();
        this.home_view.inti();
    },
    qmf: function () {
        $('#footer').hide();
        this.qmf_view = this.qmf_view || new QmfView();
        this.qmf_view.inti();
    },
    lottery: function (lottery) {
        var tag = false;
        //$('#footer').hide();
        var that = this;
        _.each(LOTTERYINFO, function (item, i) {
            if(lottery.indexOf("detail")>0){
                if (item.gameName == JSON.parse(lottery).lotteryType && item.gameStatus == '0') {
                    window.location.href = '#test';
                    tag = true;
                    return;
                } else if (item.gameName == JSON.parse(lottery).lotteryType&& item.gameStatus == '1') {
                    $('#footer').hide();
                    that.lottery_view = that.lottery_view || new LotteryView();
                    that.lottery_view.inti(JSON.parse(lottery));
                    that.speaker('welcome');
                    tag = true;
                    return;
                }
            }else{
                if (item.gameName == lottery && item.gameStatus == '0') {
                    window.location.href = '#test';
                    tag = true;
                    return;
                } else if (item.gameName == lottery && item.gameStatus == '1') {
                    $('#footer').hide();
                    that.lottery_view = that.lottery_view || new LotteryView();
                    that.lottery_view.inti({lotteryType: lottery.toLowerCase()});
                    that.speaker('welcome');
                    tag = true;
                    return;
                }
            }
        });
        if (!tag) {
            window.location.href = '#test';
        }

        //that.lottery_view = that.lottery_view || new LotteryView();
        //that.lottery_view.inti({lotteryType: lottery.toLowerCase()});
    },
    phonecharge: function () {
        $('#footer').hide();
        this.phone_charge = this.phone_charge || new PhoneChargeView();
        this.phone_charge.inti();
    },
    gamescharge: function () {
        $('#footer').hide();
        this.game_charge = this.game_charge || new GameChargeView();
        this.game_charge.inti();
    },
    kaijiang: function (lottery) {
        $('#footer').hide();
        this.kaijiang_view = this.kaijiang_view || new KaiJiangiView();
        this.kaijiang_view.inti(lottery);
    },
    zoushi: function (lottery) {
        $('#footer').hide();
        this.zoushi_view = this.zoushi_view || new ZouShiView();
        this.zoushi_view.inti(lottery);
    },
    help: function (type, sub) {
        $('#footer').hide();
        this.help_view = this.help_view || new HelpView();
        this.help_view.inti(type, sub);
    },
    credit: function () {
        $('#footer').hide();
        this.account_credit_view = this.account_credit_view || new CreditView();
        this.account_credit_view.inti();
    },
    cardtocard: function () {
        $('#footer').hide();
        this.kaka_view = this.kaka_view || new KaKaView();
        this.kaka_view.inti();
    },

    //我的彩票
    account: function (user) {
        $('#footer').hide();
        this.account_view = this.account_view || new AccountView();
        this.account_view.inti(JSON.parse(user));//JSON.parse(user)
    },

    speaker: function (key) {
        var exec = require('child_process').exec;
        var speakerPath = process.execPath.substr(0, process.execPath.lastIndexOf('\\') + 1);
        exec('Speaker.exe ' + key, {cwd: speakerPath}, function (err, stdout, stdrr) {
            //console.log(speakerPath,err,stdout,stdrr);
        });
    }
});
var workspace = new Workspace();
Backbone.history.start();
