const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); //! new
const routerApi = require('./routes');
const bcrypt = require('bcrypt'); // crypt password

const { User, UserSchema } = require('./db/models/user.model');
const sequelize = require('./libs/sequelize');
User.init(UserSchema, User.config(sequelize));

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));


app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        res.redirect('/index');
    } catch (err) {
        console.error(err);
        res.redirect('/index');
    }
});

//@ Routes

app.get('/index', (req, res) => {
    res.render('index.ejs')
});

app.get('/inscription', (req, res) => {
    res.render('form.ejs')
});

app.get('/schedules', (req, res) => {
    res.render('schedule.ejs')
});

app.get('/teams', (req, res) => {
    res.render('teams.ejs')
});

//@ End Routes

routerApi(app);

//! Error handler
/*
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});*/

app.listen(port, () => {
    console.log(`Port ==> ${port}`);
});