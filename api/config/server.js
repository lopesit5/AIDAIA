const express = require('express'),
    cors = require('./cors'),
    logger = require('./logger')
server = express(),
    morgan = require('morgan'),
    uuidv4 = require('uuid/v4'),
    mjson = require('morgan-json'),
    jwt = require('jsonwebtoken'),
    jwtDecode = require('jwt-decode'),
    port = process.env.PORT || 3005,
    host = process.env.HOST || 'localhost'
bodyParser = require('body-parser'),
    queryParser = require('express-query-int'),
    cron = require("node-cron"),
    cronscript = require('../controllers/CRON');

cron.schedule('*/20 * * * * *', () => {
    cronscript.RunScripts();
});

const io = require('socket.io')(8083, {
    path: '/test',
    serveClient: false,
});


io.on('connection', (socket) => {
    console.log('connected', socket.id);
});


const morganJson = mjson({
    user: ':iduser',
    remoteAddr: ':remote-addr',
    remoteUser: ':remote-user',
    date: '[:date[iso]]',
    method: ':method',
    url: ':url HTTP',
    //httpV: ':http-version',
    status: ':status',
    res: ':res[content-length]',
    refer: ':referrer',
    userAgent: ':user-agent'
})

const assignId = (req, res, next) => {
    req.id = uuidv4()
    next()
}
const chectHeader = (req, res) => {
    if (req.headers && req.headers.authorization) {
        return jwtDecode(req.headers.authorization)._doc.email
            //jwt.verify(req.headers.authorization, env.authSecret)._doc.email
    } else {

        return 'false'
    }
}

morgan.token('iduser', chectHeader)
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(cors)
server.use(queryParser())
server.use(morgan(morganJson, { stream: logger.stream }))
server.use(assignId)
server.listen(port, host, () => {
    console.log(`Rest Aida COVID is Running! Porta ${port} e IP ${host}`)
})



module.exports = { server, io }