const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

if (!module.parent) {
    http.createServer(function (req, res) {
        try {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });

            res.write("huh");
            return res.end();
        } catch (error) {
            console.log("select.js ERROR: " + error);
        }
    }).listen(8093);
    console.log('Server running at http://127.0.0.1:8093/');
}