/**
 * Created by Zhenyu on 11.04.2017.
 */
'use strict'
const mkdirp = require('mkdirp');
const logger = require('../common/logger');
const db = require('../common/database');
const config = require('../common/config');

const adduser = function (req, res, next) { 

    if (req.method === "GET") {
        db.findDeps({}, function (err, deps) {
            if (deps) {
                res.render('addandedituser', {title:'User Management', action: '/users/add', subtitle:'Add User', user:req.user, deps:deps});
                return;
            }
            if(err) {
                logger.error('error to find deps in db', err.message);
            } 
            res.render('addandedituser', {title:'User Management', action: '/users/add', subtitle:'Add User', user: req.user, deps:[]});
            return;
        });
    } else {
        let new_user = req.body;
        db.findUser({'email': new_user.email}, function (err, user) {
            if (err) {
                logger.error('error to find user in db', err.message);
            } else if (user) {
                req.flash('message', 'email is aready used, pls try other email!');
            } else {
                saveUser(req,new_user);
            }
            res.redirect('/users');
        });
    }

};

function saveUser(req,user) {
    user.ts = new Date();
    if (user.cost_code) {
        let cost_code = user.cost_code;
        user.cost_code = cost_code.toString().split(",");
    }
    db.saveUser(user);
    req.flash('message', 'user saved!');
}

function saveUserHeadIcon(req,res,user){
    if (!req.files) return false;
    if (!req.files.icon) return false;

    let iconfile = req.files.icon;

    mkdirp(config.upload.icon+'/'+user.email, function(err) {
        if (err) {
            logger.error('failed to create folder', err.message);
            return false;
        }

        iconfile.mv(config.upload.icon+'/'+user.email+'/'+iconfile.name, function (err) {
            if (err) {
                logger.error('failed to save icon ', err.message);
                return false;
            }
            user.icon = '/upload'+'/'+user.email+'/'+iconfile.name;
            db.saveUser(user);
            res.redirect('/profile');
            return true;
        });
    });
}

const getAllUser = function(req, res, next) {
    db.findUsers(function (err, users) {
       if(err) {
           logger.error('error to find users in db', err.message);
       } else if (users) {
           res.render('useroverview', {title:'User Management', subtitle: 'Overview Users', user: req.user, users:users});
       } else {
           res.render('useroverview', {title:'User Management', subtitle: 'Overview Users', user: req.user, users:[]});
       }
    });
};

const delUser = function(req, res, next) {
    db.delUser(req.params.id);
    res.redirect('/users');
};

const editUser = function(req, res, next) {
    if (req.method === "GET") {
        db.findUser({'email': req.query.email}, function (err, user) {
            if(err) {
                logger.error('error to find user in db', err.message);
            } else {
                db.findDeps({}, function (err, deps) {
                    if (deps) {
                        res.render('addandedituser', {title:'User Management',action: '/users/edit', subtitle:'Edit User', user: req.user ,currentUser:user, deps:deps});
                        return;
                    }
                    if(err) {
                        logger.error('error to find deps in db', err.message);
                    } 
                    res.render('addandedituser', {title:'User Management',action: '/users/edit', subtitle:'Edit User', user: req.user ,currentUser:user, deps:[]});
                    return;
                });                
            }
        });
    } else {
        let user = req.body;
        saveUser(req,user);
        res.redirect('/users');
    }
};

const getCurrentUser = function(req, res, next) {
    if (req.method === "GET") {
        db.findUser({email:req.user.email}, function (err, user) {
            if(err) {
                logger.error('error to find user in db', err.message);
            } else {
                // user: session user, only 4 attributes
                // currentUser: all user attributes
                res.render('profile',{title:'Profile', action: '/profile/edit', user:req.user, currentUser:user});
            }
        });        
    }
};

const updateCurrentUserProfile = function(req, res, next) {
    if (req.method === "POST") {
        let user = req.body;
        saveUser(req,user);
        if (saveUserHeadIcon(req,res,req.user) == false);
            res.redirect('/profile');
    }
};

//not used yet
const updateCurrentUserHeadIcon = function(req, res, next) {
    if (req.method === "POST") {
        saveUserHeadIcon(req,res,req.user);
    }
};

const getDashInfo = function (req, res, next) {
    db.findUser({email:req.user.email}, function (err, user) {
        if(err) {
            logger.error('error to find user in db', err.message);
        } else {
            db.getItems({user_email:req.user.email}, function (err, items) {
                if(err) {
                    logger.error('error to find user in db', err.message);
                    res.render('dashboard',{title:'Main', user:req.user});
                } else {
                    res.render('dashboard',{title:'Main', user:req.user , items: items});
                }
            });            
        }
    });     
};


module.exports = {
    adduser:adduser,
    getAllUser:getAllUser,
    delUser:delUser,
    editUser:editUser,
    getCurrentUser: getCurrentUser,
    updateCurrentUserProfile: updateCurrentUserProfile,
    updateCurrentUserHeadIcon: updateCurrentUserHeadIcon,
    getDashInfo: getDashInfo
};