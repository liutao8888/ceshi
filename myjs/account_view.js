var AccountView = Backbone.View.extend({
    el:$('#content'),
    dayinji: require(process.cwd() + '/js_lib/DaYinJi.js'),
    inti:function(user){
        this.user = user;
        //var now=new Date();
        //var logintime=now.getFullYear()+'-'+now.getMonth()+1<10?('0'+(now.getMonth()+1)):now.getMonth()+1+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
        //this.user.logintime=logintime;
        $(this.el).html(_.template($('#temp_account').html())(user));
        var ps={type:'all',paging:'0',pagesize:'5',status:'-2',beginTime:'',endTime:'',user:this.user.tel};
        this.getOrders(ps);
        $('#account_lists').html($('#temp_account_record').html());
       //console.log('初始化',this.user);
    },
    modal_content:function(html,buttons){
        buttons = buttons || '';
        var cont = '<div class="pop-all text-center">'+html+'<div class="pop-button text-center">'+ buttons +'</div></div>';
        $('#cztxmodal .modal-content').html(cont);
        $('#cztxmodal').modal('show');
        $('#cztxmodal .modal-footer').hide();
    },

    events:{
        'click #account_nav li':'accountNav',
        'click #orders_lotto li':'orders_lotto',
        'click #time_nav a':'timeNav',
        'click #account_pages li':'pageNav',
        'click #showdetail':'order_detail',
        'click .deails-close':'closemodal',
        'click  #zhongjiang_lotto':'showzj',
        //'click #account_cz':'chongzhi',
        'click #account_back':'account_back',
        'click #updatePassword':'showchangepwd',
        'click .showmodal':'showmodal',
        'click .btn-back':'hidemodal',
        'click #btn_fix_password':'update_password',
        'click #acc_czmoney li':'cz_select',
        'click #qd_cz':'chongzhi',
        'click #acc_txmoney li':'tx_select',
        'click #qd_tx':'tixian',
        'click #account_center_bt_logout':'logout',
        'click #bindcard':'showchangeInfo',
        'click #account_send_code':'send_vali',
        'click #check':'check',
        'click #sub_pwd':'updatePassword',
        'click #btn_fix_bankcard':'update_bank',
        'click .cls_ChangeInfo':'changeback',
        'click #rebuybyrecord':'rebuybyrecord',
        'click #printAgain': 'printAgain',
        'click #logout':'clearInfo',
        'focus #oldpwd,#rg_valicode,#repeat_newbank,#up_idcard,#newbankcard,#newpwd,#tx_jine,#cz_jine,#cbpwd,#tx_password,#up_valicode,#checkcode':'show_numkeyboard',
        //'click .cls_modal':'hide_modal',

       /**
        * 增加修改提现卡
        * 21050512
        * coolfire
        */
        'click #updatetxcard':'showupdatetxcard',
        'click #confirm_upcard':'confirm_upcard'
        
    },
    encry : require(process.cwd()+'/js_lib/EncryptUtil'),
    logger:require(process.cwd()+'/js_lib/Logger').logger,
    //显示数字键盘
    show_numkeyboard:function(e){
        $(e.currentTarget).numberKeyboard();
    },
    
    show_keyboard: function (e) {
        $(e.currentTarget).myKeyboard();
    },
    clearInfo: function () {
        this.user=null;
        if(window.sessionStorage){
            sessionStorage.clear();
        }
        $(".winindex-login-status").hide();
        window.location.href="#home";
    },
    getPageCount:function(allcount){
        return (allcount % 5) == 0 ? (allcount / 5) : ((allcount / 5)+1).toString().split('.')[0]
    },

    //根据日期导航
    timeNav:function(e){
        if($(e.currentTarget).hasClass('time-active')){
            return;
        }
        $('#time_nav a.time-active').removeClass('time-active');
        var ti = $('#time_nav a').index($(e.currentTarget));
        $(e.currentTarget).addClass('time-active');
        var now = new Date();
        
        var ps={};
        var methods = $('#time_nav').attr('req');

        if(ti == 0){
            ps={type:'all',paging:'0',pagesize:'7',status:'-2',beiginTime:'',endTime:'',user:this.user.tel};
        }else if(ti == 1){
            var d = new Date(now.valueOf() - 1000*60*60*24*90);
            var date=d.getDate()<10?'0'+d.getDate().toString():d.getDate().toString();
            var endTime = d.getFullYear().toString()+'-'+(d.getMonth()+1).toString()+'-'+date+' '+'00:00:00' ;
            ps={type:'all',paging:'0',pagesize:'7',status:'-2',beiginTime:'',endTime:endTime,user:this.user.tel};
        }else if(ti == 2){
            var date1=now.getDate()<10?'0'+now.getDate().toString():now.getDate().toString();
            var month1=now.getDate()<10?'0'+(now.getMonth()+1).toString():(now.getMonth()+1).toString();
            var endTime1 = (now.getFullYear()-1).toString()+'-'+month1+'-'+ date1+' '+'00:00:00';
            //console.log('近期时间',endTime1);
            ps={type:'all',paging:'0',pagesize:'7',status:'-2',beiginTime:'',endTime:endTime1,user:this.user.tel};
        }
       if(methods=='getUserAmountRecord'){
            ps.pagesize=10;
        }
        $('#time_nav a:eq('+ti+')').addClass('time-active');

	//console.log('当前请求时间',ps);
        this[methods](ps);
    },

    //翻页
    pageNav:function(e){
        var tg = $(e.currentTarget);
        var pi = $('#page_info').text().split('/');
        var pindex = +pi[0]-1;
        var tpage = +pi[1];
        var ps={type:'all',paging:'0',pagesize:'10',status:'-2',beginTime:'',endTime:'',user:this.user.tel};
        var methods = $('#account_pages').attr('req');
        if(methods=='getOrders'){
            if(this.lottoParams) {ps.endTime=this.lottoParams.endTime;}
        }else if(methods=='getUserAmountRecord') {
            if(this.amountParams) {ps.endTime=this.amountParams.endTime;}
        }
        if(tg.hasClass('prev') && (pindex - 1 >= 0)){
            ps.paging=(pindex-1);
            this[methods](ps);
        }else if(tg.hasClass('next') && (pindex + 1 <= tpage)){
            ps.paging=pindex+1;
            this[methods](ps);
        }
    },

    //导航栏
    accountNav:function(e){
        var cg = $(e.currentTarget);
        if(cg.hasClass('active')){
            return;
        }
        $('#account_nav li.active').removeClass('active');
        cg.addClass('active');
        var ind = $('#account_nav li').index($(e.currentTarget));
        if(ind == 0){
            //$('#page_info').text('1/1');
            this.getOrders();
            $('#account_lists').html($('#temp_account_record').html());
        }else if(ind == 1){
            //$('#page_info').text('1/1');
            this.getUserAmountRecord();
        }else if(ind == 2){
            this.getUserInfo();
        }else if(ind ==3){
            this.showaccountM();
        }
    },

    ///1获取历史订单
    getOrders:function(ps){
        var that =this;
        this.lottoParams = {type:'all',paging:'0',pagesize:'7',status:'-2',beginTime:'',endTime:'',user:this.user.tel};
        if(ps)
        {
            this.lottoParams.paging=ps.paging;
            this.lottoParams.endTime=ps.endTime;
        }
        lotteryQuery.getOrders(that.user.id,that.user.pwd,this.lottoParams, function (err,res,pageInfo) {
            logger.info('=======getOrders=======',res,pageInfo);

            if(err){
                $('#account_order_list').html(_.template($('#temp_account_record_list').html())({list:res}));
                $('#account_pages').html(_.template($('#temp_account_pages').html())({currentpage:1,total_pages:1}));
            }else{

                var tp=pageInfo.totalItems%7==0 ? Math.floor(pageInfo.totalItems/7) : Math.floor(pageInfo.totalItems/7)+1;
                _.each(res,function(item ,i){
                    item.orderStatus = that.getOrderStatus(item.orderStatus);
                    item.winningStatus = that.getWinStatus(item.winningStatus);
                });
                $('#account_order_list').html(_.template($('#temp_account_record_list').html())({list:res}));
                $('#account_pages').html(_.template($('#temp_account_pages').html())({currentpage: Math.floor(that.lottoParams.paging)+1,total_pages:tp}));

            }
        })
    },

    //1订单详情  orderid
    order_detail:function(e){
        var that = this;
        var streamid=$(e.currentTarget).attr('no');
        lotteryQuery.getOrderDetail(that.user.id,that.user.pwd,streamid, function (err,detail) {
            logger.info('=======getOrderDetail=======',detail);
            if(err){
                that.modal_content('<div class="jycl-h2">订单详情获取失败,请稍后再试。【'+err+'】</div>','<button class="btn btn-mg btn-default fg-white cls_ChangeInfo">返回</button>');
            }else{
                var lottery=detail.lotteryType=='ssq'?'双色球':detail.lotteryType=='3d'?'3D':detail.lotteryType=='307'?'七乐彩':detail.lotteryType=='k3'?'快三':'30选5';
                var tmp = _.template($('#account_lottery_detail').html());
                detail.winningStatus =that.getWinStatus(detail.winningStatus);
                console.log(detail);
                $('#lott_detail .modal-content').html(tmp({detail:detail,lottery:lottery}));
                $('#lott_detail').modal({
                    backdrop:'static',
                    show:true
                });
            }
            
        })

    },
    //追投
    rebuybyrecord: function (e) {
        $('#lott_detail').modal('hide');
        var streamid=$(e.currentTarget).attr('no'),detailticket;
        var that=this;
        lotteryQuery.getOrderDetail(this.user.id,this.user.pwd,streamid, function (err,detail) {
            if(!err&&detail){
                detailticket={
                    lott_list:detail.lottList,
                    play_Type:detail.lottList[0].playType,
                    multiple:detail.multiple,
                    play_type_code:detail.lottList[0].playType,
                    play_type_name:that.getLotteryPlayType(detail.lotteryType,detail.lottList[0].playType)
                }
                var rinfo={lotteryType:detail.lotteryType,detail:detailticket}
                window.location.href = '#lottery/' + JSON.stringify(rinfo);
            }
        })
    },
   //重新打印
    printAgain: function(){
    	var that = this;
        //订单号
    	var orderNumber = $("#orderN").text();
    	//购买时间
    	var orderTime = $("#ordT").text();
    	//彩种
    	var lot = $("#lot").text();
    	//期号
    	var issueNumber = $("#issueN").text();
    	//金额
    	var ordermoney = $("#ordm").text();
    	//投注号
    	var lottolist =parseInt($("#lottolist").text());
    	//倍数
    	var ballMultiple = parseInt($("#ballMultiple").text());
		//用户
        var userName = $("#user_id").text();
        //将打印信息封装
		var detail = {};
		detail.orderNumber = orderNumber;
		detail.lottery = lot;
		detail.issueNumber = issueNumber;
		detail.orderTime = orderTime;
		detail.orderbonus = ordermoney;
		detail.bonus = lottolist;
		detail.username = userName;	
		detail.multiple = ballMultiple;
        that.dayinji.write_test_lottery(detail);
    },
    //获取订单状态
    getOrderStatus:function(status){
        if(status=='0'){
            return'待支付';
        }else if(status=='1'){
            return'委托中';
        }else if(status=='2'){
            return '委托成功';
        }else if(status=='3'){
            return '投注成功';
        }else if(status=='5'){
            return '投注失败';
        }else if(status=='6'){
            return '订单取消';
        }else if(status=='7'){
            return '投注失败,已退款';
        }
    },

    //开奖状态
    getWinStatus:function(status){
        if(status=='0'){
            return'过期关闭';
        }else if(status=='1'){
            return'未开奖';
        }else if(status=='2'){
            return '未中奖';
        }else if(status=='3'){
            return '发奖中';
        }else if(status=='4'){
            return '已发奖';
        }
    },

    //2交易记录
    getUserAmountRecord:function(ps){
        this.amountParams ={type:'all',paging:'0',pagesize:'10',status:'-2',beginTime:'',endTime:'',user:this.user.tel};
        if(ps)
        {
            this.amountParams.paging=ps.paging;
            this.amountParams.endTime=ps.endTime;
        }

        if($('#account_amount_list').length == 0 ){
            $('#account_lists').html($('#temp_account_amount').html());
        }
        var that=this;
        lotteryQuery.getAccountDetail(this.user.tel,this.user.pwd,this.amountParams.beginTime,this.amountParams.endTime,this.amountParams.paging,this.amountParams.pagesize, function (err,details,pageInfo) {
            logger.info('=======getUserAmountRecord=======',details,pageInfo);
            if(err){
                $('#account_amount_list').html(_.template($('#temp_account_amount_list').html())({detail:details}));
                $('#account_pages').html(_.template($('#temp_account_pages').html())({currentpage:1,total_pages:1}));
            }else{
                var tp=pageInfo.totalItems%10==0 ? Math.floor(pageInfo.totalItems/10) : Math.floor(pageInfo.totalItems/10)+1;
                $('#account_amount_list').html(_.template($('#temp_account_amount_list').html())({detail:details}));
                $('#account_pages').html(_.template($('#temp_account_pages').html())({currentpage: Math.floor(that.amountParams.paging)+1,total_pages:tp}));
            }
        })
    },
    
  

    
    //3显示用户信息
    getUserInfo:function(){
        var tmp = _.template($('#temp_account_user').html());
        $('#account_lists').html(tmp({name:this.user.name,idCard:this.user.idCard,tkBankcardNo:this.user.tkBankcardNo}));  
    },

    //显示修改绑定卡界面
    showupdatetxcard: function () {
        //$('#ChangeInfo').modal('show');
        $('#ChangeInfo').html($('#temp_account_center').html());
        $('#modal_account_upbankcard').modal({
            backdrop:'static',
            show:true
        });
    },

    //修改绑定卡
    confirm_upcard: function () {
        var bank= $.trim($('#newbankcard').val()),pwd= $.trim($('#cbpwd').val()),renewbank=$.trim($('#repeat_newbank').val()),qz_idcard=$.trim($('#up_idcard').val());
        var checkcode = this.$('#checkcode').val();
        if(bank && bank.length>=16){
            $('#newbankcard').parent().parent().removeClass('has-error');
        }else{
            $('#newbankcard').parent().parent().addClass('has-error');
            return;
        }
        if(bank==renewbank){
            $('#repeat_newbank').parent().parent().removeClass('has-error');
        }else{
            $('#repeat_newbank').parent().parent().addClass('has-error');
            //this.show_error(!bank ? '请输入银行卡号':'两次输入的卡号不一致');
            return;
        }
        if(pwd && pwd.length >=6){
            $('#rspwd_newpwd').parent().parent().removeClass('has-error');
        }else{
            $('#rspwd_newpwd').parent().parent().addClass('has-error');
            return;
        }
        if(checkcode){
            $('#checkcode').parent().parent().removeClass('has-error');
        }else{
            $('#checkcode').parent().parent().addClass('has-error');
            return;
        }
        if(this.user.idCard==qz_idcard){
            $('#up_idcard').parent().parent().removeClass('has-error');
        }else{
            $('#up_idcard').parent().parent().addClass('has-error');
            return;
        }
        var user={
            tel:this.user.tel,
            email:'',
            idCard:this.user.idCard,
            name:this.user.name,
            user:this.user.tel,
            tkbankcardno:bank,
            checkCode:checkcode
        }
        var that=this;
        lotteryQuery.updateUserinfo(that.user.tel,pwd,that.user.idCard,user, function (err,res) {
            $('#modal_account_upbankcard').modal('hide');
            if(err) {
                setTimeout(function () {
                    $('#ChangeInfo').html($('#temp_account_center').html());
                    $('#modal_account_failed').modal('show');
                },100);
            }else{

                that.user.tkBankcardNo=user.tkbankcardno;
                setTimeout(function () {
                    $('#ChangeInfo').html($('#temp_account_center').html());
                    $('#modal_account_success').modal('show');
                },300);
                //console.log(that.user.tkBankcardNo);
                that.getUserInfo();//修改完重新加载用户信息
            }
        })
    },
    //下发验证码
    send_vali:function(e){
        var btn= $(e.currentTarget);
        if(btn.hasClass('disabled')){
            return;
        }
        btn.addClass('disabled').text('发送中..');
        var that=this;
        lotteryQuery.sendVali(this.user.id,function(err,info){
        that.countdown(btn);
         });
    },
    count_down_interv:null,
    countdown:function(item){
        if(this.caount_down_interv || item.length <=0){
            clearInterval(this.count_down_interv);
            logger.error('this.count_down_interv || item.length <=0');
        }
        var secs = 60;
        var that = this;
        this.count_down_interv = setInterval(function(){
            if( item.length <= 0){
                clearInterval(that.count_down_interv);
                return;
            }
            secs = secs-1;
            if(secs <0){
                clearInterval(that.count_down_interv);
                item.removeClass('disabled').text('重发');
            }else{
                item.text('重发 '+ secs+' 秒');
            }
        },1000);
    },

     //更新密码
    updatePassword:function(){
        var oldpwd = $('#oldpwd').val();
        var newpwd = $('#newpwd').val();

        if(!oldpwd || oldpwd.length < 6){
            $('#oldpwd').parent().addClass('has-error');
            return;
        }else{
            $('#oldpwd').parent().removeClass('has-error');
        }
        if(!newpwd|| oldpwd.length < 6 || oldpwd !=newpwd){
            $('#newpwd').parent().addClass('has-error');
            return;
        }else{
            $('#newpwd').parent().removeClass('has-error');
        }
        var checkcode=$('#up_valicode').val();
        var that=this;
        lotteryQuery.updatePwd(checkcode,this.user,newpwd,newpwd,function(err,returns){
            if(err){
                that.modal_content('<div class="jycl-h2">密码修改失败,请稍后再试。</div>','<button class="btn btn-mg btn-default fg-white cls_ChangeInfo">返回</button>');
            }else{
                that.modal_content('<div class="jycl-h2">密码修改成功。</div>','<button class="btn btn-mg btn-default fg-white cls_ChangeInfo">确定</button>');
            }
        });
    },

    //更新余额
    getBalance: function(renew){
        var that=this;
        lotteryQuery.getBalance(that.user,function(err,results){
            if(err){
                //console.log('getBalance err'+err);
            }else{
                that.showaccountM();
            }
        });
    },

    //4充值、提现
    showaccountM: function () {
        var that=this;
        lotteryQuery.getBalance(that.user,function(err,results){
            if(err){
                that.modal_content('<div class="jycl-h2">余额查询失败,请稍后再试。【'+err+'】</div>','<button class="btn btn-mg btn-default fg-white cls_ChangeInfo">返回</button>');
            }else{
                that.user.balance=results.balance;
                var tmp = _.template($('#modal_account_crchoose').html());
                $('#account_lists').html(tmp({balance:that.user.balance}));
            }
        });
    },
    cz_select:function(e){
        var m = $(e.currentTarget).text();
        $('#cz_jine').val(m.replace('元',''));
    },
    chongzhi:function(e){
        $('#modal_account_tx').modal('hide');
        //var regex = new RegExp("/^\d+$/g");
        var m = $('#cz_jine').val();
        if(!m||!/^\d+$/g.test(m)){
            $('#cz_jine').parent().addClass('has-error');
            return;
        }else{
            $('#cz_jine').parent().removeClass('has-error');
        }
        $('.modal').modal('hide');
        var d = new Date();

        var czinfo={lotteryType:'',payType:'recharge',info:{money:parseInt(m),account:this.user.tel}};

        if(this.logout_inter){
            clearInterval(this.logout_inter);
        }
        //console.log(this.user,czinfo);
        pay_view.inti(czinfo);
        $('#modal_account_cz').modal('hide');
    },
    tx_select:function(e){
        var t = $(e.currentTarget).text();
        if(t == '所有金额'){
            $('#tx_jine').val(this.user.balance);
        }else{
            var m = t.replace('元','');
            $('#tx_jine').val(m);
        }
    },

    tixian:function(e){
        $('#modal_account_tx .message').empty();
        var m = $('#tx_jine').val();
        if(!m || parseInt(m) < 0||!/^\d+$/g.test(m)){
            $('#tx_jine').parent().addClass('has-error');
            return;
        }else{
            $('#tx_jine').parent().removeClass('has-error');
        }
        if( parseInt(this.user.balance)<parseInt(m)){//输入金额不能大于账户余额
            $('#tx_jine').parent().addClass('has-error');
            $('#tx_jine').val("账户余额不足！");
            return;
        }else{
            $('#tx_jine').parent().removeClass('has-error');
        }
        var pass = $('#tx_password').val();
        if(!pass){
            $('#tx_password').parent().addClass('has-error');
            return;
        }else{
            $('#tx_password').parent().removeClass('has-error');
        }
        if(!this.user.tkBankcardNo){
            $('#cztxmodal .modal-content').html("<div class='text-center pop-all'> 请先绑定银行卡号后再提现<button class='btn btn-default bg-teal fg-orange btn-back'>返回</button></div>");
        }else{
            if(!this.user.balance){
                if(this.user.balance == 0){
                    $('#cztxmodal .modal-content').html("<div class='text-center pop-all'> 您当前的可用金额为0元<button class='btn btn-default bg-orange fg-white btn-back'>返回</button></div>");
                }else{
                    $('#cztxmodal .modal-content').html("<div class='text-center pop-all'> 还没有请求到您的账户金额信息，若长时间没有得到，请重新登录后操作<button class='btn btn-default bg-teal fg-orange btn-back'>返回</button></div>");
                }
                return;
            }else if( parseInt(m) > this.user.balance){
                //$('#cztxmodal').modal('hide');
                $('#cztxmodal .modal-content').html("<div class='text-center pop-all'> 您的提款金额不能超过金额总和<button class='btn btn-default bg-teal fg-orange btn-back'>返回</button></div>");
                return;
            }
            //var that = this;
            $(e.currentTarget).button('loading');
            lotteryQuery.makeCashOrder(this.user,pass,parseInt(m),function(err,results){
                $(e.currentTarget).button('reset');
                //console.log('提现==',results);
                if(err){
                    $('#cztxmodal .modal-content').html('<div class="text-center font24 pop-all"> 对不起提现失败【'+err.message+'】<button class="btn btn-default bg-orange fg-white btn-back">返回</button></div>');
                }else{
                    //点击提现后界面上显示提现所到银行卡号和银行  待添加==back
                    $('#cztxmodal .modal-content').html('<div class="text-center pop-all"> 我们已经收到你的请求，一般在2个工作日内转账到您绑定的银行卡，注意查收！<button class="btn btn-default bg-teal fg-orange btn-back">返回</button></div>');
                }
            });
        }
    },
    account_back:function(){
        $('#modal_account_crchoose').modal('hide');
        this.inti(this.user);
    },


    //根据彩种显示订单ok
    orders_lotto:function(e){
        var tg = $(e.currentTarget);
        if(tg.hasClass('active')){
            return;
        }
        $('#time_nav a.time-active').removeClass('time-active');
        $('#time_nav a:eq(0)').addClass('time-active');
        $('#orders_lotto li.active').removeClass('active');
        tg.addClass('active');
        //console.log('当前彩种===',tg.attr('lotto'));
        var ps = {type:tg.attr('lotto'),paging:'0',pagesize:'7',status:'-2',begintime:'',endTime:''};
        this.lotteryParams = ps;
        this.getOrders(this.lotteryParams);
    },

    //显示中奖信息
    showzj:function(e){
        if($(e.currentTarget).is(':checked')){
            this.lottoParams.status = '5';//投注成功
            //console.log(this.lottoParams);
        }else{//查不到未支付
            this.lottoParams.status ='-2';
        }
        var that = this;
        that.getOrders(this.lottoParams);
    },

    //投注方式
    getLotteryPlayType:function(lottery,playtype){
        if(lottery=='k3'){
            if(playtype=='101'){
                return '和值';
            }else if(playtype=='102'){
                return '三同号通选';
            }else if(playtype=='103'){
                return '三同号单选';
            }else if(playtype=='104'){
                return '二同号复选';
            }else if(playtype=='105'){
                return '二同号单选';
            }else if(playtype=='106'){
                return '三不同号';
            }else if(playtype=='107'){
                return '二不同号';
            }
        }else if(lottery == 'ssq'|| lottery == '307'||lottery=='30x5'){
            if(playtype == "101"){
                return '单式投注';
            }else if(playtype == '102'){
                return '复式投注'
            }else if(playtype == '103'){
                return '胆拖投注'
            }

        }else if(lottery == '3d'){
            if(playtype=='201'){
                return'直选单式';
            }else if(playtype=='202'){
                return'组3单式';
            }else if(playtype=='203'){
                return'组6单式';
            }else if(playtype=='204'){
                return'直选复式';
            }else if(playtype=='205'){
                return'组3复选';
            }else if(playtype=='206'){
                return'组6复选';
            }else if(playtype=='207'){
                return'直选包点';
            }else if(playtype=='208'){
                return'组三包点';
            }else if(playtype=='209'){
                return'组六包点';
            }else if(playtype=='212'){
                return'组选包点';
            }else if(playtype=='214'){
                return'包号';
            }
        }else if(lottery=='22x5'){
            if(playtype=='101'){
                return'单式投注';
            }else if(playtype=='102'){
                return'复式投注';
            }else if(playtype=='103'){
                return'胆拖投注';
            }else if(playtype=='104'){
                return'好运一单式';
            }else if(playtype=='105'){
                return'好运一复式';
            }else if(playtype=='106'){
                return'好运二单式';
            }else if(playtype=='107'){
                return'好运二复式';
            }else if(playtype=='108'){
                return'好运二胆拖';
            }else if(playtype=='109'){
                return'好运三单式';
            }else if(playtype=='110'){
                return'好运三复式';
            }else if(playtype=='111'){
                return'好运三胆拖';
            }else if(playtype=='112'){
                return'好运四单式';
            }else if(playtype=='113'){
                return'好运四复式';
            }else if(playtype=='114'){
                return'好运四胆拖';
            }
        }
    },

    logout:function(){
        window.location.href='#home';
        lotteryQuery.loginOut(this.user.id,this.user.pwd, function (err,res) {
            if(err){
            }else{
            }
        })
    },

    showmodal:function(e){
        this.bankcardinfo='no_info';
        var that=this;
        lotteryQuery.getcardlist(that.user.id,that.user.pwd, function (err,res) {
            if(!err){
                that.bankcardinfo=res[0];
                //console.log('=====',that.bankcardinfo);
                $('#cztxmodal').modal('show');
                $('#cztxmodal').html(_.template($('#temp_account_center').html())({balance:that.user.balance,card:that.bankcardinfo.cardAccount,bankname:that.bankcardinfo.bankname}));
                var id = '#modal_' + $(e.currentTarget).attr('id');
                $(id).modal({
                    backdrop:'static',
                    show:true
                    }
                );
            }
        });
    },
    hidemodal:function(){
        $('#cztxmodal').modal('hide');
        $('.modal').modal('hide');
    },

    nav:function(e){
        var dt = $(e.currentTarget).attr('dt');
        $('#account_center_navs li.active').removeClass('active');
        $(e.currentTarget).parent('li').addClass('active');
        if(!dt){
            return;
        }
        if(this['get'+dt]){
            $('#account_center_date_nav').empty();
            this['get'+dt]();
        }else{
            if(!$('#account_center_date_nav').text()){
                $('#account_center_date_nav').append('<div class="input-control checkbox float_l account-checkbox"><a class="time-active">最近三月</a></div><div class="input-control checkbox float_l account-checkbox"><a class="" >三个月前</a></div><div class="input-control checkbox float_l account-checkbox"><a class="" >一年之前</a></div>');
            }else{
                $('#account_center_date_nav a:gt(0)').removeClass('time-active');
                $('#account_center_date_nav a:eq(0)').addClass('time-active');
            }
        }
    },
    //未用
    get_begin_time:function(){
        var ti = $('#account_center_date_nav a').index($('#account_center_date_nav a.time-active'));
        var now = new Date();
        if(ti == 1){
            var d = new Date(now.valueOf() - 1000*60*60*24*90);
            return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+ d.getDate();
        }else if(ti == 2){
            return  (now.getFullYear()-1)+'-'+(now.getMonth()+1)+'-'+ now.getDate();
        }
        return '';
    },
    changeback: function () {
        $('#ChangeInfo').modal('hide');
        $('#modal_account_upbankcard').modal('hide');
    },
    hide_modal:function(){
        //$('#paymodal').modal('hide')
        $('.modal').modal('hide');
    },
    closemodal:function(){
        $('#lott_detail').modal('hide');
    },

});
