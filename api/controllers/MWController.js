'user strict'
const axios = require('axios')
const qs = require('querystring');
const parseString = require('xml2js').parseString;


const callWS1 = (req, res) =>{
    const rBody ={
      method:req.body.method,
      sql: req.body.sql,
      bd:req.body.bd
    };
    
    const config = {
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };
    const requestBody ={ 
        method: rBody.method,
        sql:rBody.sql,
        bd:rBody.bd
    };
    
    const server = 'http://172.21.220.41:8083/WebApplicationServletClient/ClientServlet';
    const resposta = axios.post(server, qs.stringify(requestBody), config)
                            .then((response) => {
                              res.send(response.data)
                            })
                            .catch((error) => {
                              res.send(error)

                            })


    const dados_resposta = resposta.data;
    res.send
}

const callWSget = (req, res) =>{
    const chamada ={
      method:req.params.app
    }

    console.log(chamada);
    res.send(chamada);

//    request.post({
//      headers: {'content-type' : 'application/x-www-form-urlencoded'},
//      url:     'http://172.21.220.41:8083/WebApplicationServletClient/ClientServlet',
//      body:    JSON.stringify(chamada)
//    }, function(error, response, body){
//      console.log(body);
//    });
    
}


module.exports = {
    callWS1,
    callWSget
}