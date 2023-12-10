const express = require('express');
const path = require('path'); // Add this line at the top of your file

const userRouter = require('./user.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/user', userRouter);

}

module.exports = routerApi;
