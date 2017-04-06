/**
 * Created by Zhenyu on 03.04.2017.
 */

const LocalStrategy = require('passport-local').Strategy;

const user = {
    username: 'tester',
    password: 'tester',
    id: 1
};

function findUser (username, callback) {
    if (username === user.username) {
        callback(undefined, user);
    } else {
        callback();
    }
}


function initPassport (passport) {
    passport.serializeUser(function (user, callback) {
        callback(null, user.username)
    });

    passport.deserializeUser(function (username, callback) {
        findUser(username, callback)
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            findUser(username, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(undefined, false);
                }
                if (password !== user.password  ) {
                    return done(undefined, false);
                }
                return done(undefined, user);
            })
        }
    ));
}

module.exports.initPassport = initPassport;


