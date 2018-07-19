const express = require('express');
const path = require('path');

const winston = require('winston');
const Querystring = require('query-string');

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const axios = require("axios");
const mammoth = require('mammoth');
const appconstants = require('./constants.js');


/**
 * Log level
 */
winston.level = process.env.LOG_LEVEL || 'error' ;

var router = express.Router();

router.get('/docxTohtml', (req, res, next) => {
  let url = encodeURI(req.query.docxLink);
  axios.get(url,{responseType: 'arraybuffer'}).then(response => {
    mammoth.convertToHtml(response.data)
    .then(function(result){
      res.status(200).send(result.value);
    }).done();
  }).catch(error => {
    console.log(error);
  });  
});

router.get('/xmlToHtml',(req, res, next) => { 
  let configJSONPath = path.join(
    appconstants.CONFIG_FOLDER, 
    appconstants.XML_TYPES_JSON
  );  
  
  //Get XML that contains metadata
  axios.get(appconstants.API_DOC,{
    params : {
      iri : req.query.iri
    }
  }).then(response => {    
    let xmlType = response.data.akomaNtoso.act.meta.proprietary.gawati.embeddedContents.embeddedContent.type;
    let url = encodeURI(req.query.xmlLink);

    //Get XSLT location
    let xsltConfig = '';
    fs.readFile(configJSONPath, 'utf8', function (err, data) {
      xsltConfig = JSON.parse(data);

      //Get appropiate XSLT for xmlType
      fs.readFile(xsltConfig[xmlType].path, 'utf8', function (err, data) {
        xslt = data;

        // Get actual XML that has to be converted to HTML
        axios.get(url).then( response => {      
          let xml = response.data;     
          
          // Get configuration for the service that converts XML to HTML
          axios.get('/gwp/gawati.json').then(response => {      
            
            // Send XML for conversion to service
            axios({
                method: 'post',
                url: appconstants.XML_HTML_CONVERTER,
                data:  Querystring.stringify({ 
                  "input_file" : xml,
                  "input_xslt" : xslt,
                  "input_params" : ''
                }),
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
                }
              }).then(response => {           
                res.status(200).send(response.data);
              }).catch(error => {
                console.error("Error in xml to html conversion using provided XSLT " + error);
              }); 

          });

        }).catch( error => {
          console.error("Error in getting XML to be converted " + error);
        }); 
      });
    });
    
  }).catch(error => {
    console.log("Error in getting XML that contains metadata " + error);
  });
});

module.exports = router;