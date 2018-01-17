//------------------------------------------------------------------------------
// node.js starter application for hosting
//------------------------------------------------------------------------------

const express    = require('express');
const fs         = require('fs');
const app        = express();
const config     = require(__dirname + '/gulp.config.json');

let port    = config.port.proxy;
port        = (process.env.hasOwnProperty('APP_PORT')) ? process.env.APP_PORT : port;

// Use basic auth if .htpasswd file is present
if (fs.existsSync(__dirname + '/.htpasswd')) {
    let auth     = require('http-auth');
    let basic    = auth.basic({
        realm    : "YCTK.",
        file     : __dirname + "/.htpasswd"
    });

    app.use(auth.connect(basic));
}


// serve the files out of ./dist
app.use(express.static(__dirname + '/dist'));


// start server on the specified port and binding host
app.listen(port, '0.0.0.0', function() {
    console.log("[00:00:00] Server running...");
});
