// setup framework/library/dependency
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes/api');
const port = parseInt(process.env.PORT, 10) || 8080;
const cors = require('cors');

// setup express app
const app = express();

// setup cors
app.use(cors());

// handle change body to json
app.use(bodyParser.json());

// routing
app.use('/api', routes);

// listen for request
app.listen(port, function(){
    console.log(`now listening on port ${port}`);
});

