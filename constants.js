const API_PROTOCOL = process.env.API_PROTOCOL || "http" ;
const API_HOST = process.env.API_HOST || "localhost" ;
const API_PORT = process.env.API_PORT || "8080" ;
const API_SERVER_BASE = () =>
    API_PROTOCOL + "://" + API_HOST + ":" + API_PORT + "/exist/restxq";

const API_DOC = API_SERVER_BASE() + "/gw/doc/json";
const CONFIG_FOLDER = "configs" ;
const XML_TYPES_JSON = "xmlTypes.json";
const GAWATI_JSON = "gawati.json";


const JAVA_API_PROTOCOL = process.env.JAVA_API_PROTOCOL || "http" ;
const JAVA_API_HOST = process.env.JAVA_API_HOST || "localhost" ;
const JAVA_API_SERVER_BASE = () =>
    JAVA_API_PROTOCOL + "://" + JAVA_API_HOST ;
const XML_HTML_CONVERTER = JAVA_API_SERVER_BASE() + "/gwxsl/xslt/convert";

module.exports = {
    API_DOC: API_DOC,  
    XML_HTML_CONVERTER: XML_HTML_CONVERTER,
    CONFIG_FOLDER: CONFIG_FOLDER,
    XML_TYPES_JSON: XML_TYPES_JSON,
    GAWATI_JSON: GAWATI_JSON
};