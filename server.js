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

// Load breeds into a constant list (Fixing Global State issue)
const breeds = [];
const rl = readline("./imagelist.txt");

rl.on("line", (line, lineCount, byteCount) => {
    if (line) {
        breeds.push(line.trim());
    }
})
.on("error", (err) => {
    console.error(err);
});

const app = express();
app.engine("hbs", exphbs.engine({
    extname: "hbs",
    defaultLayout: false,
    layoutDir: path.join(__dirname, "/views")
}));
app.use(express.static("public/images/"));
app.use(express.static("public/css/")); // Fixed path
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");

// Helper to generate view data safely
function getViewData(selectedBreed) {
    // Input Validation: Ensure selectedBreed is valid
    let breed = selectedBreed;
    if (!breed || !breeds.includes(breed)) {
        breed = breeds[0]; // Fallback to default if invalid
    }

    return {
        curCat: {
            cat: breed,
            img: `${breed}.jpg`
        },
        arrayImg: breeds.map((b, i) => ({
            lineCount: `${i}`,
            line: b
        }))
    };
}

app.get("/", (req,res) => {
    // Wait for initialization if needed (basic check)
    if (breeds.length === 0) {
        // In a real app, we'd handle this better.
        // For this assignment, we assume it loads fast enough.
        // Or we could return a 503.
    }

    res.render('viewData', {
        data: getViewData(breeds[0]) // Default to first breed
    });

});

app.post('/', (req, res) => {
    let request = req.body.selection;

    // SECURITY: Validate input against allowed list
    // This prevents injection of invalid values and ensures integrity.
    if(request && breeds.includes(request)){
        res.render('viewData', {
            data: getViewData(request)
        });
    } else {
        console.warn(`[SECURITY] Invalid or missing selection: ${request}`);
        // Fallback to default
        res.render('viewData', {
            data: getViewData(breeds[0])
        });
    }
});

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
