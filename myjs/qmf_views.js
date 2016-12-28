var QmfView = Backbone.View.extend({
    el:$('#content'),
    inti:function(){
        $(this.el).html($('#temp_qmf').html());
    },
    events:{
        'click .working':'working'
    }
});
var CreditView=Backbone.View.extend({
    el:$('#content'),
    events:{
        'focus #credit_card_no,#credit_return_money':'shownumkey',
        'click #btn_credit_search':'credit_search',
        'click #credit_btn_pay':'credit_pay',
        'click #credit_pay_bak':'close_modal',
        'click #credit_read_card':'read_card'
    },
    shownumkey:function(e){
        $(e.currentTarget).numberKeyboard();
    },

    inti:function(){
        $(this.el).html($('#temp_credit').html());
    },
    close_modal:function(){
        $('#credit_modal').modal('hide');
    },
    pos:require(process.cwd()+'/js_lib/hardware/YinLian0.js'),
    logger:require(process.cwd()+'/js_lib/Logger.js').logger,
    credit_search:function(e){
        var no = $('#credit_card_no').val();
        if(!no){$('#credit_card_no').parent().addClass('has-error');return;}else{$('#credit_card_no').parent().removeClass('has-error');}
        var money = $('#credit_return_money').val();
        logger.info('信用卡还款查询卡号-还款金额===',no,money);
        if(!money || parseInt(money) <= 0){
            $('#credit_return_money').parent().addClass('has-error');
            return;
        }else{
            $('#credit_return_money').parent().removeClass('has-error');
        }
        var btn = $(e.currentTarget);
        btn.button('loading');
        //m2手续费
//        var m2 = 2;
        this.pos.searchBill(no,'13656687882',function(err,m1,m2){
            btn.button('reset');
            logger.info('====手续费查询结果===',err,m1,m2);
            if(err){
                var e = '<div class="jycl-h2">查询失败，请确认卡号是否正确</div><div class="pop-button text-center"><button class="btn btn-mg btn-default fg-grayDark" id="credit_pay_bak">返回</button></div>';
                $('#credit_modal .pop-all').html(e);
            }else{
                var b = '<div class="jycl-h2">您的信用卡号为： <b class="fg-orange" id="credit_com_no">  </b>'+
                    '<br/>&nbsp;&nbsp;还款金额：<b class="fg-orange" id="credit_com_money"> </b>元'+
                    '&nbsp;&nbsp;手续费：<b class="fg-orange" id="credit_com_fee"></b>元'+
                    '&nbsp;&nbsp;您需要支付：<b class="fg-orange" id="credit_com_money_total"></b>元</div>'+
                    '<div class="pop-button text-center">'+
                    '<button class="btn btn-mg btn-inverse fg-white" id="credit_btn_pay">确认还款</button><button class="btn btn-mg btn-default fg-grayDark" id="credit_pay_bak">返回</button></div>';
                $('#credit_modal .pop-all').html(b);
                $('#credit_com_no').text($('#credit_card_no').val());
                $('#credit_com_money').text(parseInt($('#credit_return_money').val()));
                $('#credit_com_fee').text(parseInt(m2/100));
                $('#credit_com_money_total').text(parseInt(m2/100) + parseInt($('#credit_return_money').val()));
            }
            $('#credit_modal').modal('show');
        });
    },
    credit_pay:function(e){
        var m =  parseInt($('#credit_com_money_total').text());
        var m_sx = parseInt($('#credit_com_fee').text());
        var m_cr = parseInt($('#credit_com_money').text());
        $('#credit_modal').modal('hide');
        var info = {lotteryType:'',payType:'credit',info:{money:m,money_credit:m_cr,money_sx:m_sx,card_no:$('#credit_com_no').text(),phone_num:'18621321780'}};
        logger.info('===还款信息===',JSON.stringify(info));
        pay_view.inti(info);
    },
    read_card:function(){
        readCardView.inti($('#credit_card_no'));
    }
});
var KaKaView=Backbone.View.extend({
    el:$('#content'),
    events:{
        'focus #kaka_card_no,#kaka_return_money':'shownumkey',
        'click #btn_kaka_search':'kaka_search',
        'click #kaka_btn_pay':'credit_pay',
        'click #kaka_pay_bak':'close_modal',
        'click #kaka_read_card':'read_card'
    },
    shownumkey:function(e){
        $(e.currentTarget).numberKeyboard();
    },
    inti:function(){
        $(this.el).html($('#temp_cardtocard').html());
    },
    close_modal:function(){
        $('#kaka_modal').modal('hide');
    },
    pos:require(process.cwd()+'/js_lib/PosHandler.js'),
    kaka_search:function(e){
        var no = $('#kaka_card_no').val();
        if(!no){$('#credit_card_no').parent().addClass('has-error');return;}else{$('#kaka_card_no').parent().removeClass('has-error');}
        var money = $('#kaka_return_money').val();
        if(!money || parseInt(money) <= 0){
            $('#kaka_return_money').parent().addClass('has-error');
            return;
        }else{
            $('#kaka_return_money').parent().removeClass('has-error');
        }
        var b = '<div class="jycl-h2">您转账的银行卡号为： <b class="fg-orange" >'+ $('#kaka_card_no').val()+'  </b>'+
            '<br/>&nbsp;&nbsp;转账金额：<b class="fg-orange" > '+ $('#kaka_return_money').val() + '</b>元'+
            '<div class="pop-button text-center">'+
            '<button class="btn btn-mg btn-inverse fg-white" id="kaka_btn_pay">确认转账</button><button class="btn btn-mg btn-default fg-grayDark" id="kaka_pay_bak">返回</button></div>';
        $('#kaka_modal .pop-all').html(b);
        $('#kaka_modal').modal('show');
    },
    credit_pay:function(e){
        var money = $('#kaka_return_money').val();
        $('#kaka_modal').modal('hide');
        var info = {lotteryType:'',payType:'cardtocard',info:{money:money,money_credit:money,money_sx:'0',card_no:$('#kaka_card_no').val()}};
        pay_view.inti(info);
    },
    read_card:function(){
        readCardView.inti($('#kaka_card_no'));
    }
});
var ReadCardView = Backbone.View.extend({
    el:$('#paymodal'),
    events:{
        'click #duka_cancel_sec':'duka_cancel',
        'click .pay_duka_sec':'read_card',
        'click .cls_paymodal_sec':'hide_modal'
    },
    dukaqi:require(process.cwd()+'/js_lib/DuKaQiHandler.js'),
    speaker:function(key){
        var exec = require('child_process').exec;
        var speakerPath = process.execPath.substr(0,process.execPath.lastIndexOf('\\') + 1) ;
        exec('Speaker.exe '+key,{cwd:speakerPath},function(err,stdout,stdrr){
            //console.log(speakerPath,err,stdout,stdrr);
        });
    },
    inti:function(target){
        this.target = target;
        $('#paymodal .modal-header').html('请插卡以便读取您的卡号');
        this.read_card();
    },
    duka_cancel:function(){
        this.dukaqi.returnCard();
        $('#paymodal').modal("hide");
    },
    hide_modal:function(e){
        $(this.el).modal('hide');
    },
    modal_content:function(html,buttons){
        buttons = buttons || '';
        var cont = '<div class="pop-all text-center">'+html+'<div class="pop-button text-center">'+ buttons +'</div></div>';
        $('#paymodal .modal-content').html(cont);
    },
     //1-读卡
    read_card:function(){
        this.modal_content('<div class="jycl-h2">初始化读卡器中，请稍后</div>');
        $(this.el).modal({
            backdrop:'static',
            show:true
        });
        var that = this;
        setTimeout(function(){
            that.dukaqi.read_card_data(
                function(){
                    that.modal_content('<div class="jycl-h2">请插入您的银行卡</div>','<button class="btn btn-mg btn-default fg-white" id="duka_cancel_sec">取消</button>');
                    that.speaker('chaka');
                },
                function(err,card_no){
                    //console.log('读取卡号为：',card_no)
                    if(err){
                        that.modal_content('<div class="jycl-h2">'+err.message+'</div>','<button class="btn btn-mg btn-default fg-white pay_duka_sec">重试</button><button class="btn btn-mg btn-default fg-white cls_paymodal_sec" >返回</button>');
                    }else{
                        that.target.val(card_no);
                        that.hide_modal();
                    }
                });
        },50);
    }
})