// setup framework/library/dependency
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const router = express.Router();

// setup express app
const app = express();

// set up body parser
var urlencodedParser = bodyParser.urlencoded({ extended: false});
app.use(bodyParser.json());

// create a connection with db
const client = new Client({
    connectionString: 'postgres://swozymfupyxyse:cfa45d3e4a3a265ae38e5b1689bf676fd56764e0395e3ebf08911feb5cc0328f@ec2-18-210-51-239.compute-1.amazonaws.com:5432/d4gd0hvc42pi5t',
    ssl: {
        rejectUnauthorized: false
    }
});
client.connect((err) =>{
    if(err) throw err;
    console.log('postgresql connected');
});

// api
// get all words
router.get('/words', function(req, res){
    let mainQuery = "SELECT * FROM dictionary";
    let query = client.query(mainQuery, (err, results) => {
        if(err) throw err;
        let logQuery = "INSERT INTO logs (method, uri_endpoint) VALUES ('GET', '/api/words')";
        client.query(logQuery);
        res.send(JSON.stringify({"status": 200, "error": null, "response": results.rows}));
    });
});

// get a specific word
router.get('/words/:word_id', function(req, res){
    let mainQuery = "SELECT * FROM dictionary WHERE word_id ="+req.params.word_id;
    let query = client.query(mainQuery, (err, results) => {
        if(err) throw err;
        let logQuery = `INSERT INTO logs (method, uri_endpoint) VALUES ('GET', '/api/words/${req.params.word_id}')`;
        client.query(logQuery);
        res.send(JSON.stringify({"status": 200, "error": null, "response": results.rows}));
    });
});

// add a word
router.post('/words', urlencodedParser, function(req, res){
    let mainQuery = `INSERT INTO dictionary (word, description) VALUES ('${req.body.word}', '${req.body.description}')`;
    let query = client.query(mainQuery, (err, results) => {
        if(err) throw err;
        let logQuery = `INSERT INTO logs (method, uri_endpoint) VALUES ('POST', '/api/words')`;
        client.query(logQuery);
        res.send(JSON.stringify({"status": 200, "error": null, "response": results.command}));
    });
});

// update a word
router.put('/words/:word_id', function(req, res){
    let mainQuery = "UPDATE dictionary SET word='"+req.body.word+"', description='"+req.body.description+"' WHERE word_id="+req.params.word_id;
    let query = client.query(mainQuery, (err, results) => {
        if(err) throw err;
        let logQuery = `INSERT INTO logs (method, uri_endpoint) VALUES ('PUT', '/api/words/${req.params.word_id}')`;
        client.query(logQuery);
        res.send(JSON.stringify({"status": 200, "error": null, "response": results.command}));
    });
});

// delete a word
router.delete('/words/:word_id', function(req, res){
    let mainQuery = "DELETE FROM dictionary WHERE word_id ="+req.params.word_id+"";
    let query = client.query(mainQuery, (err, results) => {
        if(err) throw err;
        let logQuery = `INSERT INTO logs (method, uri_endpoint) VALUES ('DELETE', '/api/words/${req.params.word_id}')`;
        client.query(logQuery);
        res.send(JSON.stringify({"status": 200, "error": null, "response": results.command}));
    });
});

// get all logs
router.get('/logs', function(req, res){
    let mainQuery = "SELECT * FROM logs";
    let query = client.query(mainQuery, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results.rows}));
    });
});

// export as a router
module.exports = router;