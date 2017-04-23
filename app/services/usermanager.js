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
        res.render('addandedituser', {title:'User Management', action: '/users/add', subtitle:'Add User', user: req.user});
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
    if (req.files.icon) {
        let iconfile = req.files.icon;
        mkdirp(config.upload.icon+'/'+user.email, function(err) {
            if (err) {
                logger.error('failed to create folder', err.message);
                db.saveUser(user);
            } else {
                iconfile.mv(config.upload.icon+'/'+user.email+'/'+iconfile.name, function (err) {
                    if (err) {
                        logger.error('failed to save icon ', err.message);
                        db.saveUser(user);
                        return;
                    }
                    user.icon = '/upload'+'/'+user.email+'/'+iconfile.name;
                    db.saveUser(user);
                });
            }
        });
    } else {
        db.saveUser(user);
    }
    req.flash('message', 'user saved!');
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
                res.render('addandedituser', {title:'User Management',action: '/users/edit', subtitle:'Edit User', user: req.user ,currentUser:user});
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
                res.render('profile',{title:'Profile', user:req.user, currentUser:user});
            }
        });        
    }
};

const addItem = function (req, res, next) {
    let item = req.body;
    item.status = 'open';
    item.ts = new Date();
    db.addItem({email:req.user.email}, item);
    res.redirect('/dashboard');
};

const getDashInfo = function (req, res, next) {
    let user = req.user;
    db.getItems({email:user.email}, function (err, items) {
        if(err) {
            logger.error('error to find user in db', err.message);
            res.render('dashboard',{title:'Main', user:user});
        } else {
            res.render('dashboard',{title:'Main', user:user , items: items});
        }
    });
};


module.exports = {
    adduser:adduser,
    getAllUser:getAllUser,
    delUser:delUser,
    editUser:editUser,
    getCurrentUser: getCurrentUser,
    addItem: addItem,
    getDashInfo: getDashInfo
};