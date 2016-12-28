var http = require('http');
exports.getWords = function(codes,cb){
    var query  = require('querystring').stringify({bh:codes});
    var options = {
        hostname: 'www.yibizi.com',
        port: 80,
        path: '/html5/hd.php',
        method: 'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':query.length
        }
    };
    var req = http.request(options, function(res) {
        var _data;
        res.on('data', function (chunk) {
            _data += chunk;
        });
        res.on('end',function(){
            if(_data){
                var ar =  _data.split(' ').length ==21 ? _data.split(' ').slice(1,20) : _data.split(' ');
                cb(null,ar);
            }else{
                cb(new Error('no data'));
            }
            return ;
        })
    });
    req.on('error', function(e) {
        cb(e);
        return;
        console.log('problem with request: ' + e.message);
    });
    req.write(query);
    req.end();
}

