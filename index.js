'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./lib/route');
const props = require("./lib/properties");
const port = props.APP_PORT;

const app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use('/', route);
app.use(function(req, res, next){
    res.status(404).send('I dont think so..');
});

app.listen(port, () => console.log(`D2D app listening on port ${port}!`))