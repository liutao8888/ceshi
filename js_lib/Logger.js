var logger = require('tracer').dailyfile({root:'D:/log',dateformat : "yyyy-mm-dd HH:MM:ss.L",level:'info'});
exports.logger = logger;