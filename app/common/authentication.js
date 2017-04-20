/**
 * Created by Zhenyu on 03.04.2017.
 */
'use strict';
const LocalStrategy = require('passport-local').Strategy;

const db = require('./database');

function initPassport (passport) {


    passport.serializeUser(function (user, callback) {
        callback(null, user)
    });

    passport.deserializeUser(function (user, callback) {
        db.findUser(user, callback)
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
                    return done(err);
                }
                if (user && password === user.password ) {
                    return done(undefined, user);
                } else {
                    return done(undefined, false);
                }
            });
        }
    ));

    /**

    passport.use('local-signup', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            let tmp_user = {'email': email, 'passw': password};
            db.findUser(tmp_user, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(undefined, false, req.flash('message', 'email is aready used, pls try other email!'));
                } else {
                    db.saveUser(tmp_user);
                    return done(undefined, tmp_user, req.flash('message', 'new user is created successfully!') );
                }

            })
        }
    ));
     */
}

module.exports.initPassport = initPassport;


