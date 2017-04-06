/**
 * Created by Zhenyu on 03.04.2017.
 */
const express = require('express');
const redis = require("redis");
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./common/config');
const db = require('./common/database');
const logger = require('./common/logger');
const auth = require('./common/authentication');
const router = express.Router();

// init Passwort System
auth.initPassport(passport);
// set up connection to mongodb
db.setup();

const redisClient = redis.createClient(config.session.redis_port, config.session.redis_url);
const app = express();

app.use(session({
    store: new RedisStore({
        url: config.session.redis_url,
        port: config.session.redis_port,
        client: redisClient
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json())

// set views folder
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// set routes
initRoutes();
app.use('/',router);

app.listen(config.server.port,function(){
    logger.trace("server is running at "+config.server.port);
});

process.on('uncaughtException', function (err) {
    logger.error('process.uncaughtException', err.message);
});


function initRoutes() {

    router.get('/',function(req,res){
        res.render('index.html');
    });

    router.get('/signup',function(req,res){
        res.render('signup.html');
    });

    router.post('/signup',passport.authenticate('local',{
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    router.use(function(req, res, next) {

        if (req.isAuthenticated()) {
            next();
        }
        res.redirect('/');
    });

    router.get('/profile',function(req,res){
        res.render('profile.html');
    });

}
