'user strict'
const axios = require('axios')
const qs = require('querystring');
const oracledb = require('oracledb');
const constring = require('../config/databaseOracle');
const server = require('../config/server');

const cron = require("node-cron");
const { spawn } = require('child_process');

const pythonDir = (__dirname + "/../Python_Scripts/"); // Path of python script folder

async function ScriptsPyR() {

    oracledb.autoCommit = true;

    let connection;

    try {

        let sql, binds, options, result;

        connection = await oracledb.getConnection(constring);

        // Query the data
        oracledb.outFormat = oracledb.OBJECT;

        sql = `Select * from aidaia_schedule where sysdate > next and status = '1'`;
        binds = {};
        options = {};
        result = await connection.execute(sql, binds, options);

        if (result.rows.length == 0) {
            console.log("Correu sem execuções");
        }

        for (const script of result.rows) {

            if(script.ML_LANG == 'Python') {   

                var listScripts = [];
                listScripts.push(__dirname + "/../Python_Scripts/" + script.PATH);

                var dataToSend;
                // spawn new child process to call the python script
                const python = spawn('python', listScripts);


                // collect data from script
                python.stdout.on('data', function(data) {
                    console.log('Running' + script.DESC);
                    dataToSend = data.toString();
                });

                let resultError = "ERRO:  ";

                python.stderr.on('data', (data) => {
                    resultError += data.toString();
                });

                python.stdout.on("end", function() {
                    if (resultError == "") {
                        console.log("OK: " + JSON.parse(result));
                    } else {
                        console.error(`Python error, you can reproduce the error with: python ${script.PATH} `);
                        const error = new Error(resultError);
                        console.error(error);
                        resultError = "";
                    }
                })

                if (script.INTERVAL == '0') {
                    sql = "update aidaia_schedule set status = '0' where id = " + script.ID;
                    binds = {};
                    options = {};
                    result = await connection.execute(sql, binds, options);

                } else {

                    sql = 'update aidaia_schedule set next = sysdate + (1/1440*' + script.INTERVAL + ') where id = ' + script.ID;
                    binds = {};
                    options = {};
                    result = await connection.execute(sql, binds, options);

                }

            
            } else {

                var listScripts = [];
                listScripts.push(__dirname + "/../R_Scripts/" + script.PATH);

                var dataToSend;
                // spawn new child process to call the python script
                const r = spawn('r', listScripts);


                // collect data from script
                r.stdout.on('data', function(data) {
                    console.log('Running' + script.DESC);
                    dataToSend = data.toString();
                });

                let resultError = "ERRO:  ";

                r.stderr.on('data', (data) => {
                    resultError += data.toString();
                });


                r.stdout.on("end", function() {
                    if (resultError == "") {
                        console.log("OK: " + JSON.parse(result));
                    } else {
                        console.error(`R error, you can reproduce the error with: python ${script.PATH} `);
                        const error = new Error(resultError);
                        console.error(error);
                        resultError = "";
                    }
                })

                if (script.INTERVAL == '0') {
                    sql = "update aidaia_schedule set status = '0' where id = " + script.ID;
                    binds = {};
                    options = {};
                    result = await connection.execute(sql, binds, options);

                } else {

                    sql = 'update aidaia_schedule set next = sysdate + (1/1440*' + script.INTERVAL + ') where id = ' + script.ID;
                    binds = {};
                    options = {};
                    result = await connection.execute(sql, binds, options);

                }

            }

        }

        return 'Update Complete';

    } catch (err) {
        
        console.error(err);
        return err;

    } finally {
        
        if (connection) {
            try {
                
                await connection.close();

            } catch (err) {
                
                console.error(err);
                return err;
            }
        }
    }
}

module.exports = {
    ScriptsPyR
}