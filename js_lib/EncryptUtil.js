var crypto = require('crypto');
var iv = '15743628';
var key = 'zghbwhszzyjyshxxjsyxgszz';
exports.des3cbc = function(text){
    var encipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
    encipher.setAutoPadding(true);
    var encoded  = encipher.update(text, 'utf8', 'base64');
    encoded += encipher.final( 'base64' );
    return encoded;
}
exports.decodeDes3cbc = function(text){
    var decipher = crypto.createDecipheriv('des-ede3-cbc', key, iv);
    var decoded  = decipher.update(text, 'base64', 'utf8');
    decoded += decipher.final( 'utf8' );
    return decoded;
}
exports.md5=function(text){
    var md5sum = crypto.createHash('md5');
    md5sum.update(text);
    var str = md5sum.digest('hex');
    return str;
}
exports.md5Params = function(encoded_params){
    var md5sum = crypto.createHash('md5');
    md5sum.update(key+encoded_params+iv);
    var str = md5sum.digest('hex');
    return str;
}
