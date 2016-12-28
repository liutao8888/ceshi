(function($) {
    var numberTarget;
    var keyboardTarget;
    var ziku = require(process.cwd() + '/js_lib/ziku.js').ziku;
    $('#numkeyboard,#keyboard,#hw_keyboard').mousedown(function(e){
        e.preventDefault();
    });
    var keyboard_state = 0; //0字母 1数字 2 标点 (不用) 3,拼音输入
    var pinyin_m;
    function intiMyKeyboard (){
        keyboard_state = 0;
        empty_pin();
        $('#pinyin_area').hide();
        $('#number_shift').removeClass('bigShift').addClass('smallShift');
        $('#number_shift').text('123');
        $('#shift').html('<span></span>');
        $('#keyboard button:not([class])').each(function(item,index){
            $(this).text($(this).attr('yw'));
        });
    }
    function empty_pin(){
        $('#py_list,#pinyin').empty();
        pinyin_m =  {
            words:'',
            page:1,
            pinyin:'',
            count:0
        };
        $('#pinyin_note').show();
    }
    $('#py_list').click(function(e){
        keyboardTarget.val(keyboardTarget.val() + e.target.innerText);
        empty_pin();
    });
    $('#py_list_pre').click(function(e){
        var pagecount = pinyin_m.count / 8;
        if(pinyin_m.words && pinyin_m.page > 1 && (pinyin_m.page -1 ) < pagecount ){
            var sps='';
            for(var i = (pinyin_m.page -2) * 8;i<(pinyin_m.page - 1)*8 && i < pinyin_m.count;i++){
                sps += '<span style="display: inline-block;width: 45px;font-size: 18px;">'+ pinyin_m.words[i] +'</span>';
            }
            pinyin_m.page = pinyin_m.page - 1;
            $('#py_list').html(sps);
        }
    });
    $('#py_list_next').click(function(e){
        var pagecount = pinyin_m.count / 8;
        if(pinyin_m.words && pagecount > pinyin_m.page){
            var sps='';
            for(var i = pinyin_m.page * 8;i<(pinyin_m.page + 1)*8 && i < pinyin_m.count ;i++){
                sps += '<span style="display: inline-block;width: 45px;font-size: 18px;">'+ pinyin_m.words[i] +'</span>';
            }
            pinyin_m.page = pinyin_m.page + 1;
            $('#py_list').html(sps);
        }
    });
    $('#keyboard button').bind('mouseup',function(e){
        e.preventDefault();
        e.stopPropagation();
        var t_id = $(this).attr('id');
        if(t_id == 'number_shift'){
            if(keyboard_state == 0 || keyboard_state == 3){
                $('#number_shift').text('ABC');
                $('#shift').text('#+=');
                $('#keyboard button:not([class])').each(function(item,index){
                    $(this).text($(this).attr('num'));
                });
                keyboard_state = 1;
                if(keyboard_state == 3){
                    empty_pin();
                }else{
                    $('#pinyin_area').hide();
                }
            } else if(keyboard_state == 1){
                intiMyKeyboard();
            }else{
                intiMyKeyboard();
            }
        }else if(t_id== 'shift'){
            if(keyboard_state == 0){//字母输入
                if($(this).hasClass('smallShift')){
                    $('#keyboard button:not([class])').each(function(item,index){
                        $(this).text($(this).text().toUpperCase());
                    });
                    $(this).removeClass('smallShift').addClass('bigShift');
                }else{
                    $('#keyboard button:not([class])').each(function(item,index){
                        $(this).text($(this).text().toLowerCase());
                    });
                    $(this).removeClass('bigShift').addClass('smallShift');
                }
                $('#pinyin_area').hide();
            }else if(keyboard_state == 1){//数字
                $('#keyboard button:not([class])').each(function(item,index){
                    $(this).text($(this).attr('bd'));
                    //$('#login_pass,#login_pass1,#login_passyue').css('display','none');
                });
                $('#pinyin_area').hide();
            }else if(keyboard_state == 2){
                $('#keyboard button:not([class])').each(function(item,index){
                    $(this).text($(this).attr('num'));
                });
                $('#pinyin_area').hide();
            }else if(keyboard_state == 3) { //拼音

                return;
            }
        }else if(t_id=='space'){
            keyboardTarget.val(keyboardTarget.val() + ' ');
        }else if(t_id == 'backspace'){
            if(keyboard_state == 3 && pinyin_m.pinyin){
                if(pinyin_m.pinyin.length > 1){
                    render_pinyin(pinyin_m.pinyin.substr(0,pinyin_m.pinyin.length - 1));
                }else{
                    empty_pin();
                }
            }else{
                if(keyboardTarget.val() && keyboardTarget.val().length > 0){
                    var startPos  = keyboardTarget[0].selectionStart;
                    var endPos    = keyboardTarget[0].selectionEnd;
                    keyboardTarget.val(keyboardTarget.val().substr(0,startPos-1)+keyboardTarget.val().substr(startPos,endPos));
                    keyboardTarget[0].selectionStart = startPos-1;
                    keyboardTarget[0].selectionEnd   = startPos-1; //+ key.length;
                    keyboardTarget.focus();
                }
            }
        }else if(t_id== "empty"){
            $('#keyboard').hide();
            if(keyboardTarget){
                keyboardTarget.blur();
            }
        }else if(t_id == 'enter'){
            if(keyboard_state == 3 && $('#py_list span:eq(0)').text()){
                keyboardTarget.val(keyboardTarget.val() + $('#py_list span:eq(0)').text());
                empty_pin();
            }else{
                $('#keyboard').hide();
                if(keyboardTarget){
                    keyboardTarget.blur();
                }
            }
        }else if(t_id=='#sub_login'){
            $('#keyboard').hide();
            if(keyboardTarget){
                keyboardTarget.blur();
            }
        //    slogin();
        }else if(t_id == 'show_hw_keyboard') {
            $('#keyboard').hide();
            $('#hw_keyboard').show();
        }else if(t_id == 'pinyin_shift'){
            if(keyboard_state == 3){
                empty_pin();
                keyboard_state = 1;
                $('#pinyin_area').hide();
            }else{
                if($('#shift').hasClass('bigShift')){ //
                    $('#shift').removeClass('bigShift').addClass('smallShift');
                    $('#keyboard button:not([class])').each(function(item,index){
                        $(this).text($(this).text().toLowerCase());
                    });
                }
                if(keyboard_state == 1){
                    $('#number_shift').removeClass('bigShift').addClass('smallShift');
                    $('#number_shift').text('123');
                    $('#shift').html('<span></span>');
                    $('#keyboard button:not([class])').each(function(item,index){
                        $(this).text($(this).attr('yw'));
                    });
                }
                keyboard_state = 3;
                $('#pinyin_area').show();
                empty_pin();
            }
        }else{
            if(keyboard_state == 3){
                var py = $('#pinyin').text() + $(this).text();
                render_pinyin(py);
            }else{
                var key = $(this).text();
                keyboardTarget.val(keyboardTarget.val() + key);
            }
        }
    });
    function render_pinyin(py){
        $('#pinyin').text(py);
        pinyin_m.pinyin = py;
        if(ziku[py]){
            pinyin_m.words = ziku[py];
            pinyin_m.pinyin = py;
            pinyin_m.count = ziku[py].length;
            var s=  (pinyin_m.page - 1) * 8;
            var end = pinyin_m.page * 8;
            var sps ='';
            for(var i = s;i<end && i < pinyin_m.count;i++){
                sps += '<span style="display: inline-block;width: 45px;font-size: 18px;">'+ pinyin_m.words[i] +'</span>';
                console.log(sps);
            }
            $('#py_list').html(sps);
        }else{
            $('#py_list').empty();
        }
        $('#pinyin_note').hide();
    }
    $('#numkeyboard button').bind('mouseup',function(e){
        e.preventDefault();
        e.stopPropagation();
        var key  = $(this).attr('key');
        var dd_id=$(this).attr('id');

        if(key == '-'){
            if(numberTarget.val() && numberTarget.val().length > 0){
                var startPos  = numberTarget[0].selectionStart;
                var endPos    = numberTarget[0].selectionEnd;
                numberTarget.val(numberTarget.val().substr(0,startPos-1)+numberTarget.val().substr(startPos,endPos));
                numberTarget[0].selectionStart = startPos-1;
                numberTarget[0].selectionEnd   = startPos-1; //+ key.length;
                numberTarget.focus();
            }
        }else if(key == '--'){

            $('#numkeyboard').hide();
            if(numberTarget){
                numberTarget.blur();
            }
        }else{
            var startPos  = numberTarget[0].selectionStart;
            var endPos    = numberTarget[0].selectionEnd;
            var v = numberTarget.val().substring(0, startPos) + key + numberTarget.val().substring(endPos);
            numberTarget.val(v);
            numberTarget[0].selectionStart = startPos + key.length;
            numberTarget[0].selectionEnd   = startPos + key.length;
        }
    });
    $.fn.numberKeyboard = function(option) {
        if(!option || option == "show" ){
            var left = $(this).attr('left') ? $(this).attr('left')  - 0 : 5;
            var top = $(this).attr('top') ? $(this).attr('top')  - 0 : 54;
            var of = $(this).offset();
            $('#numkeyboard').css({left:of.left+left,top:of.top+top});
            $('#numkeyboard').show();
            var target = this;
            numberTarget = $(this);
            $(target).unbind('blur').bind('blur',function(e){
                $('#numkeyboard').hide();
            });
        }else if(option == "hide"){
            $('#numkeyboard').hide();
        }
    };
    $.fn.myKeyboard = function(option){
        var left = $(this).attr('left') ? $(this).attr('left')  - 0 : 0;
        var top = $(this).attr('top') ? $(this).attr('top')  - 0 : 45;
        var of = $(this).offset();
        $('#keyboard,#hw_keyboard').css({left:of.left+left,top:of.top+top});
        rewrite();
        intiMyKeyboard();
        if(option == "hw"){
            $('#hw_keyboard').show();
        }else{
            $('#keyboard').show();
        }
        keyboardTarget = $(this);
        keyboardTarget.unbind('blur').bind('blur',function(e){
            $('#keyboard,#hw_keyboard').hide();
        });
    }
//    ----------------- hw keyboard
    function getX(obj){
        var parObj=obj;
        var left=obj.offsetLeft;
        while(parObj=parObj.offsetParent){
            left+=parObj.offsetLeft;
        }
        return left;
    }
    function getY(obj){
        var parObj=obj;
        var top=obj.offsetTop;
        while(parObj = parObj.offsetParent){
            top+=parObj.offsetTop;
        }
        return top;
    }
    var canvas = document.getElementById("hw_canvas");
    //是否支持触摸
    var touchable = 'createTouch' in document;
    if (touchable) {
        //console.log('touchable!')
        canvas.addEventListener('touchstart', onTouchStart, false);
        canvas.addEventListener('touchmove', onTouchMove, false);
        canvas.addEventListener('touchend', onTouchEnd, false);
    }
    else {
        console.log('un touchable');
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mousemove', onMouseMove, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
    }
    //上一次触摸坐标
    var lastX;
    var lastY;
    var ctx =canvas.getContext("2d");
    ctx.lineWidth=6;//画笔粗细
    ctx.strokeStyle="#000000";//画笔颜色
    var drawing = false;
    function onMouseUp(event) {
        event.preventDefault();
        event.stopPropagation();
        //ev = event || window.event;
        //var mousePos = mousePosition(event);
        drawing =false;
        bihua = bihua+"s";
        senddata();

    }
    function onMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        //ev = event || window.event;
        //var mousePos = mousePosition(event);
        drawing =true;
        lastX=event.clientX;
        lastY=event.clientY;
        var top,left,oDiv;
        oDiv=document.getElementById("hw_canvas");
        top=getY(oDiv);
        left=getX(oDiv);
        lastX= lastX - left+document.body.scrollLeft;
        lastY = lastY -top+document.body.scrollTop;
        drawRound(lastX,lastY);

    }
    function onMouseMove(event) {
        event.preventDefault();
        event.stopPropagation();
        //ev = event || window.event;
        //var mousePos = mousePosition(event);
        if(drawing)
        {
            //lastX=event.clientX;
            //lastY=event.clientY;
            //drawRound(lastX,lastY);
            try
            {
                //event.preventDefault();
                var top,left,oDiv;
                oDiv=document.getElementById("hw_canvas");
                top=getY(oDiv);
                left=getX(oDiv);
                drawLine(lastX,lastY,event.clientX - left+document.body.scrollLeft,event.clientY -top+document.body.scrollTop );
                lastX=event.clientX;
                lastY=event.clientY;
                lastX= lastX - left+document.body.scrollLeft;
                lastY = lastY -top+document.body.scrollTop;
            }
            catch(err){
                alert( err.description);
            }
        }
    }
    //触摸开始事件
    function onTouchStart(event) {
        event.preventDefault();
        event.stopPropagation();
        lastX=event.touches[0].clientX;
        lastY=event.touches[0].clientY;
        var top,left,oDiv;
        oDiv=document.getElementById("canvas");
        top=getY(oDiv);
        left=getX(oDiv);
        lastX= lastX - left+document.body.scrollLeft;
        lastY = lastY -top+document.body.scrollTop;
        drawRound(lastX,lastY);

    }
    //触摸结束
    function onTouchEnd(event) {
        event.preventDefault();
        event.stopPropagation();
        bihua = bihua+"s";

        senddata();
    }
    //触摸滑动事件
    function onTouchMove(event) {
        event.preventDefault();
        event.stopPropagation();
        try
        {
            var top,left,oDiv;
            oDiv=document.getElementById("canvas");
            top=getY(oDiv);
            left=getX(oDiv);
            event.preventDefault();
            drawLine(lastX,lastY,event.touches[0].clientX-left+document.body.scrollLeft,event.touches[0].clientY-top+document.body.scrollTop);
            lastX=event.touches[0].clientX;
            lastY=event.touches[0].clientY;

            lastX= lastX - left+document.body.scrollLeft;
            lastY = lastY -top+document.body.scrollTop;
        }
        catch(err){
            alert( err.description);
        }

    }
    var lg="zh-cn";
    var bihua="";
    var info = document.getElementById("info");
    //画圆
    function drawRound(x,y)
    {
        ctx.fillStyle="#000000";
        ctx.beginPath();
        ctx.arc(x,y,3,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
        bihua = bihua+x+"a"+y+"a";

    }
    //画线
    function drawLine(startX,startY,endX,endY){
        ctx.beginPath();
        ctx.lineCap="round";
        ctx.moveTo(startX,startY);
        ctx.lineTo(endX,endY);
        ctx.stroke();
        bihua = bihua+endX+"a"+endY+"a";
    }

    function senddata(){
        $('#hw_loading').show();
        var q = require(process.cwd() + '/js_lib/PublicQuery');
        q.SearchHwWords(lg+bihua,function(err,results){
            if(!err){
                var l = results.length > 10 ? 10 :results.length;
                for(var i =0;i<l;i++){
                    if(results[i]){
                        $('#hw_lists button:eq('+i+')').text(results[i]);
                    }
                }
            }
            $('#hw_loading').hide();
        });

    }
    //function slogin(){
    //    var l=require(process.cwd() + '/myjs/pay_mini_view.js');
    //    console.log('124234423454ter-------------- by8gf.....',l);
    //    l.login();
    //}
    function rewrite(){
        ctx.clearRect(0,0,330,280);
        bihua ="";
        $('#hw_lists button').text('');
    }
    $('#hw_buttons #hw_rewrite').click(function(){
        rewrite();
    });
    $('#hw_buttons #hw_close').click(function(){
        $('#hw_keyboard').hide();
        if(keyboardTarget){
            keyboardTarget.blur();
        }
    });
    $('#hw_buttons #hw_switch_keyboard').click(function(){
        $('#hw_keyboard').hide();
        $('#keyboard').show();
    });
    $('#hw_lists button').bind('mouseup',function(e){
        e.preventDefault();
        e.stopPropagation();
        if(keyboardTarget){
            keyboardTarget.val(keyboardTarget.val() + $(e.currentTarget).text());
        }
        rewrite();
    });
})(jQuery);