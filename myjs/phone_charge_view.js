var PhoneChargeView=Backbone.View.extend({
    el:$("#content"),
    callsNum:{'133':{yys:'dx'},'153':{yys:'dx'},'180':{yys:'dx'},'181':{yys:'dx'},'189':{yys:'dx'},'177':{yys:'dx'},
        '130':{yys:'lt'},'131':{yys:'lt'},'132':{yys:'lt'},'155':{yys:'lt'},'156':{yys:'lt'},'145':{yys:'lt'},'185':{yys:'lt'},'186':{yys:'lt'},'176':{yys:'lt'},
        '134':{yys:'yd'},'135':{yys:'yd'},'136':{yys:'yd'},'137':{yys:'yd'},'138':{yys:'yd'},'139':{yys:'yd'},'150':{yys:'yd'},'151':{yys:'yd'},'152':{yys:'yd'},
        '158':{yys:'yd'},'159':{yys:'yd'},'182':{yys:'yd'},'183':{yys:'yd'},'184':{yys:'yd'},'157':{yys:'yd'},'187':{yys:'yd'},'188':{yys:'yd'},'147':{yys:'yd'},
        '178':{yys:'yd'}},
    events:{
        'click .recharge-money li':'selectMoney',
        'click #numkeyboard_show button':'numKeyBoard',
        'click .backdel':'keyBackDel',
        'click #pay_phone_login':'pay_login'
    },
    logger:require(process.cwd()+'/js_lib/Logger.js').logger,
    inti:function(params){
        $(this.el).html($('#temp_phone_charge').html());
    },
    selectMoney:function(e){
        //$('#pay_phone_nologin,#pay_phone_login').addClass('disabled');
        $(".recharge-money li").removeClass("money-active");
        e.currentTarget.className='money-active';
    },
    numKeyBoard:function(e){
        var num=$(".phone-num b").text();
        var key  = e.currentTarget.value;
        if(key=='-'){
            this.BackDel();
        }else if(key=='--'){
            this.DelAll();
        }else{
            if(num.length>=11){
                return;
            }
            $(".phone-num em").hide();
            $(".phone-num").append('<b>'+ e.currentTarget.value+'</b>');
        }
        this.NumDecide();
    },
    BackDel:function(){
        $(".phone-num b:last").remove();
        this.NumDecide();
    },
    DelAll:function(){
        $(".phone-num b").remove();
    },
    NumDecide:function(){
        var num=$(".phone-num b").length;
        var thirdnum=$(".phone-num b:eq(0)").text().trim()+$(".phone-num b:eq(1)").text().trim()+$(".phone-num b:eq(2)").text().trim();
        if(!this.callsNum[thirdnum]){
            if(num<3){
                $(".readable-icon,.tishi-error").hide();
                return;
            }else{
                $(".readable-icon").css({"display":"none"});
                $(".recharge-txtext span").css({"display":"none"});
                $(".tishi-error").css({"display":"block"});
                $(".tishi-error").addClass("fg-red");
                $(".readable-icon").css({"display":"block"});
                $(".readable-icon").addClass("readable-noicon");
                $(".readable-icon").removeClass("readable-yesicon");
                $(".readable-icon").css({"background-color":"#e51400"});
            }
            if(!$('#pay_phone_nologin,#pay_phone_login').hasClass('disabled')){
                $('#pay_phone_nologin,#pay_phone_login').addClass('disabled');
            }
        }else{
            $(".recharge-txtext span").hide();
            $(".tishi-"+this.callsNum[thirdnum]['yys']).show();
            $(".tishi-"+this.callsNum[thirdnum]['yys']).addClass("fg-black");
            if(num==11){
                $(".readable-icon").addClass("readable-yesicon");
                $(".readable-icon").removeClass("readable-noicon");
                $(".readable-icon").css({"display":"block"});
                $(".readable-icon").css({"background-color":"#008c00"});
                $('#pay_phone_nologin,#pay_phone_login').removeClass('disabled');

            }else{
                if(!$('#pay_phone_nologin,#pay_phone_login').hasClass('disabled')){
                    $('#pay_phone_nologin,#pay_phone_login').addClass('disabled');
                }
            }
        }
    },
    pay_login:function(e){
        if($(e.currentTarget).hasClass('disabled')){
            return;
        }
        var mianzhi = $('.recharge-money .money-active').text().replace('元','');
        var m = parseInt(mianzhi);
        var phone_num = $('.phone-num b').text();
        var fws = $('.tishi-yd').is(':visible') ? '01': $('.tishi-lt').is(':visible') ? '02': '03';
        var info = {lotteryType:'',payType:"phone",info:{phone_num:phone_num,money:m,mianzhi:m,fws:fws}};
        logger.info('手机充值',JSON.stringify(info));
        pay_view.inti(info);
    }
});
