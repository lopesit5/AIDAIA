'user strict'
const axios = require('axios')
const qs = require('querystring');
const oracledb = require('oracledb');
const constring = require('../config/databaseOracle');
const server = require('../config/server');


async function GetAll(req, res) {



    oracledb.autoCommit = true;


    let connection;

    try {


        let sql, binds, options, result;

        connection = await oracledb.getConnection(constring);


        //
        // Query the data
        //
        oracledb.outFormat = oracledb.OBJECT;



        sql = `select e.msgid, e.num_sequencial*16 as patientid, e.num_episodio * 16 as visita, to_char(e.tstamp,'YYYY-MM-DD HH24:MI:SS') tstamp, e.num_cama, e.jobj,
        f.SEXO, f.idade, to_char(f.dta_entrada,'YYYY-MM-DD') dta_entrada, f.hora_entrada, to_char(f.datahora_entrada,'YYYY-MM-DD HH24:MI:SS') datahora_entrada, f.cod_especialidade, f.cod_sala, f.cod_patologia, f.interv_principal, f.estado
        from mdray_val e, patient_status f 
            where 
                f.num_sequencial = e.num_sequencial and rownum <200`;

        binds = {};

        options = {
            fetchInfo: {
                "JOBJ": { type: oracledb.STRING }
            }
        };

        result = await connection.execute(sql, binds, options);

        JOBJ = result.rows;

        descbox = [];
        for (i = 0; i < JOBJ.length; i++) {
            measures = JSON.parse(JOBJ[i].JOBJ).measures;
            for (j = 0; j < measures.length; j++) {
                if (!descbox.includes(measures[j].descbox)) {
                    descbox.push(measures[j].descbox);
                }
            }
        }

        //
        // Cria a tabela
        //
        const stmts = [];

        stmts.push(`DROP TABLE extracao_mdray_teste`);

        createT = `CREATE TABLE extracao_mdray_teste 
        ("VISITA" NUMBER,
        "PATIENTID" NUMBER,  
        "TSTAMP" VARCHAR2(30 BYTE), 
        "SEXO" VARCHAR2(20 BYTE), 
        "IDADE" VARCHAR2(20 BYTE), 
        "DTA_ENTRADA" VARCHAR2(26 BYTE), 
        "HORA_ENTRADA" VARCHAR2(20 BYTE), 
        "DATAHORA_ENTRADA" VARCHAR2(26 BYTE), 
        "COD_ESPECIALIDADE" VARCHAR2(20 BYTE), 
        "COD_SALA" VARCHAR2(20 BYTE), 
        "NUM_CAMA" VARCHAR2(20 BYTE), 
        "COD_PATOLOGIA" VARCHAR2(20 BYTE), 
        "INTERV_PRINCIPAL" VARCHAR2(20 BYTE), 
        "ESTADO" VARCHAR2(20 BYTE)`;




        for (i = 0; i < descbox.length; i++) {
            createT += ',"' + descbox[i] + '" VARCHAR2(20 BYTE)'
        }

        createT += `)`;

        stmts.push(createT);

        for (const s of stmts) {
            try {
                await connection.execute(s);
            } catch (e) {
                if (e.errorNum != 942)
                    console.error(e);
            }
        }





        var descs = []
        var valores = []

        var processos = [];

        for (const OBJ of JOBJ) {
            var processo = [];
            var processo_concat = {};
            measures = JSON.parse(OBJ.JOBJ).measures;
            for (const measure of measures) {
                med = JSON.parse('{"VISITA":' + OBJ.VISITA + ', ' + '"PATIENTID":' + OBJ.PATIENTID + ', ' + '"TSTAMP":"' + OBJ.TSTAMP + '", ' +
                    '"SEXO":"' + OBJ.SEXO + '" , ' +
                    '"IDADE":' + OBJ.IDADE + ' , ' +
                    '"DTA_ENTRADA":"' + OBJ.DTA_ENTRADA + '" , ' +
                    '"HORA_ENTRADA":"' + OBJ.HORA_ENTRADA + '", ' +
                    '"DATAHORA_ENTRADA":"' + OBJ.DATAHORA_ENTRADA + '", ' +
                    '"COD_ESPECIALIDADE":"' + OBJ.COD_ESPECIALIDADE + '" , ' +
                    '"COD_SALA":"' + OBJ.COD_SALA + '", ' +
                    '"NUM_CAMA":"' + OBJ.NUM_CAMA + '", ' +
                    '"COD_PATOLOGIA":"' + OBJ.COD_PATOLOGIA + '", ' +
                    '"INTERV_PRINCIPAL":"' + OBJ.INTERV_PRINCIPAL + '", ' +
                    '"ESTADO":"' + OBJ.ESTADO + '", "' +
                    measure.descbox + '":"' + measure.value + '"}');
                processo.push(med);;
            }
            for (proc of processo) {
                processo_concat = Object.assign(processo_concat, proc);
            }
            processos.push(processo_concat);
        }





        //
        // Insert linhas na DB
        //

        cnt = 0;

        for (linha of processos) {

            var ii = true;
            var ins = 'INSERT INTO extracao_mdray_teste (';
            var ins2 = '';
            for (jj = 0; jj < Object.keys(linha).length; jj++) {
                var atr = Object.keys(linha)[jj];

                if (ii) {
                    ins += '"' + atr + '"';
                    ins2 += ' :' + atr + '';
                    ii = false;
                } else {
                    ins += ',"' + atr + '"';
                    ins2 += ', :' + atr;
                }

            }

            ins += ") values";
            ins += " (" + ins2 + ")";

            sql = ins;

            // For a complete list of options see the documentation.
            options = {
                autoCommit: true
            };
            result = await connection.execute(sql, linha, options);
            //console.log("Number of rows inserted:", result.rowsAffected);


            cnt += 1;


        }


        res.send("Foram inseridas: " + cnt);

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



/*
    //Select all customers and return the result object:
    con.query("select e.msgid, e.num_sequencial*16 as patientid, e.num_episodio * 16 as visita, e.tstamp, e.num_cama, e.jobj," +
        "f.SEXO, f.idade, f.dta_entrada, f.hora_entrada, f.datahora_entrada, f.cod_especialidade, f.cod_sala, f.cod_patologia, f.interv_principal," +
        " f.estado from mdray_val e, patient_status f where f.num_sequencial = e.num_sequencial and rownum <5",
        function(err, result, fields) {
            if (err) throw err;


        });
*/




module.exports = {
    GetAll
}