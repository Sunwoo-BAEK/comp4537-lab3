const http = require('http');
const url = require('url');
const fs = require('fs');
const date = require('./modules/utils');
let userString = require('./lang/en/en');

const PORT = process.env.PORT || 8000;

class DateHandler {
    displayDate(req, res) {
        const req_url = url.parse(req.url, true);
        let dateString = 
        `<h1 style="color: blue;">
            ${userString.replace('user', req_url.query["name"] ?? "user")}
            ${date.getDate()}.
        </h1>`;
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(dateString);
    }
}

class FileHandler {

    writeFile(req,res) {
        const req_url = url.parse(req.url, true);
        const text = req_url.query["text"];
        fs.appendFile('file.txt', text + '\n', (err) => {
            if (err) {
                res.writeHead(500, {'content-type': 'text'});
                res.end('Error writing to file.');
            } else {
                res.writeHead(200, {'content-type': 'text'});
                res.end('Text written to file!');
            }
        })
    }

    readFile(req,res) {
        const req_url = url.parse(req.url);
        const pathname = req_url.pathname;
        const filename = pathname.replace('/readFile', '');
        fs.readFile(filename.replace('/', ''), (err, text) => {
            if (err) {
                res.writeHead(404, {'content-type': 'text'});
                res.end("404: Oh no! \""+filename+"\" file not found.");
            } else {
                res.writeHead(200, {'content-type': 'text'});
                res.end(text); // display text 
            }
        })
    }
}

class Server {
    constructor() {
        http.createServer((req,res) => {
            const pathname = url.parse(req.url).pathname;

            const files = new FileHandler();
            const date = new DateHandler();

            if (pathname.startsWith('/getDate')) {
                date.displayDate(req, res);

            } else if (pathname.startsWith('/writeFile')) {
                files.writeFile(req, res);

            } else if (pathname.startsWith('/readFile')) {
                files.readFile(req, res);

            } else {
                res.writeHead(404, {'content-type': 'text'});
                res.end('404\nOptions: getDate, writeFile, readFile.')
            }
        }).listen(PORT);
        console.log('Starting server...');
        // http://localhost:8000
    }
}

new Server();