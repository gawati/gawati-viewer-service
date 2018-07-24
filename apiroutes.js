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
winston.level = process.env.LOG_LEVEL || 'debug' ;

var router = express.Router();

router.get('/docxTohtml', (req, res, next) => {
  let url = encodeURI(req.query.docLink);
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
  
  let attachmentUrl = encodeURI(req.query.docLink);
  let xmlType = "sample"; // Will be later inferred from XML structure
  
  let configJSONPath = path.join(
    appconstants.CONFIG_FOLDER, 
    appconstants.XML_TYPES_JSON
  );  
  //Get XSLT config file location
  let xsltConfig = '';
  fs.readFile(configJSONPath, 'utf8', function (err, data) {
    xsltConfig = JSON.parse(data);

    //Get appropiate XSLT for xmlType
    fs.readFile(xsltConfig[xmlType].path, 'utf8', function (err, data) {
      xslt = data;

      // Get attachment XML that has to be converted to HTML
      axios.get(attachmentUrl).then( response => {      
        let xml = response.data;     
          
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


      }).catch( error => {
        console.error("Error in getting XML to be converted " + error);
      }); 
    });
  });
    
  
});

module.exports = router;