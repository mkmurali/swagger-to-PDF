


var
    fs = require('fs'),
    pdf = require('phantomjs-pdf');

   
// consts
var    
    FONT_STYLE='font-family: "Helvetica Neue",Trebuchet MS, sans-serif;font-size: 15px;color: #444';
    ALTERNATE_ROW_STYLE = ";background-color: #EAEAEA";

var jsonFile = process.argv.splice(2)[0];
console.log(jsonFile);
var swaggerJSON = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
var html = convertToHTML(swaggerJSON);
    

var sub1Counter=1; //counters for sub heading items
var sub2Counter=1;
var sub3Counter=1;
// output file
var fileName = "test.html";
// remove output file if exists
if(fs.existsSync(fileName))
    fs.unlinkSync(fileName);

// write output HTML file, then convert to PDF
fs.writeFile(fileName, html, function(err){
    if(err)
        console.log("FAILED:" + err);
    else{
        console.log("done");
        //normalize.css helps with empty pages on the end of the pdf and renders the html more consistently # http://necolas.github.io/normalize.css/
        pdf.convert({"html" : "./test.html", "css": "./normalize.css"}, function(result) {

            /* Using a buffer and callback */
            result.toBuffer(function(returnedBuffer) {
                console.log("return buffer");
            });

            /* Using a readable stream */
            var stream = result.toStream();

            /* Using the temp file path */
            var tmpPath = result.getTmpPath();

            /* Using the file writer and callback */
            result.toFile("output.pdf", function(err) {
                if(err)    
                    console.log("err:" + err);
                else
                    console.log("really done ...");

            });

            
        });

    }

});



function convertToHTML(swaggerJSON){

    var html = '';
    var genDate = new Date();
    html += "<html>"
    html += "<style>";
    html += "body {" +FONT_STYLE+"};";
    html += "p {" +FONT_STYLE+"};";
    html += "bs-callout {"
    html += "padding: 20px;";
    html += "margin: 20px 0;";
    html += "border: 1px solid #eee;";
    html += "border-left-width: 5px;";
    html += "border-radius: 3px;";
    html += "}";
    html += ".small-heading {";
    html += "font-weight: bold;";
    html += "}";
    html += ".div-container-heading-summ {";
    html += "margin-left: 20px;";
    html += "}";
    html += ".subheading-text {";
    html += "font-size: 98%;";
    html += "color: #555;";
    html += "}";
    html += ".th-heading {";
    html += "width:30%;";
    html += "text-align:left;";
    html += "}";
    html += ".th-heading-small {";
    html += "width:10%;";
    html += "text-align:left;";
    html += "}";
    html += ".table-margin {";
    html += "width:100%;";
    html += "margin-top:0px;";
    html += "}";
    html += ".table-std {";
    html += "width:100%;";
    html += "}";
    html += ".div-container-margin {";
    html += "margin-left:21px;";
    html += "margin-right:51px;";
    html += "}";
    html += ".td-alignment-small {";
    html += "vertical-align:top;";
    html += "width:20%;"
    html += "}";
    html += ".td-alignment-std {";
    html += "vertical-align:top;";
    html += "width:80%;"
    html += "}";
    html += ".td-alignment-small-no-width {";
    html += "vertical-align:top;";
    html += "}";
    html += ".td-alignment-std-no-width {";
    html += "vertical-align:top;";
    html += "}";
    html += "pre.get {";
    html += "background-color: #0f6ab4;";
    html += "}";
    html += "pre.post {";
    html += "background-color: #10a54a;";
    html += "}";
    html += "pre.put {";
    html += "background-color: #c5862b;";
    html += "}";
    html += "pre.delete {";
    html += "background-color: #a41e22;";
    html += "}";
    html += "pre {";
    html += "padding: 10px;";
    html += "margin-bottom: 2px;";
    html += "color:#FFF;";
    html += "font-size:18px;";
    html += "}";
    html += "td {";
    html += "padding-top:4px;";
    html += "padding-bottom:4px;";
    html += "padding-right:4px;";
    html += "padding-left:4px;";
    html += "}";
    html += ".page {";
    html += "page-break-after:always;";
    html += "position: fixed;";
    html += "}";
    html += ".centerAlign {";
    html += "text-align:center";
    html += "}";
    html += ".coverHeadings {";
    html += "color: #0f6ab4";
    html += "}";
    html += "@media print{.footer {position:relative;top:-50px;height:10px;text-align:center;color: #0f6ab4}}";
    html += ".moddedHR {";
    html += "border: none;";
    html += "height: 2px;";
    html += "color: #0f6ab4;";
    html += "background-color: #0f6ab4;";
    html += "}";
    html += "</style>";
    html += "<body>"
    html += '<div class="coverHeadings"><h1>Introduction</h1></div>';
    
    html += headerSummary(swaggerJSON);
 
    html += "<div style='page-break-after:always'></div>";
    html += "<div style='page-break-after:always'><div class='footer'>Generated on: " +genDate +"</div>";

    html += tableOfContents(swaggerJSON);
    html += "<div style='page-break-after:always'></div>";
    html +="</div>"; //END of second page breaker;
    html += "<div style='page-break-after:always'></div>";

    // definitions
    html += '<h2>1. Definitions</h2>';
    
    sub1Counter=1;
    for(var dfn in swaggerJSON.definitions) {
        // eg: Product (uber)
        html += '<div class="div-container-margin">'; // definitions start
        html += "<h3>1." +sub1Counter + ". " + dfn + "</h3>";
        html += "<hr />";
        html += renderDefinition(false, dfn, swaggerJSON.definitions);
        html += "<br />";
        html += '</div>'; // definitions start
        sub1Counter++;
    }


    html += renderSecurityDefinitions(swaggerJSON.securityDefinitions);
    html += "<div style='page-break-after:always'></div>";

    // paths
    html += '<h2>3. Paths</h2>';
    var pathCounter=0;
    sub3Counter=1;
    for(var path in swaggerJSON.paths){
       // if(loopBreaker===2){break;};
       if(pathCounter===0)
       {
            html += '<div class="div-container-margin">';
       }
       else
       {
             html += '<div>';
       }

        // verbs for path
        for(var action in swaggerJSON.paths[path]){
            
            switch(action)
            {
                case "get":
                    html+='<h3>3.' + sub3Counter  +'.</h3><pre class="get"><code class="huge"><span>get</span>:'+path+'</code></pre>';
                    break; 
                case "post":
                    html+='<h3>3.' + sub3Counter  +'.</h3><pre class="post"><code class="huge"><span>post</span>:'+path+'</code></pre>';
                    break;
                case "put":
                    html+='<h3>3.' + sub3Counter  +'.</h3><pre class="put"><code class="huge"><span>put</span>:'+path+'</code></pre>';
                    break;
                case "delete":
                    html+='<h3>3.' + sub3Counter  +'.</h3><pre class="delete"><code class="huge"><span>delete</span>:'+path+'</code></pre>';
                    break;
            }

            html += '<div>'; // path start
            html += "<table class='table-margin'>";

            // summary
            html += "    <tr>";
            html += "           <td class='td-alignment-small'><b>Summary</b></td>";
            html += "           <td class='td-alignment-std'>" + (typeof(swaggerJSON.paths[path][action].summary) !== "undefined"?swaggerJSON.paths[path][action].summary:"") + "</td>";
            html += "    </tr>";
            

            // description
            html += "    <tr style='" + ALTERNATE_ROW_STYLE + "'>";
            html += "           <td class='td-alignment-small'><b>Description</b></td>";
            html += "           <td class='td-alignment-std'>" + (typeof(swaggerJSON.paths[path][action].description) !== "undefined"?swaggerJSON.paths[path][action].description:"") + "</td>";
            html += "    </tr>";
            
            // operationId
            html += "    <tr>";
            html += "           <td class='td-alignment-small'><b>Operation Id</b></td>";
            html += "           <td class='td-alignment-std'>" + (typeof(swaggerJSON.paths[path][action].operationId) !== "undefined"?swaggerJSON.paths[path][action].operationId:"") + "</td>";
            html += "    </tr>";

            // action produces
            html += "    <tr style='" + ALTERNATE_ROW_STYLE + "'>";
            html += "           <td class='td-alignment-small'><b>Produces</b></td>";
            html += "           <td class='td-alignment-std'>" +(typeof(swaggerJSON.paths[path][action].produces) !== "undefined"?swaggerJSON.paths[path][action].produces.join(' '):"") + "</td>";
            html += "    </tr>";

            // action consumes
            html += "    <tr>";
            html += "           <td class='td-alignment-small'><b>Consumes</b></td>";
            html += "           <td class='td-alignment-std'>" + (typeof(swaggerJSON.paths[path][action].consumes) !== "undefined"?swaggerJSON.paths[path][action].consumes.join(' '):"") + "</td>";
            html += "    </tr>";

            // action params
            html += "    <tr>";
            html += "           <td class='td-alignment-small'><b>Parameters</b></td>";
            html += "           <td class='td-alignment-std' style='padding-left:0px!important;margin-left:0px!important'>";

            if(typeof swaggerJSON.paths[path][action].parameters !== "undefined") {
                html += "<table class='table-margin'>";
                html += "   <thead>";    
                html += "     <tr>";
                html += "       <td class='small-heading'>Name</td>";
                html += "       <td class='small-heading'>In</td>";
                html += "       <td class='small-heading'>Description</td>";
                html += "       <td class='small-heading'>Required</td>";
                html += "       <td class='small-heading'>Type</td>";
                html += "       <td class='small-heading'>Format</td>";
                html += "       <td class='small-heading'>Collection Format</td>";
                html += "       <td class='small-heading'>Default</td>";
                html += "       <td class='small-heading'>Min</td>";
                html += "       <td class='small-heading'>Max</td>";
                html += "    </tr>";
                html += "   </thead>";    

                html += "   <tbody>";    
                for (var paramIndex = 0; paramIndex < swaggerJSON.paths[path][action].parameters.length; paramIndex++) {

                    var rowStyle = "";
                    if(paramIndex % 2 == 0)
                    {
                        rowStyle = ALTERNATE_ROW_STYLE;
                    }
                    html += "   <tr style='" + rowStyle + "'>";
                    var param = swaggerJSON.paths[path][action].parameters[paramIndex];

                    // name
                    html += "       <td class='td-alignment-small-no-width'>" + param.name + "</td>";

                    // in
                    html += "       <td class='td-alignment-small-no-width'>" + param.in + "</td>";

                    // description
                    var paramDescription = param.description;
                    if(typeof param.schema !== "undefined" && typeof param.schema["$ref"] !== "undefined"){
                        var dfn = param.schema["$ref"].split('/');
                        paramDescription += "<br />" + renderDefinition(true, dfn[dfn.length-1] , swaggerJSON.definitions);
                    }

                    html += "       <td class='td-alignment-small-no-width'>" + paramDescription + "</td>";

                    // required
                    html += "       <td class='td-alignment-small-no-width'>" + ((typeof param.required !== "undefined") ? (param.required==true?"Yes":"No") : "No")  + "</td>";

                    // type
                    if(param.type == "array" && param.items!=null && param.items.type!=null){
                        html += "       <td class='td-alignment-small-no-width'>" + "array of " + param.items.type + "</td>";
                    }
                    else{
                        html += "       <td class='td-alignment-small-no-width'>" + ((typeof param.type !== "undefined") ? param.type : "") + "</td>";
                    }

                    // format
                    html += "       <td class='td-alignment-small-no-width'>" + ((typeof param.format !== "undefined") ? param.format : "") + "</td>";

                    // collection format
                    html += "       <td class='td-alignment-small-no-width'>" + ((typeof param.collectionFormat !== "undefined") ? param.collectionFormat : "") + "</td>";

                    // default
                    html += "       <td class='td-alignment-small-no-width'>" + ((typeof param.default !== "undefined") ? param.default : "") + "</td>";

                    // minimum
                    html += "       <td class='td-alignment-small-no-width'>" + ((typeof param.minimum !== "undefined") ? param.minimum : "") + "</td>";

                    // maximum
                    html += "       <td class='td-alignment-small-no-width'>" + ((typeof param.maximum !== "undefined") ? param.maximum : "") + "</td>";
                    html += "   </tr>";
                    
                }
                html += "   </tbody>";    
                html += "   </table>";

           }
           else{
               html += "<p>" + "no parameters" + "</p>";
            }

            // tags
            if(typeof swaggerJSON.paths[path][action].tags !== "undefined") {

                html += "    <tr>";
                html += "           <td class='td-alignment-small'><b>Tags</b></td>";
                html += "           <td class='td-alignment-std' style='padding-left:6px'>" + swaggerJSON.paths[path][action].tags.join(' ') + "</td>";
                html += "    </tr>";

            }
            else{
                // no tags
            }

            
            // action security 
            if(typeof swaggerJSON.paths[path][action].security !== "undefined") {

                    html += "<tr>";
                    html += "<td class='td-alignment-small'><b>Security</b></td>";
                    html += "<td class='td-alignment-std' style='padding-left:0px!important;margin-left:0px!important'>";

                    // response schema start
                    html += "<table class='table-margin' style='width:42%'>";

                    html += "   <tr>";
                      for (var securityIndex = 0; securityIndex < swaggerJSON.paths[path][action].security.length; securityIndex++) {
                            
                            var security = swaggerJSON.paths[path][action].security[securityIndex];
                            var iSec=0;
                            for(var securityItem in security){
                              html += "<td class='td-alignment-small'><b>" + securityItem + "</b> (" + swaggerJSON.paths[path][action].security[securityIndex][securityItem].join(', ') + ")" + "</td>";

                            };
                        };
                    html += "       </td>";
                    html += "   </tr>";
                    html += "   </table>";
            }
            else{
                // no security
            }
         
            // action responses
            html += "      <tr>";
            html += "           <td class='td-alignment-small'><b>Responses</b></td>";
            html += "           <td class='td-alignment-std' style='padding-left:0px!important;margin-left:0px!important'>";

            // response schema start
            html += "<table class='table-margin'>";

            html += "   <tr>";
            html += "       <td class='td-alignment-small'><b>code</b></td>";
            html += "       <td class='td-alignment-std'><b>description</b></td>";
            html += "   </tr>";
            for(var response in swaggerJSON.paths[path][action].responses) {
                // eg 200
                
                // response schema start
                html += "   <tr>";
                html += "       <td class='td-alignment-small'>" + response + "</td>";
                html += "       <td class='td-alignment-std'>" + swaggerJSON.paths[path][action].responses[response].description;


                var responseSchema = swaggerJSON.paths[path][action].responses[response].schema;
                
                // response schema
                var hasResponseSchema = false;
                var responseSchemaHTML = "";
                responseSchemaHTML += "       <table class='table-margin' style='margin-left:-5px!important'>";                
                if(typeof responseSchema !== "undefined"){
                    if(typeof responseSchema.type !== "undefined"){
                        responseSchemaHTML += "   <tr>";
                        responseSchemaHTML += "       <td style='width:20%'><b>Schema type</b></td>";
                        responseSchemaHTML += "       <td style='width:80%'>" + responseSchema.type  + "</td>";
                        responseSchemaHTML += "   </tr>";
                        hasResponseSchema = true;
                    }

                    // response schema items
                    var responseSchemaItems = responseSchema.items;
                    if(typeof responseSchemaItems !== "undefined") {
                        responseSchemaHTML += "   <tr>";
                        responseSchemaHTML += "       <td class='td-alignment-small'>&nbsp;</td>";
                        responseSchemaHTML += "       <td class='td-alignment-std'>" + renderSchemaItems(responseSchemaItems, swaggerJSON.definitions) + "</td>";
                        responseSchemaHTML += "   </tr>";
                        hasResponseSchema = true;
                    }
                    else{
                        responseSchemaHTML += "   <tr>";
                        responseSchemaHTML += "       <td class='td-alignment-small'>&nbsp;</td>";
                        responseSchemaHTML += "       <td class='td-alignment-std'>" + renderSchemaItems(responseSchema, swaggerJSON.definitions) + "</td>";
                        responseSchemaHTML += "   </tr>";
                        hasResponseSchema = true;
                    }
                }
                responseSchemaHTML += "       </table>";      
                if(hasResponseSchema)
                    html += responseSchemaHTML;

                html += "       </td>";
                html += "   </tr>";

            }
            html += "</table>";  //responses 
            html += "           </td>";     
            html += "    </tr>";
            html+='</table>'; //TABLE FOR PATH END
        }
        pathCounter++;
        sub3Counter++;
        html += '</div>';
    }

    html += "</div></div>";
    html += "</body></html>";
    return html;
}

function tableOfContents(swaggerJSON)
{

    var html='';
    html += '<div class="coverHeadings"><h1>Table of contents</h1></div>';
    html += '<h2>1. Definitions</h2>';
    sub1Counter=1;
    for(var dfn in swaggerJSON.definitions) {
        // eg: Product (uber)
        html += '<div class="div-container-margin">'; // definitions start
        html += "<span><b>1." + sub1Counter +".</b> " + dfn + "</span>";
        html += "<br><br>";
        html += '</div>'; // definitions start
        sub1Counter++;
    }
    html += renderSecurityDefinitionsTableContents(swaggerJSON.securityDefinitions);
    html += '<h2>3. Paths</h2>';
    html += pathsTableContents(swaggerJSON);
    return html;
}
function renderSecurityDefinitionsTableContents(securityDefinitions){
    var html = "";  
    sub2Counter=1;  
    // security
    html += '<h2>2. Security</h2>';
    html += '<div class="div-container-margin">'; // security start
    for(var sec in securityDefinitions) {
            html += "<span><b>2." + sub2Counter +".</b> " + sec + 
                ( typeof(securityDefinitions[sec].type) !== "undefined" ? " (" + securityDefinitions[sec].type + ")" : "" ) + "</span>";
           
            html += "<br><br>";
            sub2Counter++;
         
    }
    html += '</div>'; // security end
    return html;
}
function pathsTableContents(swaggerJSON)
{
    var html ='';
    sub3Counter=1;
    for(var path in swaggerJSON.paths){
     
     html += '<div class="div-container-margin">';
     for(var action in swaggerJSON.paths[path]){
            
            switch(action)
            {
                case "get":
                    html+='<span><b>3.' + sub3Counter +'.</b> ' +'get</span>:'+path+'';
                    break; 
                case "post":
                    html+='<span><b>3.' + sub3Counter +'.</b> ' +'post</span>:'+path+'';
                    break;
                case "put":
                    html+='<span><b>3.' + sub3Counter +'.</b> ' +'put</span>:'+path+'';
                    break;
                case "delete":
                    html+='<span><b>3.' + sub3Counter +'.</b> ' +'delete</span>:'+path+'';
                    break;
            }
            html += "<br><br>";
            sub3Counter++;
        }
         html +="</div>";
    }
    return html;
}
function renderSchemaItems(schemaItems, swaggerDefinitions){
    var html = "";

    if(typeof schemaItems["$ref"] !== "undefined"){
        // eg: #/definitions/Product
        var items = schemaItems["$ref"].split('/');
        var dfn = items[items.length-1]
        html += "See <b>" + dfn + "</b> in the <b>Definitions</b> section.";
        html += "<br />";
        html += "<br />";

        html += renderDefinition(true, dfn, swaggerDefinitions)

    }
    else{

        html += "Other schema item:" + schemaItems;

    }

    return html;
}

function renderDefinition(minimal, dfn, swaggerJSONdefinitions){

    var html = "";
    html += "<table class='table-margin'>";
    html += "   <thead>";
    html += "    <tr>";
    html += "           <th class='th-heading'><b>Name</b></td>";
    html += "           <th class='th-heading-small'><b>Type</b></td>";
    if(!minimal)
        html += "           <th class='th-heading'><b>Description</b></td>";
    html += "           <th class='th-heading'><b>Required</b></td>";
    html += "       </tr>";
    html += "   </thead>";

    html += "   <tbody>";
    var index = 0;
    for(var dfnProps in swaggerJSONdefinitions[dfn].properties){
        // eg: product_id
        var rowStyle = "";
        if(index % 2 === 0){
            rowStyle = ALTERNATE_ROW_STYLE;    
        }

        html += "   <tr style='" + rowStyle + "'>";
        html += "       <td style='width:30%;'>" + dfnProps + "</td>";
        if(swaggerJSONdefinitions[dfn].properties[dfnProps] != null){
            html += "       <td style='width:10%;'>" + ((typeof swaggerJSONdefinitions[dfn].properties[dfnProps].type !== "undefined") ? swaggerJSONdefinitions[dfn].properties[dfnProps].type : "") + "</td>";
            if(!minimal){
                html += "       <td style='width:30%;'>";
                
                if(typeof swaggerJSONdefinitions[dfn].properties[dfnProps]["$ref"] !== "undefined"){
                    var items = swaggerJSONdefinitions[dfn].properties[dfnProps]["$ref"].split('/');
                    var dfn = items[items.length-1];
                    html += "See <b>" + dfn + "</b> in the <b>Definitions</b> section.";
                }
                else if(typeof swaggerJSONdefinitions[dfn].properties[dfnProps]["items"] !== "undefined"){
                    if (typeof swaggerJSONdefinitions[dfn].properties[dfnProps]["items"] === "string") {
                        var items = swaggerJSONdefinitions[dfn].properties[dfnProps]["items"].split('/');
                        var dfn = items[items.length-1];
                        html += "See <b>" + dfn + "</b> in the <b>Definitions</b> section.";
                    }
                    else if (typeof swaggerJSONdefinitions[dfn].properties[dfnProps]["items"] === "object") {
                        if (typeof swaggerJSONdefinitions[dfn].properties[dfnProps]["items"]["$ref"] !== "undefined"){
                            var items = swaggerJSONdefinitions[dfn].properties[dfnProps]["items"]["$ref"].split('/');
                            var dfn = items[items.length-1];
                            html += "See <b>" + dfn + "</b> in the <b>Definitions</b> section.";
                        }
                    }
                }
                else{
                    html += ((typeof swaggerJSONdefinitions[dfn].properties[dfnProps].description !== "undefined") ? swaggerJSONdefinitions[dfn].properties[dfnProps].description : "");
                }
                

                html += "</td>";
            }
        }
       

        var isRequired = false;
        if(swaggerJSONdefinitions[dfn].required != null){
            isRequired = swaggerJSONdefinitions[dfn].required.indexOf(dfnProps) !== -1;
        }
        html += "       <td style='width:30%;'>" + (isRequired==true?"Yes":"No") + "</td>";
        html += "   </tr>";

        index ++;
    }
    html += "   </tbody>";
    html += "</table>";

    return html;
}

function headerSummary(swaggerJSON){

    var html = "";

    html+="<div><h1>"+ swaggerJSON.info.title +"</h1></div>";
     if(swaggerJSON.info.description != null) {
        html+= "<h3>"+ swaggerJSON.info.description.replace('\n\n', '<br />') +"</h3>";
    }
    html+="<div class='div-container-heading-summ'>";
    if(swaggerJSON.info.version != null) {
        html += "<div><span class='small-heading'>Version:</span>&nbsp;&nbsp;<span class='subheading-text'>"+swaggerJSON.info.version+"</span></div>";
    }
    if(swaggerJSON.info.termsOfService != null) {
       html += "<div><span class='small-heading'>Terms of service:</span>&nbsp;&nbsp;<span class='subheading-text'>"+swaggerJSON.info.termsOfService+"</span></div>";
    }
     if(swaggerJSON.info.contact != null){
        for(var contactMethod in swaggerJSON.info.contact){
            html += "<div><span class='small-heading'>Contact:</span>&nbsp;&nbsp;<span class='subheading-text'><strong>"+contactMethod+"</strong>: </span><span class='subheading-text'>"+swaggerJSON.info.contact[contactMethod]+"</span></div>";
        }
    }
    if(swaggerJSON.info.license != null){
        for(var licenseMethod in swaggerJSON.info.license){
            html += "<div><span class='small-heading'>License:</span>&nbsp;&nbsp;<span class='subheading-text'><strong>"+licenseMethod+"</strong>: </span><span class='subheading-text'>"+swaggerJSON.info.license[licenseMethod]+"</span></div>";
        }
    }
    if(swaggerJSON.host != null){
            html += "<div><span class='small-heading'>Host:</span>&nbsp;&nbsp;<span class='subheading-text'>"+swaggerJSON.host+"</span></div>";
    }
    if(swaggerJSON.basePath != null){
        html += "<div><span class='small-heading'>Base Path:</span>&nbsp;&nbsp;<span class='subheading-text'>"+swaggerJSON.basePath+"</span></div>";
    }
    if(swaggerJSON.produces != null){
        html += "<div><span class='small-heading'>Produces:</span>&nbsp;&nbsp;<span class='subheading-text'>"+swaggerJSON.produces.join(', ')+"</span></div>";
    }
  
    if(swaggerJSON.schemes != null){
        if(swaggerJSON.schemes.length !== 0)
        {
            html += "<div><span class='small-heading'>Scheme:</span>&nbsp;&nbsp;<span class='subheading-text'>"+swaggerJSON.schemes.join(', ')+"</span></div>";
        }
    }
    html += "</div>"

    return html;
}




function renderSecurityDefinitions(securityDefinitions){
    var html = "";   
    html += "<div style='page-break-after:always'></div>"; 
    // security
    html += '<h2>2. Security</h2>';
    html += '<div class="div-container-margin">'; // security start
    sub2Counter=1;
    for(var sec in securityDefinitions) {
            html += "<table class='table-margin'>";

            html += "<tr>";            

            html += "<td colspan='2'><h3>2." + sub2Counter +". "  + sec + "</h3>"+
                ( typeof(securityDefinitions[sec].type) !== "undefined" ? " (" + securityDefinitions[sec].type + ")" : "" ) + "</td>";

            html += "</tr>";            
            if(typeof(securityDefinitions[sec].flow) !== "undefined"){
                html += "<tr>";            
                html += "<td style='width:15%;'>Flow</td>";    
                html += "<td>" +( typeof(securityDefinitions[sec].flow) !== "undefined" ? securityDefinitions[sec].flow : "" ) + "</td>";
                html += "</tr>";       
            }
            if(typeof(securityDefinitions[sec].name) !== "undefined"){
                html += "<tr>";            
                html += "<td style='width:15%;'>Name</td>";    
                html += "<td>" +( typeof(securityDefinitions[sec].name) !== "undefined" ? securityDefinitions[sec].name : "" ) + "</td>";
                html += "</tr>";       
            }
            if(typeof(securityDefinitions[sec].authorizationUrl) !== "undefined"){
                html += "<tr>";            
                html += "<td style='width:15%;'>Authorization Url</td>";    
                html += "<td>" +( typeof(securityDefinitions[sec].authorizationUrl) !== "undefined" ? securityDefinitions[sec].authorizationUrl : "" ) + "</td>";
                html += "</tr>";       
            }

            if(typeof(securityDefinitions[sec].scopes) !== "undefined"){
                html += "<tr>";            
                html += "<td style='width:15%;vertical-align:top;'>Scopes</td>";    
                html += "<td>";
                
                html += "<table class='table-margin'>";
                for(var scope in securityDefinitions[sec].scopes) {
                    html += "<tr>";            
                    html += "<td style='width:20%;vertical-align:top;'><b>" + scope + "</b></td>";    
                    html += "<td>" +  securityDefinitions[sec].scopes[scope];
                    html += "</td>";  

                }
                html += "</table>";

                html += "</td>";
                html += "</tr>";       
            }

            html += "</table>";   
            sub2Counter++;         
    }
    html += '</div>'; // security end

    return html;
}