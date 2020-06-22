const winston = require('winston'),
    MongoDB = require('winston-mongodb').MongoDB

var options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  }
}

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, 
})
/*
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.MongoDB({
        db : 'mongodb://localhost:27017/AidaBI',
        collection: 'LogsMiddleware'
    })
  ],
  exitOnError: false, 
})*/

logger.stream = {write: (message, encoding) =>{
    const m = JSON.parse(message)
    logger.info(message,{
        app: m.url.split("/")[m.url.split("/").length-1].split(" ")[0],
        remoteAddr: m.remoteAddr,
        remoteUser: m.remoteUser, 
        date: m.date,
        method: m.method, 
        url: m.url,
        status: m.status, 
        res: m.res, 
        refer: m.refer, 
        userAgent: m.userAgent})
}}

module.exports = logger