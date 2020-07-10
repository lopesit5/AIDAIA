'user strict'
const axios = require('axios')
const qs = require('querystring');
const oracledb = require('oracledb');
const constring = require('../config/databaseOracle');
const server = require('../config/server');
const cron = require("node-cron");
const { spawn } = require('child_process');

async function runScript(req, res) {

    const chamada = {
        id: req.params.id
    }

    oracledb.autoCommit = true;

    let connection;

    try {

        let sql, binds, options, result;

        connection = await oracledb.getConnection(constring);

        oracledb.outFormat = oracledb.OBJECT;

        sql = "Select * from aidaia_schedule where ID = '" + chamada.id + "'";
        binds = {};
        options = {};
        result = await connection.execute(sql, binds, options);

        for (const script of result.rows) {

            if(script.ML_LANG == 'Python'){

                var listScripts = [];
                listScripts.push(__dirname + "/../Python_Scripts/" + script.PATH);

                var dataToSend;
                // spawn new child process to call the python script
                const python = spawn('python', listScripts);


                // collect data from script
                python.stdout.on('data', function(data) {
                    dataToSend = data.toString();
                    console.log(dataToSend);
                });

                // in close event we are sure that stream from child process is closed
                python.on('close', (code) => {
                    console.log(`Process is closed`);
                });

                if (script.INTERVAL == '0') {
                    sql = "update aidaia_schedule set status = '0' where id = " + script.ID;
                    binds = {};
                    options = {};
                    result2 = await connection.execute(sql, binds, options);

                } else {

                    sql = 'update aidaia_schedule set next = sysdate + (1/1440*' + script.INTERVAL + ') where id = ' + script.ID;
                    binds = {};
                    options = {};
                    result3 = await connection.execute(sql, binds, options);
                }

            } else {

                var listScripts = [];
                listScripts.push(__dirname + "/../R_Scripts/" + script.PATH);

                var dataToSend;
                // spawn new child process to call the python script
                const r = spawn('r', listScripts);


                // collect data from script
                r.stdout.on('data', function(data) {
                    dataToSend = data.toString();
                    console.log(dataToSend);
                });

                // in close event we are sure that stream from child process is closed
                r.on('close', (code) => {
                    console.log(`Process is closed`);
                });

                if (script.INTERVAL == '0') {
                    sql = "update aidaia_schedule set status = '0' where id = " + script.ID;
                    binds = {};
                    options = {};
                    result2 = await connection.execute(sql, binds, options);

                } else {

                    sql = 'update aidaia_schedule set next = sysdate + (1/1440*' + script.INTERVAL + ') where id = ' + script.ID;
                    binds = {};
                    options = {};
                    result3 = await connection.execute(sql, binds, options);

                }

            }
        }

        res.send(result.rows);

    } catch (err) {

        console.error(err);
        
    } finally {

        if (connection) {

            try {
                
                await connection.close();

            } catch (err) {
                
                console.error(err);
            }
        }
    }

}

module.exports = {
    runScript
}