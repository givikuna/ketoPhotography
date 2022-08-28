const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');

const pathToGmailInfo = "../data/contactGmail.txt";

app.get('/', function (req, res) {
    try {
        var infoFromURL = url.parse(req.url, true).query;
    } catch (error) {
        console.log("index.js ERROR: " + error);
    }

});
app.listen(8091);
console.log('Server running at http://127.0.0.1:8091/');

/*

    try {
        //
    } catch (error) {
        console.log("index.js ERROR: " + error);
        return "index.js ERROR: " + error;
    }

*/