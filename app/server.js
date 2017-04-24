/**
 * Created by Zhenyu on 03.04.2017.
 */

// standard libs
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser'); // get information from html forms
const cookieParser = require('cookie-parser'); // read cookies (needed for auth)
const flash = require('connect-flash'); // use connect-flash for flash messages stored in session
const router = express.Router();
const fileUpload = require('express-fileupload');

// our libs
const config = require('./common/config');
const db = require('./common/database');
const logger = require('./common/logger');
const auth = require('./common/authentication');

// services
const usermanager = require('./services/usermanager');
const depmanager = require('./services/depmanager');
const itemmanager = require('./services/itemmanager');

// init Passwort System
auth.initPassport(passport);

const app = express();

// set up connection to mongodb
db.setup(function (connection) {
    app.use(cookieParser());
    app.use(session({
        store: new MongoStore({
            mongooseConnection:connection
        }),
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    logger.trace('passport init finished!');
});
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// set file upload
app.use(fileUpload());
// set view engine
app.engine('html', require('swig').renderFile);
app.set('view engine', 'html');

// set views folder
app.set('views', __dirname + '/views');
app.use('/assets', express.static(__dirname + '/views/assets'));
app.use('/pages', express.static(__dirname + '/views/pages'));
app.use('/libs', express.static(__dirname + '/views/libs'));
app.use('/scripts', express.static(__dirname + '/views/scripts'));
app.use('/upload', express.static(__dirname + '/upload/icon'));

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

    router.get('/', function(req,res){
        res.render('login');
    });

    router.post('/login',function(req, res, next) {
        passport.authenticate('local',function(err, user, info) {
            if (err) { return next(err); }
            if (user) {
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    // Redirect if it succeeds
                    if (user.role === 'admin') {
                        return res.redirect('/users');
                    } else {
                        return res.redirect('/dashboard');
                    }
                });
            } else {
                return res.redirect('/');
            }
        })(req, res, next)
    });

    router.use(function(req, res, next) {

        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/');
        }
    });

    router.get('/dashboard', usermanager.getDashInfo);

    router.get('/projects/all',function(req,res){
        res.render('project',{title:'project Management',subtitle: 'Overview Projects', user: req.user});
    });

    router.get('/projects/my',function(req,res){
        res.render('project',{title:'project Management',subtitle: 'Overview My Projects', user: req.user});
    });

    router.get('/projects/add',function(req,res){
        res.render('addandeditcontract',{title:'project Management',subtitle: 'New Contract', user: req.user});
    });

    router.get('/profile',usermanager.getCurrentUser);
    router.post('/profile/edit',usermanager.updateCurrentUserProfile);
    router.post('/user/icon/edit',usermanager.updateCurrentUserHeadIcon);

    router.get('/users',usermanager.getAllUser);

    router.get('/users/add',usermanager.adduser);
    router.post('/users/add',usermanager.adduser);

    router.get('/users/del/:id',usermanager.delUser);

    router.get('/users/edit',usermanager.editUser);
    router.post('/users/edit',usermanager.editUser);

    router.post('/items/add',itemmanager.addItem);

    router.get('/deps',depmanager.getAllDeps);
    router.post('/deps/add',depmanager.addDep);
    router.get('/deps/del/:id',depmanager.delDep);


    router.get('/logout', function (req, res){
        req.session.destroy(function (err) {
            res.redirect('/'); //Inside a callback… bulletproof!
        });
    });
}
