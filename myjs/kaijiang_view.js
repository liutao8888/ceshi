var KaiJiangiView = Backbone.View.extend({
    el:$("#content"),
    getWeek:function(day){
      switch (day){
          case 1 :
              return "周一";
          case 2:
              return "周二";
          case 3 :
              return "周三";
          case 4:
              return "周四";
          case 5 :
              return "周五";
          case 6:
              return "周六";
          case 0 :
              return "周日";
      }
    },
    getKaiJiang:function(day){
        switch (day){
            case 1 :
                return "3D 7乐彩 30选5";
            case 2:
                return "双色球 3D 30选5";
            case 3 :
                return "3D 7乐彩 30选5";
            case 4:
                return "双色球 3D 30选5";
            case 5 :
                return "7乐彩 3D 30选5";
            case 6:
                return "3D 30选5";
            case 0 :
                return "双色球 3D 30选5";
        }
    },
    inti:function(lottery){
        var isk3Version=process.env.xx_isk3||0;
        var that = this;
        if(!lottery){
            $(this.el).html($('#temp_kaijiang').html());
            lotteryQuery.getAllKaiJiang(function(err,info){
                if(err){

                }else{
                    var temp = _.template($('#temp_kaijiang_info').html());
                    //console.log(info);
                    for(var i =0;i<info.length;i++){
                        var m = info[i];
                        var balls = info[i].res.split('#');
                        m.reds = balls[0].split(',').sort();
                        m.blue = balls.length > 1 ? balls[1] :null;
                        info[i].lottery = info[i].type;
                        if(info[i].type == "ssq"){
                            m.lotteryName = "双色球";
                        }else if(info[i].type == "3d"){
                            m.lotteryName = "3D";
                        }else if(info[i].type == "307"){
                            m.lotteryName = "七乐彩";
                        }else if(info[i].type == "30x5"){
                            m.lotteryName = "30选5";
                        //}else if(info[i].type == '22x5'){
                        //    m.lotteryName = '22选5'
                        }else if(info[i].type=='k3'){
                            if(isk3Version==0){
                                m[i]='';
                            }else{
                                m.lotteryName='快三';
                            }

                        }
                        console.log(m);
                        if(m.lotteryName){
                            $(that.el).append(temp(m));
                        }
                    }
                }
                $('.loading').hide();
            });
        }else{
            this.lottery = lottery;
            var temp = _.template($('#temp_kaijiang_detail').html());
            $(this.el).html(temp({lottery:lottery}));
            var that = this;
            lotteryQuery.getKaiJiangByLottery(lottery,function(err,info){
                if(err){

                }else{
                    for(var i=0;i<info.length;i++){
                        $('#up-down-js').append('<li class="stick"><a href="#" kj="'+ info[i].res + '">'+info[i].qihao+'</a></li>');
                    }
                    $('#up-down-js li:eq(0)').removeClass('stick').addClass('active');
                    that.get_round_kj(info[0].type,info[0].qihao,info[0].res);
                }
            });
        }
        var d = new Date();
        var dinfo = d.getFullYear()+'-'+ (d.getMonth()+ 1) + '-' + d.getDate();
        dinfo += '（' + this.getWeek(d.getDay()) +'）';
        if(isk3Version==0){
            $('#isk3').addClass('hidden');
        }
        $('#date_info').text(dinfo);
        $('#date_kaijiang').text(this.getKaiJiang(d.getDay()));
    },
    events:{
        'click #up-down-js a':'get_kaijiang_round',
        'click  .kjxq-up':'round_up',
        'click  .kjxq-down':'round_down'
    },

    round_up:function(){
        $('#up-down-js').css({top:'0px',bottom:''});
    },
    round_down:function(){
        $('#up-down-js').css({top:'',bottom:'0px'});
    },
    get_round_kj:function(lottery,round,balls){
        lotteryQuery.getKaijiangDetail(lottery,round,function(err,detail){
            //console.log(err,detail);
            if(err){
                //alert('获得开奖详情失败');
            }else{
                //console.log(detail);
                //var m = {
                //    lottery:lottery,
                //    lotteryName:lottery == 'ssq'?'双色球':lottery =='3d'? '3D': lottery =='307' ? '七乐彩' : lottery=='22x5'?'22选5':'快三',
                //    issueNumber:round,
                //    reds:balls.split('#')[0].split(',').sort(),
                //    blue:balls.split('#').length > 0 ?balls.split('#')[1]:null,
                //    kjs:detail
                //}
                var m = {
                    lottery:lottery,
                    lotteryName:lottery == 'ssq'?'双色球':lottery =='3d'? '3D':lottery=='307'?'七乐彩':lottery=='22x5'?'22选5':'快三',
                    issueNumber:round,
                    reds:balls.split('#')[0].split(','),
                    blue:balls.split('#').length > 0 ? balls.split('#')[1] :null,
                    kjs:detail,
                    //kjsj:time,
                    kj3d:{
                        '1':'单选',
                        '2':'组选3',
                        '3':'组选6',
                        '4':'1D',
                        '5':'2D',
                        '6':'通选一',
                        '7':'通选二',
                        '8':'和数选 0,27',
                        '9':'和数选 1,26',
                        '10':'和数选 2,25',
                        '11':'和数选 3,24',
                        '12':'和数选 4,23',
                        '13':'和数选 5,22',
                        '14':'和数选 6,21',
                        '15':'和数选 7,20',
                        '16':'和数选 8,19',
                        '17':'和数选 9,18',
                        '18':'和数选 10,17',
                        '19':'和数选 11,16',
                        '20':'和数选 12,15',
                        '21':'和数选 13,14',
                        '22':'猜1D中1',
                        '23':'猜1D中2',
                        '24':'猜1D中3',
                        '25':'猜2D两同号',
                        '26':'猜2D两不同号',
                        '27':'包选3全中',
                        '28':'包选3组中',
                        '29':'包选6全中',
                        '30':'包选6组中',
                        '31':'猜大小',
                        '32':'猜三同',
                        '33':'拖拉机',
                        '34':'猜奇偶'

                    }
                };

                var temp = _.template($('#temp_kaijiang_detail_info').html());
                //console.log('k3zoushi===',m);
                if(m.lottery=='ssq'){
                    detail.splice(6,2);
                }
                $('#kj_detail_info_inner').html(temp(m));
            }
            $('.loading').hide();
        });
    },
    get_kaijiang_round:function(e){
        $('.loading').show();
        e.stopPropagation();
        e.preventDefault();
        $('#up-down-js li.active').removeClass('active').addClass('stick');
        $(e.currentTarget).parent().removeClass('stick').addClass('active');
        var round = $(e.currentTarget).text();
        var balls = $(e.currentTarget).attr('kj');
        this.get_round_kj(this.lottery,round,balls);
    }
});
