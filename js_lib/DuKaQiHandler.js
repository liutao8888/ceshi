var YinLian = require('./hardware/YinLian0');
//--各类支付的读卡
 exports.read_card_lottery=exports.read_card_recharge=exports.read_card_register=exports.read_card_chayu = function(open_cb,cb){
    YinLian.readCard(1,40000,open_cb,cb);
}
exports.read_card_phone = exports.read_card_credit = exports.read_card_cardtocard  = function(open_cb,cb){
    YinLian.readCard(2,40000,open_cb,cb);
}

//--------------各类支付的退卡----------------------
exports.returnCard = exports.return_card_lottery = exports.return_card_recharge=exports.return_card_phone = exports.return_card_credit = exports.return_card_cardtocard = exports.return_card_chayu = function(){
    YinLian.returnCard();
}
exports.return_card = function(){
    YinLian.return_card();
}

exports.force_return_card = function(){
    YinLian.force_return_card();
}

/**
 * 读取卡号
 * @param cb
 */
exports.read_card_data = function(opencb,cb){
    YinLian.readCardData(40000,opencb,cb);
}