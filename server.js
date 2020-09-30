/*
    npm express-handlebars.js
    Web322 Assignment 1 - Cat Breed Gallery
    Author: Eugene Chung - use node ./npm\ express-handlebars.js
    Professor: George Tsang

    npm:

        npm install express --save
        npm install body-parser --save
        npm install express-handlebars --save
        npm install path --save
        nopm install linebyline --save

    References:


*/

var port = process.env.PORT || 8080;

const express = require("express");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require("path");
const readline = require("linebyline");

const rl = readline("./imagelist.txt");
var someData = { curCat:[], arrayImg:[]};

const app = express();
app.engine("hbs", exphbs({
    extname: "hbs",
    defaultLayout: false,
    layoutDir: path.join(__dirname, "/views")
}));                              //  1st parameter: "hbs" is to be the internal engine name for express-handlebars
                                                                            //  2nd parameter: specifies the extension name/extname (hbs) of handlebars files
app.use(express.static("public/images/"));
app.use(express.static("/public/css/"));
app.use(bodyParser.urlencoded({ extended: true }));
                          //  Identifies the views subfolder (2nd parameter) as the folder containing all handlebars template files
app.set("view engine", "hbs");                                              //  Identifies hbs (the internal engine name) as the view engine to be used for this server program

rl.on("line", (line, lineCount, byteCount)=>{
    //console.log(`line # ${lineCount} => ${line} <= ${byteCount}`);
    if (lineCount == 0){
        someData.curCat = {"cat":line, "img":`${line}.jpg`};
        //console.log(someData.curCat.img);
    }
    someData.arrayImg.push({"lineCount":`${lineCount}` , "line":`${line}`});

})
.on("error", (err) => {
    console.error(err);
});

app.get("/", (req,res) => {   //  Set up viewData route to "render" the handlebars file with data
    someData.curCat.img = `${someData.arrayImg[0].line}.jpg`
    //console.log(someData.curCat.img); //debug purposes
    res.render('viewData', {                                                      //  Invokes the render method on the response (res) object
        data: someData
    });

});
app.post('/', (req, res) => {
    let request = req.body.selection;
    if(request){
        //console.log(request + '.jpg');
        someData.curCat = {cat: `${request}`, img: `${request}.jpg`};
    }else{
        console.log("IT IS EMPTY!");
    }

    res.render('viewData', {                                                      //  Invokes the render method on the response (res) object
        data: someData
    });
});
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
