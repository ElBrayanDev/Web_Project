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
    const cache = require('memory-cache');

    passport.deserializeUser((id, done) => {
        // Try to get the user data from the cache
        const user = cache.get(id);

        if (user) {
            // If the user data is in the cache, use it
            done(null, user);
        } else {
            // If the user data is not in the cache, get it from the database
            User.findByPk(id)
                .then(user => {
                    // Store the user data in the cache for future requests
                    cache.put(id, user);

                    done(null, user);
                })
                .catch(err => {
                    return done(err);
                });
        }
    });
}

module.exports = initializePassport;