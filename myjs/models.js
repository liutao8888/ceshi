var LotteryTicket = Backbone.Model.extend({
    defaults:{
        'lottery_type':'',
        'lottery_name':'',
        'play_type_code':'',
        'play_type_name':'',
        'beishu':1,
        'zhuihao':1,
        'issue':'',
        'issue_end':'',
        'nums':{}
    },

    validate: function(attrs, options) {
        //console.log('注码格式',attrs);
        if (attrs.lottery_type == 'ssq') {
            if(attrs.play_type_code == '101'){
                if((attrs.nums.red && attrs.nums.red.length > 6) || (attrs.nums.blue && attrs.nums.blue.length > 1)){
                    return "双色球单式投注只能选择6个红色和一个蓝球";
                }
            }else if(attrs.play_type_code == '102'){
                if(attrs.nums.red && attrs.nums.red.length > 16){
                    return "双色球复式投注最多只能选择16个红球";
                }
            }else if(attrs.play_type_code == '103'){
                if(attrs.nums.dan && attrs.nums.dan.length > 5){
                    return "双色球胆拖投注，胆码最多只能选择5个";
                }
                if(attrs.nums.tuo && attrs.nums.tuo.length > 15){
                    return "双色球胆拖投注拖码最多只能选择15个红球";
                }
                if(attrs.nums.dan && attrs.nums.tuo  && (attrs.nums.dan.length + attrs.nums.tuo.length) > 16 ){
                    return "双色球胆拖投注胆码和拖码最多只能选择16个红球";
                }
                if(attrs.nums.dan && attrs.nums.tuo){
                    for(var i =0;i<attrs.nums.tuo.length;i++){
                        if(attrs.nums.dan.indexOf(attrs.nums.tuo[i]) >=0){
                            return '胆码和拖码不能重复';
                        }
                    }
                }
            }
        }else if(attrs.lottery_type == '307'){
            if(attrs.play_type_code == '101'){
                if(attrs.nums.red && attrs.nums.red.length > 7){
                    return "七乐彩单式投注只能选择7个球";
                }
            }else if(attrs.play_type_code == '102'){
                if(attrs.nums.red && attrs.nums.red.length > 20){
                    return "七乐彩复式投注最多选择20个球";
                }
            }else if(attrs.play_type_code == '103'){
                if(attrs.nums.dan && attrs.nums.dan.length > 6){
                    return '七乐彩胆拖的胆码最多选择6个';
                }
                if(attrs.nums.dan && attrs.nums.tuo && (attrs.nums.dan.length + attrs.nums.tuo.length) >  20){
                    return '七乐彩胆拖的胆码和拖码之和最多选择20个';
                }
                if(attrs.nums.dan && attrs.nums.tuo){
                    for(var i =0;i<attrs.nums.tuo.length;i++){
                        if(attrs.nums.dan.indexOf(attrs.nums.tuo[i]) >=0){
                            return '胆码和拖码不能重复';
                        }
                    }
                }
            }
        }else if(attrs.lottery_type=='3d'){
            if(attrs.play_type_code=='201'){
                if(attrs.nums.bai&&attrs.nums.bai.length>1){
                    return "3D直选单式百位只能选择一个号码";
                }
                if(attrs.nums.shi&&attrs.nums.shi.length>1){
                    return "3D直选单式十位只能选择一个号码";
                }
                if(attrs.nums.ge&&attrs.nums.ge.length>1){
                    return "3D直选单式个位只能选择一个号码";
                }
            }else if(attrs.play_type_code=='202'){
                if(attrs.nums.hao1 &&attrs.nums.hao1.length>1){
                    return "3D组3单式百位只能选择一个号码";
                }
                if(attrs.nums.hao2&&attrs.nums.hao2.length>1){
                    return "3D组3单式十位只能选择一个号码";
                }
                if(attrs.nums.hao3&&attrs.nums.hao3.length>1){
                    return "3D组3单式个位只能选择一个号码";
                }
                if(attrs.nums.hao1&&attrs.nums.hao2&&attrs.nums.hao3&&attrs.nums.hao1.length>0&&attrs.nums.hao2.length>0&&attrs.nums.hao3.length>0&&attrs.nums.hao1[0]==attrs.nums.hao2[0] && attrs.nums.hao2[0]==attrs.nums.hao3[0]){
                    return "3D组3单式三位不能相同";
                }
                if(attrs.nums.hao1&&attrs.nums.hao2&&attrs.nums.hao3&&attrs.nums.hao1.length>0&&attrs.nums.hao2.length>0&&attrs.nums.hao3.length>0&&attrs.nums.hao1[0]!=attrs.nums.hao2[0] && attrs.nums.hao2[0]!=attrs.nums.hao3[0] && attrs.nums.hao1[0]!=attrs.nums.hao3[0]){
                    return "3D组3单式三位中两位必需相同";
                }
            }else if(attrs.play_type_code=='203'){
                if(attrs.nums.hao1&&attrs.nums.hao1.length>1){
                    return "3D组6单式百位只能选择一个号码";
                }
                if(attrs.nums.hao2&&attrs.nums.hao2.length>1){
                    return "3D组6单式十位只能选择一个号码";
                }
                if(attrs.nums.hao3&&attrs.nums.hao3.length>1){
                    return "3D组6单式个位只能选择一个号码";
                }
                if(attrs.nums.hao1&&attrs.nums.hao2&&attrs.nums.hao3&&attrs.nums.hao1.length>0&&attrs.nums.hao2.length>0&&attrs.nums.hao3.length>0&&(attrs.nums.hao1[0]==attrs.nums.hao2[0] || attrs.nums.hao2[0]==attrs.nums.hao3[0] || attrs.nums.hao1[0]==attrs.nums.hao3[0])){
                    return "3D组6单式任意两位不能相同";
                }
            }else if(attrs.play_type_code=='207'){
                if(attrs.nums.zhxbd&&attrs.nums.zhxbd.length>1){
                    return "3D直选包点只能选择一个号码";
                }
            }else if(attrs.play_type_code=='208'){
                if(attrs.nums.z3bd&&attrs.nums.z3bd.length>1){
                    return "3D组三包点只能选择一个号码";
                }
            }else if(attrs.play_type_code=='209'){
                if(attrs.nums.z6bd&&attrs.nums.z6bd.length>1){
                    return "3D组六包点只能选择一个号码";
                }
            }else if(attrs.play_type_code=='212'){
                if(attrs.nums.zxbd&&attrs.nums.zxbd.length>1){
                    return "3D组选包点只能选择一个号码";
                }
            }else if(attrs.play_type_code=='213'){
                if(attrs.nums.zxbd1&&attrs.nums.zxbd1.length>1){
                    alert(attrs.nums.zxbd1);
                    return "3D组选包胆一只能选择一个号码";
                }
                if(attrs.nums.zxbd2&&attrs.nums.zxbd2.length>1){
                    return "3D组选包胆二只能选择一个号码";
                }
            }else if(attrs.play_type_code=='214'){
                if(attrs.nums.bai && attrs.nums.bai.length>1){
                    return "3D包号百位最多选择一个号码";
                }
                if(attrs.nums.shi&&attrs.nums.shi.length>1){
                    return "3D包号十位最多选择一个号码";
                }
                if(attrs.nums.ge&&attrs.nums.ge.length>1){
                    return "3D包号个位最多选择一个号码";
                }
                if(attrs.nums.bai&&attrs.nums.shi&&attrs.nums.ge&&attrs.nums.bai.length+attrs.nums.shi.length+attrs.nums.ge.length>=3){
                    return "3D包号百十个位不能全选";
                }
            }
        }else if(attrs.lottery_type == '22x5') {
            if (attrs.play_type_code == '101') {
                if (attrs.nums.red && attrs.nums.red.length > 5) {
                    return "22选5单式投注只能选择5个号码";
                }
            } else if (attrs.play_type_code == '102') {
                if (attrs.nums.red && attrs.nums.red.length > 14) {
                    return "22选5复式投注最多选择14个号码";
                }
            } else if (attrs.play_type_code == '103') {
                if (attrs.nums.dan && attrs.nums.dan.length > 4) {
                    return '22x5胆拖的胆码最多选择4个';
                }
                if (attrs.nums.dan && attrs.nums.tuo) {
                    for (var i = 0; i < attrs.nums.tuo.length; i++) {
                        if (attrs.nums.dan.indexOf(attrs.nums.tuo[i]) >= 0) {
                            return '胆码和拖码不能重复';
                        }
                    }
                }
            } else if (attrs.play_type_code == '104') {
                if (attrs.nums.red && attrs.nums.red.length > 1) {
                    return "22选5好运一单式只能选择1个号码";
                }
            } else if (attrs.play_type_code == '105') {
                if (attrs.nums.red && attrs.nums.red.length > 16) {
                    return "22选5好运一复式最多选择16个号码";
                }
            } else if (attrs.play_type_code == '106') {
                if (attrs.nums.red && attrs.nums.red.length > 2) {
                    return "22选5好运二单式只能选择2个号码";
                }
            } else if (attrs.play_type_code == '107') {
                if (attrs.nums.red && attrs.nums.red.length > 16) {
                    return "22选5好运二复式最多选择16个号码";
                }
            } else if (attrs.play_type_code == '108') {
                if (attrs.nums.dan && attrs.nums.dan.length > 1) {
                    return '22选5好运二胆拖的胆码最多选择1个';
                }
                if (attrs.nums.dan && attrs.nums.tuo) {
                    for (var i = 0; i < attrs.nums.tuo.length; i++) {
                        if (attrs.nums.dan.indexOf(attrs.nums.tuo[i]) >= 0) {
                            return '胆码和拖码不能重复';
                        }
                    }
                }
            } else if (attrs.play_type_code == '109') {
                if (attrs.nums.red && attrs.nums.red.length > 3) {
                    return "22选5好运三单式只能选择3个号码";
                }
            } else if (attrs.play_type_code == '110') {
                if (attrs.nums.red && attrs.nums.red.length > 16) {
                    return "22选5好运三复式最多选择16个号码";
                }
            } else if (attrs.play_type_code == '111') {
                if (attrs.nums.dan && attrs.nums.dan.length > 2) {
                    return '22选5好运三胆拖的胆码最多选择2个';
                }
                if (attrs.nums.dan && attrs.nums.tuo) {
                    for (var i = 0; i < attrs.nums.tuo.length; i++) {
                        if (attrs.nums.dan.indexOf(attrs.nums.tuo[i]) >= 0) {
                            return '胆码和拖码不能重复';
                        }
                    }
                }
            } else if (attrs.play_type_code == '112') {
                if (attrs.nums.red && attrs.nums.red.length > 4) {
                    return "22选5好运四单式只能选择4个号码";
                }
            } else if (attrs.play_type_code == '113') {
                if (attrs.nums.red && attrs.nums.red.length > 16) {
                    return "22选5好运四复式最多选择16个号码";
                }
            } else if (attrs.play_type_code == '114') {
                if (attrs.nums.dan && attrs.nums.dan.length > 3) {
                    return '22选5好运四胆拖的胆码最多选择3个';
                }
                if (attrs.nums.dan && attrs.nums.tuo) {
                    for (var i = 0; i < attrs.nums.tuo.length; i++) {
                        if (attrs.nums.dan.indexOf(attrs.nums.tuo[i]) >= 0) {
                            return '胆码和拖码不能重复';
                        }
                    }
                }
            }
        }else if(attrs.lottery_type=='30x5'){
            if(attrs.play_type_code == '101'){
                if(attrs.nums.red && attrs.nums.red.length > 5){
                    return "30选5单式投注只能选择5个球";
                }
            }else if(attrs.play_type_code == '102'){
                if(attrs.nums.red && attrs.nums.red.length > 20){
                    return "30选5复式投注最多选择20个球";
                }
            }else if(attrs.play_type_code == '103'){
                if(attrs.nums.dan && attrs.nums.dan.length > 4){
                    return '30选5胆拖的胆码最多选择4个';
                }
                if(attrs.nums.dan && attrs.nums.tuo && (attrs.nums.dan.length + attrs.nums.tuo.length) >  20){
                    return '30选5胆拖的胆码和拖码之和最多选择20个';
                }
                if(attrs.nums.dan && attrs.nums.tuo){
                    for(var i =0;i<attrs.nums.tuo.length;i++){
                        if(attrs.nums.dan.indexOf(attrs.nums.tuo[i]) >=0){
                            return '胆码和拖码不能重复';
                        }
                    }
                }
            }

        }else if(attrs.lottery_type=='k3'){
            if(attrs.play_type_code=='101'){
                if(attrs.nums.red && attrs.nums.red.length>1){
                    return "快三和值只能选择1个号码";
                }
            }else if(attrs.play_type_code=='102'){
                if(attrs.nums.red && attrs.nums.red.length>1){
                    return "快三三同号通选只能选择1个号码";
                }
            }else if(attrs.play_type_code=='103'){
                if(attrs.nums.red && attrs.nums.red.length>1){
                    return "快三三同号单选只能选择1个号码";
                }
            }else if(attrs.play_type_code=='104'){
                if(attrs.nums.red && attrs.nums.red.length>1){
                    return "快三三不同号只能选择1个号码";
                }
            }else if(attrs.play_type_code=='105'){
                if(attrs.nums.red && attrs.nums.red.length>1){
                    return "快三三连号通选只能选择1个号码";
                }
            }else if(attrs.play_type_code=='106'){
                if(attrs.nums.red && attrs.nums.red.length>1){
                    return "快三二同号复选只能选择1个号码";
                }
            }else if(attrs.play_type_code=='107'){
                if(attrs.nums.red && attrs.nums.red.length>1){
                    return "快三二同号单选只能选择1个号码";
                }
            }else if(attrs.play_type_code=='108'){
                if(attrs.nums.red && attrs.nums.red.length>1){
                    return "快三二不同号只能选择1个号码";
                }
            }else if(attrs.play_type_code=='109'){
                if(attrs.nums.hao1&&attrs.nums.hao1.length>1){
                    return "3D直选单式百位只能选择一个号码";
                }
                if(attrs.nums.hao2&&attrs.nums.hao2.length>1){
                    return "3D直选单式十位只能选择一个号码";
                }
                if(attrs.nums.hao3&&attrs.nums.hao3.length>1){
                    return "3D直选单式个位只能选择一个号码";
                }
            }
        }
    },
    //num1 > num2 排列
    countCv:function  (num1,num2){
        var sum1 = num1;
        var sum2 = num2;
        while (num2 > 1) {
            num1--;
            num2--;
            sum1 *= num1;
            sum2 *= num2;
        }
        return sum1 / sum2;
    },
    countZ3Bd:function(num){
        var sum=0;
        for(var i=0;i<10;i++){
            for(var j=0;j<10;j++){
                var num1=i*2+j;
                if(num1==num && i !=j){
                    sum+=1;
                }
            }
        }
        return sum;
    },
    countZ6Bd:function(num){
        var sum=0;
        for(var i=0;i<10;i++){
            for(var j=i+1;j<10;j++){
                for(var k=j+1;k<10;k++){
                    var num1=i+j+k;
                    if(num1==num ){
                        sum+=1;
                    }
                }
            }
        }
        return sum;
    },
    countZxBd:function(num){
        var sum=0;
        for(var i=0;i<10;i++){
            for(var j=0;j<10;j++){
                for(var k=0;k<10;k++){
                    var num1=i+j+k;
                    if(num1==num ){
                        sum+=1;
                    }
                }
            }
        }
        return sum;
    },
    countZuxBd:function(num){
        var sum=0;
        for(var i=0;i<10;i++){
            for(var j=i;j<10;j++){
                for(var k=j;k<10;k++){
                    var num1=i+j+k;
                    if(num1==num ){
                        sum+=1;
                    }
                }
            }
        }
        return sum;
    },
    getMoney:function(){
        //console.log(this.get('lottery_type'),this.get('play_type_code'));
        var m = 0;
        var nums = this.get('nums');
        if(this.get('lottery_type') == 'ssq'){
            if(this.get('play_type_code') == '101'){
                if((this.get('nums').red && this.get('nums').red.length == 6) && (this.get('nums').blue && this.get('nums').blue.length == 1)){
                    m = 1;
                }
            }else if(this.get('play_type_code') == '102'){
                if(
                    nums.red && nums.blue && nums.red.length >= 6 && nums.red.length <= 16 &&
                    nums.blue.length >= 1 &&  (nums.red.length + nums.blue.length) > 7
                ){
                    var mr = this.countCv(this.get('nums').red.length,6);
                    var mb = this.countCv(this.get('nums').blue.length,1);
                    m = mr * mb;
                }
            }else if(this.get('play_type_code') == '103'){
                if(nums.dan && nums.tuo && nums.blue && nums.dan.length >0 && nums.dan.length <= 5 && (nums.dan.length + nums.tuo.length) <= 16
                    && (nums.dan.length + nums.tuo.length) > 6 && nums.blue.length > 0){
                    m = this.countCv(nums.tuo.length,6-nums.dan.length) * this.countCv(this.get('nums').blue.length,1);
                }
            }
        }else if(this.get('lottery_type') == '307'){
            if(this.get('play_type_code') == '101'){
                if(this.get('nums').red && this.get('nums').red.length == 7){
                    m = 1;
                }
            }else if(this.get('play_type_code') == '102'){
                if((this.get('nums').red && this.get('nums').red.length > 7)){
                    m = this.countCv(this.get('nums').red.length,7);
                }
            }else if(this.get('play_type_code') == '103'){
                if(nums.dan && nums.tuo && nums.dan.length >0 && nums.dan.length <= 6 && (nums.dan.length + nums.tuo.length) <= 20
                    && (nums.dan.length + nums.tuo.length) >= 8 ){
                    m = this.countCv(nums.tuo.length,7-nums.dan.length);
                }
            }
        }else if(this.get('lottery_type') == '30x5'){
            if(this.get('play_type_code') == '101'){
                if(this.get('nums').red && this.get('nums').red.length == 5){
                    m = 1;
                }
            }else if(this.get('play_type_code') == '102'){
                if((this.get('nums').red && this.get('nums').red.length >5)){
                    m = this.countCv(this.get('nums').red.length,5);
                }
            }else if(this.get('play_type_code') == '103'){
                if(nums.dan && nums.tuo && nums.dan.length >0 && nums.dan.length <= 4 && (nums.dan.length + nums.tuo.length) <= 20
                    && (nums.dan.length + nums.tuo.length) >= 6 ){
                    m = this.countCv(nums.tuo.length,5-nums.dan.length);
                }
            }
        }else if(this.get('lottery_type') == '3d'){
            if(this.get('play_type_code')=='201'){
                if(this.get('nums').bai&&this.get('nums').bai.length>0&&this.get('nums').shi&&this.get('nums').shi.length>0&&this.get('nums').ge&&this.get('nums').ge.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='202'){
                if(this.get('nums').hao1&&this.get('nums').hao1.length>0&&this.get('nums').hao2&&this.get('nums').hao2.length>0&&this.get('nums').hao3&&this.get('nums').hao3.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='203'){
                if(this.get('nums').hao1&&this.get('nums').hao1.length>0&&this.get('nums').hao2&&this.get('nums').hao2.length>0&&this.get('nums').hao3&&this.get('nums').hao3.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='204'){
                if(this.get('nums').bai&&this.get('nums').bai.length>0&&this.get('nums').shi&&this.get('nums').shi.length>0&&this.get('nums').ge&&this.get('nums').ge.length>0&&this.get('nums').bai.length+this.get('nums').shi.length+this.get('nums').ge.length>3){
                    m=this.get('nums').bai.length*this.get('nums').shi.length*this.get('nums').ge.length;
                }
            }else if(this.get('play_type_code')=='205'){
                if(this.get('nums').z3fs&&this.get('nums').z3fs.length>=2){
                    m=this.countCv(this.get('nums').z3fs.length,2)*2;
                }
            }else if(this.get('play_type_code')=='206'){
                if(this.get('nums').z6fs&&this.get('nums').z6fs.length>3){
                    m=this.countCv(this.get('nums').z6fs.length,3);
                }
            }else if(this.get('play_type_code')=='207'){
                if(this.get('nums').zhxbd &&this.get('nums').zhxbd.length>0){
                    m=this.countZxBd(this.get('nums').zhxbd[0]);
                }
            }else if(this.get('play_type_code')=='208'){
                if(this.get('nums').z3bd &&this.get('nums').z3bd.length>0){
                    m=this.countZ3Bd(this.get('nums').z3bd[0]);
                }
            }else if(this.get('play_type_code')=='209'){
                if(this.get('nums').z6bd &&this.get('nums').z6bd.length>0){
                    m=this.countZ6Bd(this.get('nums').z6bd[0]);
                }
            }else if(this.get('play_type_code')=='211'){
                if(this.get('nums').zxzhfs &&this.get('nums').zxzhfs.length>0){
                    m=1;
                    if(this.get('nums').zxzhfs.length>1){
                        m+=this.countCv(this.get('nums').zxzhfs.length,2);
                    }
                    if(this.get('nums').zxzhfs.length>2){
                        m+=this.countCv(this.get('nums').zxzhfs.length,3);
                    }
                }
            }else if(this.get('play_type_code')=='212'){
                if(this.get('nums').zxbd &&this.get('nums').zxbd.length>0){
                    m=this.countZuxBd(this.get('nums').zxbd[0]);
                }
            }else if(this.get('play_type_code')=='213'){
                var zxbd1=this.get('nums').zxbd1?this.get('nums').zxbd1.length:0;
                var zxbd2 =this.get('nums').zxbd2?this.get('nums').zxbd2.length:0;
                var z=zxbd1+zxbd2;
                if(z==1){
                    m=271;
                }else if(z==2&&this.get('nums').zxbd1[0]==this.get('nums').zxbd2[0]){
                    m=28;
                }else if(z==2&&this.get('nums').zxbd1[0]!=this.get('nums').zxbd2[0]){
                    m=54;
                }
            }else if(this.get('play_type_code')=='214'){
                var bai=this.get('nums').bai && this.get('nums').bai.length > 0 ? this.get('nums').bai.length:0;
                var shi=this.get('nums').shi && this.get('nums').shi.length > 0 ? this.get('nums').shi.length:0;
                var ge=this.get('nums').ge && this.get('nums').ge.length > 0 ? this.get('nums').ge.length:0;
                var z=bai+shi+ge;
                if(z==1){
                    m=100;
                }else if(z==2){
                    m=10;
                }
            }
        }else if(this.get('lottery_type') == '22x5'){
            if(this.get('play_type_code') == '101'){
                if(this.get('nums').red && this.get('nums').red.length == 5){
                    m = 1;
                }
            }else if(this.get('play_type_code') == '102'){
                if((this.get('nums').red && this.get('nums').red.length > 5)){
                    m = this.countCv(this.get('nums').red.length,5);
                }
            }else if(this.get('play_type_code') == '103'){
                if(nums.dan && nums.tuo && nums.dan.length >0 && nums.dan.length <= 4 && (nums.dan.length + nums.tuo.length) <= 22
                    && (nums.dan.length + nums.tuo.length) >= 6 ){
                    m = this.countCv(nums.tuo.length,5-nums.dan.length);
                }
            }else if(this.get('play_type_code') == '104'){
                if(this.get('nums').red && this.get('nums').red.length == 1){
                    m = 1;
                }
            }else if(this.get('play_type_code') == '105'){
                if((this.get('nums').red && this.get('nums').red.length > 1)){
                    m = this.countCv(this.get('nums').red.length,1);
                }
            }else if(this.get('play_type_code') == '106'){
                if(this.get('nums').red && this.get('nums').red.length == 2){
                    m = 1;
                }
            }else if(this.get('play_type_code') == '107'){
                if((this.get('nums').red && this.get('nums').red.length > 2)){
                    m = this.countCv(this.get('nums').red.length,2);
                }
            }else if(this.get('play_type_code') == '108'){
                if(nums.dan && nums.tuo && nums.dan.length >0 && nums.dan.length <= 2 && (nums.dan.length + nums.tuo.length) <= 22
                    && (nums.dan.length + nums.tuo.length) >= 3 ){
                    m = this.countCv(nums.tuo.length,2-nums.dan.length);
                }
            }else if(this.get('play_type_code') == '109'){
                if(this.get('nums').red && this.get('nums').red.length == 3){
                    m = 1;
                }
            }else if(this.get('play_type_code') == '110'){
                if((this.get('nums').red && this.get('nums').red.length > 3)){
                    m = this.countCv(this.get('nums').red.length,3);
                }
            }else if(this.get('play_type_code') == '111'){
                if(nums.dan && nums.tuo && nums.dan.length >0 && nums.dan.length <= 3 && (nums.dan.length + nums.tuo.length) <= 22
                    && (nums.dan.length + nums.tuo.length) >= 4 ){
                    m = this.countCv(nums.tuo.length,3-nums.dan.length);
                }
            }else if(this.get('play_type_code') == '112'){
                if(this.get('nums').red && this.get('nums').red.length == 4){
                    m = 1;
                }
            }else if(this.get('play_type_code') == '113'){
                if((this.get('nums').red && this.get('nums').red.length > 4)){
                    m = this.countCv(this.get('nums').red.length,4);
                }
            }else if(this.get('play_type_code') == '114'){
                if(nums.dan && nums.tuo && nums.dan.length >0 && nums.dan.length <= 4 && (nums.dan.length + nums.tuo.length) <= 22
                    && (nums.dan.length + nums.tuo.length) >= 5 ){
                    m = this.countCv(nums.tuo.length,4-nums.dan.length);
                }
            }
        }else if(this.get('lottery_type')=='k3'){
            if(this.get('play_type_code')=='101'){
                if(this.get('nums').red&&this.get('nums').red.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='102'){
                if(this.get('nums').red&&this.get('nums').red.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='103'){
                if(this.get('nums').red&&this.get('nums').red.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='104'){
                if(this.get('nums').red&&this.get('nums').red.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='105'){
                if(this.get('nums').red&&this.get('nums').red.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='106'){
                if(this.get('nums').red&&this.get('nums').red.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='107'){
                if(this.get('nums').red&&this.get('nums').red.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='108'){
                if(this.get('nums').red&&this.get('nums').red.length>0){
                    m=1;
                }
            }else if(this.get('play_type_code')=='109'){
                if(this.get('nums').hao1&&this.get('nums').hao1.length>0&&this.get('nums').hao2&&this.get('nums').hao2.length>0&&this.get('nums').hao3&&this.get('nums').hao3.length>0){
                    m=1;
                }
            }
        }
        return 2 * m  * this.get('beishu') * this.get('zhuihao');
    }
});
var LotteryTickets = Backbone.Collection.extend({
    model:LotteryTicket
});
var tickets = new LotteryTickets();