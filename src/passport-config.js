const LocalStrategy = require('passport-local').Strategy;
const { User, UserSchema } = require('./db/models/user.model');
const bcrypt = require('bcrypt');

function initializePassport(passport) {
    const authenticateUser = async (username, password, done) => {
        // Find user by username
        const user = await User.findOne({ where: { username: username } });

        if (user == null) {
            return done(null, false, { message: 'No user with that username' });
        }

        try {
            // Compare passwords
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        User.findByPk(id)
            .then(user => done(null, user))
            .catch(done);
    });
}

module.exports = initializePassport;