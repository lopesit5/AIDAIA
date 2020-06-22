'user strict'
const axios = require('axios')
const qs = require('querystring');
const parseString = require('xml2js').parseString;
const fs = require('fs');
const path = require('path');


const xmlparser = (req, res) =>{
    const chamada ={
      segmento:req.params.seg
    }
    
    console.log("sdsf");
    fs.readFile(path.join(__dirname, '../../exemplo.xml'), {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            parseString(data, function (err, result) {
                if(chamada.segmento == 'Header'){
                    res.send(result.AuditFile);
                } else if(chamada.segmento == 'Produtos'){
                    var Products = result.AuditFile.MasterFiles[0].Product;                    
                    res.send();
                } else if(chamada.segmento == 'Taxas'){
                    res.send(result.AuditFile.MasterFiles[0].TaxTable);
                } else if(chamada.segmento == 'Customers'){
                    res.send(result.AuditFile.MasterFiles[0].Customer);
                } else if(chamada.segmento == 'Invoices'){
                    res.send(result.AuditFile.SourceDocuments[0].SalesInvoices[0].Invoices);
                } else if(chamada.segmento == 'InvoicesNOfEntries'){
                    res.send(result.AuditFile.SourceDocuments[0].SalesInvoices[0].NumberOfEntries[0]);
                } else if(chamada.segmento == 'InvoicesTotalDebit'){
                    res.send(result.AuditFile.SourceDocuments[0].SalesInvoices[0].TotalDebit[0]);
                } else if(chamada.segmento == 'InvoicesTotalCredit'){
                    res.send(result.AuditFile.SourceDocuments[0].SalesInvoices[0].TotalCredit[0]);
                } else {
                    res.send('segmento incorreto');
                }
            });
        } else {
            console.log(err);
        }
    });
    
}

module.exports = {
    xmlparser
}

