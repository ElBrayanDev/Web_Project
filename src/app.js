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

app.use(express.urlencoded({ extended: true }));

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

// * All teams

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

// * My team

app.post('/myteams', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('You must be logged in to view your teams.');
    }

    const user = req.user;

    // Query the database to get all the teams and their players
    const allTeamsResult = await pool.query(
        `SELECT team.id, team.nombreteam, team.idregion, array_agg(player.nombre) as players
    FROM team 
    JOIN player ON team.id = player.idteam 
    GROUP BY team.id, team.nombreteam, team.idregion`
    );

    // Query the database to get the teams that the logged-in user is a part of
    const userTeamsResult = await pool.query(
        'SELECT team.id FROM team JOIN player ON team.id = player.idteam WHERE player.nombre = $1',
        [user.username]
    );

    // Convert the rows from the second query to an array of team ids
    const userTeamIds = userTeamsResult.rows.map(row => row.id);

    // Check if the user is part of any teams
    if (userTeamIds.length === 0) {
        return res.send('You are not part of any teams. <a href="/inscription">Register a team</a>');
    }

    // Filter the teams from the first query to only include the teams that the logged-in user is a part of
    const myTeams = allTeamsResult.rows.filter(team => userTeamIds.includes(team.id));

    // Render the teams view with the filtered teams
    res.render('teams', { teams: myTeams });
});

// * Edit My teams

app.get('/editteams', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('You must be logged in to edit your teams.');
    }

    const user = req.user;

    // Query the database to get the teams that the logged-in user is a part of
    const userTeamsResult = await pool.query(
        'SELECT team.* FROM team JOIN player ON team.id = player.idteam WHERE player.nombre = $1',
        [user.username]
    );

    // Convert the rows from the second query to an array of team objects
    const userTeams = userTeamsResult.rows;

    // Render the edit teams view with the user's teams
    res.render('editteams', { teams: userTeams });
});

// * EDIT TEAMS/:id

app.post('/editteams', async (req, res) => {
    console.log(req.body);
    if (!req.user) {
        return res.status(401).send('You must be logged in to edit your teams.');
    }

    const user = req.user;
    const newTeamName = req.body.nombreteam;

    // Get the team ID from the database
    const teamIdResult = await pool.query(
        'SELECT idteam FROM player WHERE nombre = $1',
        [user.username]
    );
    const teamId = teamIdResult.rows[0].idteam;

    // Update the team in the database
    await pool.query(
        'UPDATE team SET nombreteam = $1 WHERE id = $2',
        [newTeamName, teamId]
    );

    // Redirect to a success page
    res.redirect('/teams');
});

// ! DELETE TEAM

app.get('/deleteteams', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('You must be logged in to delete your teams.');
    }

    const user = req.user;

    // Query the database to get the teams that the logged-in user is a part of
    const userTeamsResult = await pool.query(
        'SELECT team.* FROM team JOIN player ON team.id = player.idteam WHERE player.nombre = $1',
        [user.username]
    );

    // Convert the rows from the second query to an array of team objects
    const userTeams = userTeamsResult.rows;

    // Render the delete teams view with the user's teams
    res.render('deleteteams', { teams: userTeams });
});

app.post('/deleteteams', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('You must be logged in to delete your teams.');
    }

    const user = req.user;
    const teamId = parseInt(req.body.id, 10);

    // Begin a transaction
    await pool.query('BEGIN');

    try {
        // Delete the player rows that reference the team
        await pool.query(
            'DELETE FROM player WHERE idteam = $1',
            [teamId]
        );

        // Delete the team
        await pool.query(
            'DELETE FROM team WHERE id = $1',
            [teamId]
        );

        // Commit the transaction
        await pool.query('COMMIT');

        // Redirect to a success page
        res.redirect('/teams');
    } catch (error) {
        // If an error occurred, rollback the transaction
        await pool.query('ROLLBACK');
        throw error;
    }
});

// * Schedule

app.get('/schedules', async (req, res) => {
    // Query the database to get two teams with the same idregion and iddivision
    const teamsResult = await pool.query(
        'SELECT t1.nombreteam AS team1, t2.nombreteam AS team2, d.nombre AS division, r.nombre AS region FROM team t1 JOIN team t2 ON t1.idregion = t2.idregion AND t1.iddivision = t2.iddivision JOIN region r ON t1.idregion = r.id JOIN division d ON t1.iddivision = d.id WHERE t1.id < t2.id'
    );

    // Convert the rows from the query to an array of matches
    const matches = teamsResult.rows;

    // Render the schedules view with the matches
    res.render('schedules', { matches: matches });
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