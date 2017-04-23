/**
 * Created by Zhenyu on 03.04.2017.
 */
'use strict';
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database');
const logger = require('./logger');

function initPassport (passport) {


    passport.serializeUser(function (user, callback) {
        callback(null, user);
    });

    passport.deserializeUser(function (user, callback) {
        db.findUser({email:user.email}, callback);
    });

    passport.use(new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            db.findUser({'email': email}, function (err, user) {
                if (err) {
                    logger.trace('user not logged in ', email );
                    return done(err);
                }
                if (user && password === user.password ) {
                    logger.trace('user logged in ', user );
                    return done(null, user);
                } else {
                    logger.trace('user not logged in ', email );
                    return done(null, false);
                }
            });
        }
    ));
}

module.exports.initPassport = initPassport;


