var ZouShiView = Backbone.View.extend({
    el:$("#content"),
    inti:function(lottery){
        //this.paging=0;
        var isk3Version=process.env.xx_isk3||0;
        this.lotte=lottery;
        var temp = _.template($('#temp_zoushi').html())
        $(this.el).html(temp({lottery:lottery}));
        this.simple_trend(0,lottery);
        if(isk3Version==0){
            $('#isk3').addClass('hidden');
        }
    },
    events:{
        'click #trend_pages li':'pageNav'
    },
    //上一页
    pageNav: function (e) {
        //获取当前页数
        var tg = $(e.currentTarget);
        var pi = $('#page_info').text().split('/');
        var pindex = +pi[0]-1;
        var tpage = +pi[1];

        var methods = $('#trend_pages').attr('req');
        if(tg.hasClass('prev') && (pindex - 1 >= 0)){
            this.paging=(pindex-1);
            this[methods](this.paging,this.lotte);
        }else if(tg.hasClass('next') && (pindex + 1 <= tpage)){
            this.paging=(pindex+1);
            this[methods](this.paging,this.lotte);
        }
    },
    simple_trend:function(paging,lottery){
        var fs = require('fs');
        fs.readFile(process.cwd()+'/htmls/temp/trend_simple_'+lottery+'.html',{},function(err,data){
            if(err){
                //console.log(err);
            }else{
                var round_infos =[];
                lotteryQuery.getTrend(lottery,'20',paging,'20',function(err,returns,pageInfo){
                    console.log(returns,pageInfo);
                    //console.log('走势图当前页===',paging,lottery,returns,pageInfo);
                    if(err){
                        //console.log(err);
                    } else{
                        var temp = _.template(data.toString());
                        if(lottery == 'ssq' || lottery =='307' || lottery == '22x5'||lottery=='30x5'){
                            _.each(returns,function(item,i){
                                var reds = [];
                                var blues = [];
                                for(var attr in item){
                                    if(attr.substr(0,1) == 'r'){
                                        reds.push({name:attr.substr(1),value:item[attr]});
                                    }else if(attr.substr(0,1) == 'b'){
                                        blues.push({name:attr.substr(1),value:item[attr]});
                                    }
                                }
                                round_infos.push({
                                    round:item.qihao,
                                    balls:{
                                        reds: _.sortBy(reds, function(ball){ return parseInt(ball.name); }),
                                        blues:_.sortBy(blues, function(ball){ return parseInt(ball.name); })
                                    }});
                            });
                            $('#trend_contains').html(temp({m:round_infos}));
                        }else if(lottery == '3d'||lottery=='k3'){
                            _.each(returns,function(item,i){
                                var bai = [];
                                var shi = [];
                                var ge = []
                                for(var attr in item){
                                    if(lottery == '3d'){
                                        if(attr.substr(0,1) == 'b'){
                                            bai.push({name:attr.substr(1).substr(1,1),value:item[attr]});
                                        }else if(attr.substr(0,1) == 's'){
                                            shi.push({name:attr.substr(1).substr(1,1),value:item[attr]});
                                        }else if(attr.substr(0,1) == 'g'){
                                            ge.push({name:attr.substr(1).substr(1,1),value:item[attr]});
                                        }
                                    }else{
                                        if(attr.substr(0,1) == 'b'){
                                            bai.push({name:attr.substr(1),value:item[attr]});
                                        }else if(attr.substr(0,1) == 's'){
                                            shi.push({name:attr.substr(1),value:item[attr]});
                                        }else if(attr.substr(0,1) == 'g'){
                                            ge.push({name:attr.substr(1),value:item[attr]});
                                        }
                                    }

                                }
                                round_infos.push({
                                    round:item.qihao,
                                    balls:{
                                        bai: _.sortBy(bai, function(ball){ return parseInt(ball.name); }),
                                        shi:_.sortBy(shi, function(ball){ return parseInt(ball.name); }),
                                        ge:_.sortBy(ge, function(ball){ return parseInt(ball.name); })
                                    }});
                            })
                            $('#trend_contains').html(temp({m:round_infos}));

                        }
                        var tmp= _.template($('#temp_account_pages').html());

                        $('#trend_pages').html(tmp({currentpage:parseInt(pageInfo.currentPage)+1,total_pages:pageInfo.total_pages}));
                    }
                });
            }

        });

    }
});
