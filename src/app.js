require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); //! new
const routerApi = require('./routes');

const bcrypt = require('bcrypt'); // crypt password
const { User, UserSchema } = require('./db/models/user.model');
const sequelize = require('./libs/sequelize');
User.init(UserSchema, User.config(sequelize));

const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');

//! new


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

initializePassport(
    passport,
    async username => await User.findOne({ where: { username: username } }),
    async id => await User.findByPk(id)
);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Dont save if nothing is modified
    saveUninitialized: false // Dont save empty value in session
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// * Login
app.post('/login', passport.authenticate('local', {
    successRedirect: '/index',
    successFlash: 'You are now logged in!',
    failureRedirect: '/index',
    failureFlash: true
}));

app.get('/index', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            // handle error
            console.log(err);
            res.redirect('/index');
        } else {
            // session destroyed
            res.redirect('/index');
        }
    });
});

// ! Register
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

// ! Team registration

const { Pool } = require('pg');
const { config } = require('./config/config');

const pool = new Pool({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
});

module.exports = { pool };

app.post('/form', async (req, res) => {
    const regionMap = {
        'Asia - Pacific': 1,
        'North America': 2,
        'Latin America': 3,
        'Europe': 4,
        'Korea': 5,
        'Brazil': 6
    };

    const teamName = req.body.team_name;
    const regionId = regionMap[req.body.region];
    const players = [
        { name: req.body.player1_name, rank: req.body.player1_rank },
        { name: req.body.player2_name, rank: req.body.player2_rank },
        { name: req.body.player3_name, rank: req.body.player3_rank },
        { name: req.body.player4_name, rank: req.body.player4_rank },
        { name: req.body.player5_name, rank: req.body.player5_rank },
        { name: req.body.player6_name, rank: req.body.player6_rank },
        { name: req.body.player7_name, rank: req.body.player7_rank }
    ];

    // Insert the team into the database
    const teamQuery = 'INSERT INTO Team (nombreteam, idregion) VALUES ($1, $2) RETURNING id';
    pool.query(teamQuery, [teamName, regionId], async (err, result) => {
        if (err) {
            console.error(err);
            res.redirect('/index');
            return;
        }

        const teamId = result.rows[0].id;

        // Insert the players into the database
        const playerQuery = 'INSERT INTO Player (nombre, idrango, idteam) VALUES ($1, $2, $3)';
        for (const player of players) {
            try {
                await pool.query(playerQuery, [player.name, player.rank, teamId]);
            } catch (err) {
                console.error(err);
                res.redirect('/index');
                return;
            }
        }

        // Redirect to a success page
        res.redirect('/teams');
    });
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

app.get('/teams', async (req, res) => {
    const teamQuery = 'SELECT * FROM Team';
    const playerQuery = 'SELECT * FROM Player WHERE idteam = $1';

    try {
        const teamResult = await pool.query(teamQuery);
        const teams = teamResult.rows;

        for (const team of teams) {
            const playerResult = await pool.query(playerQuery, [team.id]);
            team.players = playerResult.rows.map(player => player.nombre);
        }

        res.render('teams', { teams });
    } catch (err) {
        console.error(err);
        res.redirect('/index');
    }
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