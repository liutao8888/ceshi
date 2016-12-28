var HelpView=Backbone.View.extend({
    el:$("#content"),
    fs:require('fs'),
    dayinji: require(process.cwd() + '/js_lib/DaYinJi.js'),
    inti:function(type,sub){
        this.type = type;
        this.sub = sub;
        this.pgindex=1;    //当前页
        var isk3Version=process.env.xx_isk3||0;
        if(isk3Version==0){
           this.sub=""
        }
        var temp = _.template($('#temp_help').html());
        if(type == 'lottery' && !sub){
            sub ='ssq';
        }
        var filename = sub ? process.cwd()+'/htmls/help_'+type+'_'+sub+'.html' : process.cwd()+'/htmls/help_'+type+'.html';
        var that = this;
        this.fs.readFile(filename, function (err, data) {
            if(err){

            }else{
                var titles =[];
                var contents =[];
                if (err){
                    //console.log(err);
                }else{
                    var d = data.toString();
                    var ds =  d.split('--@@--');
                    titles = ds[0].split('\n');
                    contents = ds[1].split('--@--');
                }
                $(that.el).html(temp({type:type,sub:sub,titles:titles,contents:contents}));
                if(type == 'lottery'){
                    $('#help_view_sub').show();
                    if(sub=='3d'){
                        $('.help_content').css('overflow-y','scroll');
                    }else{
                        $('.help_content').css('overflow-y','hidden');
                    }
                }else{
                    $('#help_view_sub').hide();
                    $('.help_content').css('overflow-y','hidden');
                }
                that.showpages();

            }

        });
    },

    showpages: function() {//重写窗体加载的事件
        var pages = document.getElementById("pages");         //获取翻页层
        pages.innerHTML += "<a href=\"javascript:void 0;\" id='pagepre'>上一页</a>  <a href=\"javascript:void 0;\" id='pagenext'>下一页</a>"
    },

    showPage: function (pageINdex) {
        var obj = document.getElementById("frameContent");
        console.log(pageINdex-1,obj.offsetHeight)
        obj.scrollTop=(pageINdex-1)*parseInt(obj.offsetHeight);                                                                  //根据高度，输出指定的页
        this.pgindex=pageINdex;
    },
    gotopage:function (value){
        var that=this;
        try{
            value=="-1"?that.showPage(that.pgindex-1):that.showPage(that.pgindex+1);
        }catch(e){

        }
    },
    events:{
        'click #help_back':'back',
        'click #help_sub_nav a':'nav_help',
        'click #checkIn':'show_checkin_vali',
        'click #checkein_m_step1_ok':'show_in_id',
        'click #checkein_m_step1_show_p':'show_p',
        'click #checkein_m_step_p_ok':'update_p',
        'focus #check_vali_password':'show_key',
        'click #btn_check_vali_password':'login',
        'click #shutdown_win':'shutdown_win',
        'click #restart_win':'restart_win',
        'click #showanimpanel':'showanimpanel',
        'click #btn_close_panel':'btn_close_panel',
        'click #btn_open_panel':'btn_open_panel',
		'click #changepasswd':'showchangepwd',
		'click #changepassword':'changepassword',
		'click #show_sales':'show_sales',
        'click .salesearch':'reloadsales',
        'focus #guanji_time1,#guanji_time2,#oldpassword,#newpassword':'show_keyboard',
        'click #dismiss_checkmodal,#dismiss_checkmodal_3,#dismiss_checkmodal_2,#cpback,#sfback':'dismiss_checkmodal',
        'click #test_print':'test_print',
        'click #pagepre':'up',
        'click #pagenext':'next',
//      'click #printAgain':'printAgain'
    },
    show_key:function(e){
        $(e.currentTarget).numberKeyboard();
    },
    up: function () {
        this.gotopage(-1);
    },
    next: function () {
        this.gotopage(this.pgindex);
    },
    //显示动态开奖公开模板显示管理
    showanimpanel: function () {
        $('#checkInModal').modal('hide');
     $('#Dlotteryannouncement').modal('show');
    },
    //打印测试
    test_print: function () {
        this.dayinji.test_print();
    },
//  printAgain:function(){
//  	alert(11);
//  }

    //关闭
    btn_close_panel:function () {
        var fs = require('fs');
        fs.writeFile(process.execPath.substr(0,process.execPath.lastIndexOf('\\') + 1)+ '\\setting.txt',1, function (err) {
        });
        $('#home_notes').addClass("hidden");
        $('#Dlotteryannouncement').modal('hide');
        window.location.href="#home";
    },
    //开启
    btn_open_panel:function () {
        var fs = require('fs');
        fs.writeFile(process.execPath.substr(0,process.execPath.lastIndexOf('\\') + 1)+ '\\setting.txt',0, function (err) {
        });
        $('#home_notes').removeClass("hidden");
        $('#Dlotteryannouncement').modal('hide');

        window.location.href="#home";
    },
    show_keyboard:function(e){
        $(e.currentTarget).numberKeyboard();
    },
    shutdown_win:function(e){
        var exec = require('child_process').exec;
        exec('shutdown -s -f -t 0',function(err,stdout,stdrr){

        });
    },
    restart_win:function(e){
        var exec = require('child_process').exec;
        exec('shutdown -r -f -t 0',function(err,stdout,stdrr){

        });
    },
    sub_guanji:function(e){
        $('#guanji_info').empty();
        var t1 = $('#guanji_time1').val();
        var t2 = $('#guanji_time2').val();
        if(!t1 || t1.length < 1 || t1.length > 2 || parseInt(t1) <0 || parseInt(t1) > 23){
            $('#guanji_info').text('请输入正确的时间（小时）');
            return false;
        }
        if(!t2 || t2.length < 1 || t2.length > 2 || parseInt(t2) < 0 || parseInt(t2) > 59){
            $('#guanji_info').text('请输入正确的时间（分钟）');
            return false;
        }
        DATASETTINGS.guanji_enable = $('#guanji_enable').val() == '1' ? true :false;
        DATASETTINGS.guanji_time = t1 + ':' + t2;
        var s = JSON.stringify(DATASETTINGS);
        var fs = require('fs');
        var path = process.execPath.substr(0,process.execPath.lastIndexOf('\\') + 1)+'yl_dll\\config.js';
        fs.writeFile(path,s,function(err){
            if(err){
                $('#guanji_info').text('保存失败，请重试');
            }else{
                if(DATASETTINGS.shutdown){
                    clearTimeout(DATASETTINGS.shutdown);
                }
                if(DATASETTINGS.guanji_enable){
                    var d_n  = new Date();
                    var d_at = Date.parse(d_n.getFullYear() + '-' + ( d_n.getMonth() + 1) + '-'+d_n.getDate() + ' '+ DATASETTINGS.guanji_time);
                    if(d_at > d_n){
                        DATASETTINGS.shutdown = setTimeout(function(){
                                var exec = require('child_process').exec;
                                exec('shutdown -s -f -t 30',function(err,stdout,stdrr){ });
                            },
                                d_at - d_n);
                        $('#guanji_info').text('保存成功');
                    }else{
                        $('#guanji_info').text('设置自动关机失败，关机时间必须大于当前时间');
                    }
                }else{
                    $('#guanji_info').text('保存成功');
                }
            }
        });

    },
	lotteryQuery:require(process.cwd()+'/js_lib/LotteryQuery.js'),
	showchangepwd:function(){
		$('#changepwd').show();
		$('#checkein_m_step2,#checkein_m_step3,#checkein_m_step_p,#showSaleInfo').hide();
	},
	showchangepwd:function(){
		$('#changepwd').show();
		$('#checkein_m_step2,#checkein_m_step3,#checkein_m_step_p,#showSaleInfo').hide();
	},
	changepassword:function(){
		//$('#oldpassword').removeClass('has_error');
		//$('#oldpassword').removeClass('has_error');
		if(!$('#oldpassword').val()||$('#oldpassword').val().length<6){
			$('.errinfo').text('旧密码格式不正确，请输入正确密码');
			$('#oldpassword').addClass('has_error');
		}else if(!$('#newpassword').val()||$('#oldpassword').val().length<6){
			$('.errinfo').text('新密码格式不正确，请输入正确密码');
			$('#oldpassword').addClass('has_error');
		}
		lotteryQuery.adminChangePassword($('#oldpassword').val(),$('#newpassword').val(),function(err,rs){
			if(!rs){
				$('.errinfo').text('修改失败，请联系管理员');
			}else{
				if(rs!='0000'){
					$('.errinfo').text('修改失败，请联系管理员');
				}else{
					$('.errinfo').text('修改成功，请记住新密码：'+$('#newpassword').val());
				}
			}
		});
	},
	show_checkin_vali:function(){
		$('#check_vali_password').val('');
		$('#checkein_m_step2,#checkein_m_step3,#checkein_m_step_p,#showSaleInfo').hide();
		$('#checkein_m_step1').show();
		$('#checkInModal').modal('show');
	},
	lotteryQuery:require(process.cwd()+'/js_lib/LotteryQuery.js'),
    reloadsales: function (e) {
        var btime=$('.btime').val()||null;
        var etime=$('.etime').val()||null;
        console.log('----',btime,etime);
        this.show_sales(e,btime,etime);
    },
	//显示销量
	show_sales:function(e,btime,etime){
		$('#showSaleInfo').show();
        if(!btime){
            btime="";
        }
        if(!etime) {
            etime="";
        }
		lotteryQuery.getSales(btime,etime,function (err, sales) {
			if (err) {
				//console.log(err);
			} else {
				var gettype = function(LotteryType) {
					if (LotteryType == "ssq") {
						return '双色球';
					} else if (LotteryType == "3d") {
						return '3D';
					} else if (LotteryType == "307") {
						return '七乐彩';
					} else if (LotteryType == "22x5") {
						return '22选5';
					} else if (LotteryType == "k3") {
						return '快三';
					} else if (LotteryType == "all") {
						return '统计';
					}
				};
				var time=new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
				this.interTimer = setInterval(function(){
					$('.saleinfotime h5').html('当前时间是:'+time);
				},1000);
				var temp = _.template($('#temp_sales_info').html());
				$('#showSaleInfo').html(temp({m:sales,gettype:gettype,time:time}));
				$('#checkein_m_step1,#checkein_m_step2,#checkein_m_step3').hide();
                $('.btime').val(btime);
                $('.etime').val(etime);
			}
		});

	},
	/**
	 * 管理员登陆接口
	 */
	login:function(){
        //后台请求md5解密密码明文返回true/false
        lotteryQuery.adminLogin($('#check_vali_password').val(),function(err,result){
			if(!err){
				if(result=='0000'){
					//this.show_checkIn();
					$('#checkein_m_step2').show();
					$('#check_in_client_id').html('终端机号：'+process.env.xx_clientid);
					$('#checkin_stp_info').empty();
					$('#checkein_m_step1,#checkein_m_step3,#checkein_m_step_p,#changepwd').hide();

				}
			}
        });
	},
	show_guanji:function(){
        $('#checkein_m_step_guanji').show();
        $('#checkein_m_step2,#checkein_m_step3,#checkein_m_step_p').hide();
        if(DATASETTINGS.guanji_enable ){
            $('#guanji_enable option:eq(1)').prop('selected',true);
        }else{
            $('#guanji_enable option:eq(0)').prop('selected',true);
        }
        var guanji_t = DATASETTINGS.guanji_time.split(':');
        $('#guanji_time1').val(guanji_t[0]);
        $('#guanji_time2').val(guanji_t[1]);
        $('#guanji_info').empty();
    },
    show_checkIn:function(){
        $('#checkein_m_step1,#checkein_m_step3,#checkein_m_step_p,#showSaleInfo').hide();
        $('#checkein_m_step2').show();
        $('#check_in_client_id').html('终端机号：'+process.env.xx_clientid);
        $('#checkin_stp_info').empty();
    },
    show_in_id:function(){
        var type = $('[name="checkin_s1_ch"]:checked').val();
        $('#checkein_m_step1,#checkein_m_step2,#checkein_m_step_p,#showSaleInfo').hide();
        $('#checkin_result').empty();
        $('#checkein_m_step3').show();
    },
    show_p:function(){
        $('#checkein_m_step1,#checkein_m_step2,#checkein_m_step3,#showSaleInfo').hide();
        $('#checkein_m_step_p').show();
    },
    update_p:function(e){
        var btn = $(e.currentTarget);
        btn.button('loading');
        var l = require(process.cwd() +'/js_lib/LotteryQuery');
        l.updatePapers(800,function(err,result){
            btn.button('reset');
            if(!err){
                $('#checkin_stp_info').text('更新成功');
            } else{
                $('#checkin_stp_info').text('更新失败了，请重试');
            }
        });

    },
    dismiss_checkmodal:function(){
        $('#checkInModal').modal('hide');
		$('#showSaleInfo,#changepwd').hide();
    },
    nav_help:function(e){
        var index = $('#help_sub_nav a').index($(e.currentTarget));
        this.scrollindex=index;//3d滚动条是否显示
        e.preventDefault();
        e.stopPropagation();
        var tg = $('#help_content_contains .help_content:eq('+index+')');
        $('#help_content_contains .help_content').hide();
        $('#pages').empty();
        if(this.scrollindex==0){
            this.showpages();
        }
        $(tg).show();

    },
    back:function(){
        if(this.type == 'lottery'){
            if(!this.sub){
                window.location.href='#home';
            }else{
                window.location.href='#lottery/'+this.sub;
            }
        }else if(this.type == 'jiaofei'){
//            if(!this.sub){
//                window.location.href='#servicecenter';
//            }else{
//                window.location.href='#service/'+this.sub;
//            }
        }else{
            window.location.href='#home';
        }
    }
});