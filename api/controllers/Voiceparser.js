'user strict'
const axios = require('axios')
const qs = require('querystring');
var mysql = require('mysql');
const constring = require('../config/databaseMysql');
const server = require('../config/server');


server.io.on('my other event', () => {
    console.log('--------- C conectado');
});

const GetID = (req, res) => {

    const chamada = {
        id: req.params.id
    }

    var con = mysql.createConnection(constring);

    con.connect();

    //Select all customers and return the result object:
    con.query("SELECT * FROM teste_Voice where id = ? ", chamada.id, function(err, result, fields) {
        if (err) throw err;

        server.io.emit('result', JSON.parse(JSON.stringify(result))[0]);

        res.send(result);

    });


    con.end();

}

const GetAll = (req, res) => {



    var con = mysql.createConnection(constring);

    con.connect();

    //Select all customers and return the result object:
    con.query("SELECT * FROM teste_Voice", function(err, result, fields) {
        if (err) throw err;

        server.io.emit('resultall', JSON.parse(JSON.stringify(result)));

        res.send(result);

    });


    con.end();

}


module.exports = {
    GetID,
    GetAll
}