var YinLian = require('./hardware/YinLian0');
exports.read_key_lottery = exports.read_key_phone = exports.read_key_recharge = exports.read_key_credit = exports.read_key_cardtocard= exports.read_key_chayu = function(cb,cancel_cb,type_cb,retype_cb){
    //console.log('read key handle -----------------');
    YinLian.readKey(cb,cancel_cb,type_cb,retype_cb);
}