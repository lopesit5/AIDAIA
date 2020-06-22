'user strict'
const axios = require('axios')
const qs = require('querystring');
const parseString = require('xml2js').parseString;
const fs = require('fs');
const path = require('path');


const OPTparser = (req, res) =>{
    const chamada ={
      doc:req.params.doc,
      seg:req.params.segmento
    }
    

    const config = {
        headers: {
            'Content-Type':'text/opt'
        }
    };
    
    const token = getToken();
    
    const server = 'https://www.aida-hitech.com/gpedidos/api/getFile/'+token+'/' + chamada.doc;
    
    const resposta =  axios.get(server, config)
    .then((response) => {
        parseString(response.data, function (err, result) {
            switch (chamada.seg) {
              case 'all':
                res.send(result);    
                break;
              case 'desc':
                res.send(result.template.description[0]);
                break;
              case 'uid':
                res.send(result.template.uid[0].value[0]);
                break;
              case 'tid':
                res.send(result.template.template_id[0].value[0]);
                break;
              case 'concept':
                res.send(result.template.concept[0]);
                break;
              case 'definition':
                res.send(result.template.definition[0]);
                break;
              default:
                res.send(result);  
                break;
            }

        });
        
    })
    .catch((error) => {
      res.send(error)

    });
    
}


function getToken(){
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJhbTEiOiI2IiwicGFyYW0yIjoiR2VzdMOjbyBQZWRpZG9zIiwiaWF0IjoxNTUwMTUwODEwLCJleHAiOjE1ODE2ODY4MTB9.bMPbgkjj8w8ToZuCsT59mytnzC6ureUkHHehqevsyQs';
    
}


module.exports = {
    OPTparser
}

