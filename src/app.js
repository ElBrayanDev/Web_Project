const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

const routerApi = require('./routes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

routerApi(app);

//! Error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('____Something broke!');
});

app.listen(port, () => {
    console.log(`Port ==> ${port}`);
});