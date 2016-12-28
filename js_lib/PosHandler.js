var YinLian = require('./hardware/YinLian0');
//-----------pay
exports.pay_lottery=exports.pay_recharge = function(params,cb){
    YinLian.pay(params.money,cb);
}
exports.pay_phone = function(params,cb){
    YinLian.pay_phone(params.money,params.phone_num,params.fws,cb);
}
exports.pay_kaka = function(params,cb){
    YinLian.pay_cardtocard(params.money,params.card_no,cb);
}
exports.pay_credit = function(params,cb){
    YinLian.pay_credit(params.money,params.card_no,params.phone_num,cb);
}
exports.pay_cardtocard = function(params,cb){
    YinLian.pay_cardtocard(params.money,params.card_no,cb);
}
