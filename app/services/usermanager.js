/**
 * Created by Zhenyu on 11.04.2017.
 */
'use strict'
const logger = require('../common/logger');
const db = require('../common/database');
const config = require('../common/config');
const common = require('../common/common');

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
        });
    } else {
        let new_user = req.body;
        db.findUser({'email': new_user.email}, function (err, user) {
            if (err) {
                logger.error('error to find user in db', err.message);
            } else if (user) {
                req.flash('message', 'email is aready used, pls try other email!');
            } else {
                let ui_settings = {
                   in_letzten_10 : true,
                   zum_bauplan : true, 
                   geplant : true, 
                   baust : true, 
                   ofw_n : true, 
                   ofw_f : true, 
                   vba_zu : true, 
                };
                new_user.ui_settings = ui_settings;
                saveUser(new_user);
            }
            res.redirect('/users');
        });
    }

};

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
                });
            }
        });
    } else {
        let user = req.body;
        saveUser(user);
        res.redirect('/users');
    }
};

const editUserSettings= function(req, res, next) {
    let ui_settings = req.body;
    let user = {
        email : req.user.email,
        ui_settings : ui_settings
    }
    db.saveUser(user, function (err, saved_user) {
        if (err) {
            res.render('404');
        } else {
            res.redirect('/dashboard');
        }
    });    
};

const getCurrentUser = function(req, res, next) {
    if (req.method === "GET") {
        db.findUser({email:req.user.email}, function (err, user) {
            if(err) {
                logger.error('error to find user in db', err.message);
            } else {
                // user: session user, only 4 attributes
                // currentUser: all user attributes
                res.render('profile',{title:'Profile', action: '/profile/edit', user:common.getSessionUser(user), currentUser:user});
            }
        });        
    }
};

const updateCurrentUserProfile = function(req, res, next) {
    let user = req.body;
    if (req.files && req.files.icon) {
        common.uploadUserFile(req.files.icon, config.upload.icon+'/'+user.email, function (err) {
            if (err) {
                res.render('404');
            } else {
                user.icon = '/upload/'+user.email+'/'+req.files.icon.name;
                saveUser(user,res);
            }
        });
    } else {
        saveUser(user,res);
    }
};

const updateCurrentUserPassw = function(req, res, next) {
    let user_passw = req.body;

    db.findUser({'email': req.user.email}, function (err, user) {
        if (err) {
            res.render('404');
        } else {
            if (user.password === user_passw.old_passw) {
                user.password = user_passw.new_passw;
                user.save();
                req.session.destroy(function (err) {
                    res.redirect('/'); //Inside a callback… bulletproof!
                });
            } else {
                res.render('404');
            }
        }

    });

};



const getDashInfo = function (req, res, next) {
    db.findUser({email:req.user.email}, function (err, user) {
        if(err) {
            logger.error('error to find user in db', err.message);
        } else {
            let ui_settings = user.ui_settings;
            db.getItems({user_email:req.user.email}, function (err, items) {
                if(err) {
                    logger.error('error to find user in db', err.message);
                    res.render('dashboard',{title:'Main', user:common.getSessionUser(user)});
                } else {
                    let items_emergencies_num = 0;
                    if (items) {
                        items.forEach((item) => {
                            if (item.priority === 'Emergency') {
                                items_emergencies_num++;
                            }
                        });
                    }
                    res.render('dashboard',{title:'Main', user:common.getSessionUser(user) ,items_num:items.length, items_emergencies_num:items_emergencies_num, items: items, ui_settings:ui_settings});
                }
            });            
        }
    });     
};

const test = function(req, res, next) {
    res.sendStatus(200);
};

function saveUser(user, res) {
    user.ts = new Date();
    if (user.cost_code) {
        let cost_code = user.cost_code;
        user.cost_code = cost_code.toString().split(",");
    }
    db.saveUser(user, function (err, saved_user) {

        if (res) {
            if (err) {
                res.render('404');
            } else {
                res.redirect('/profile');;
            }
        }
    });
}

module.exports = {
    adduser: adduser,
    getAllUser: getAllUser,
    delUser: delUser,
    editUser: editUser,
    getCurrentUser: getCurrentUser,
    updateCurrentUserProfile: updateCurrentUserProfile,
    updateCurrentUserPassw: updateCurrentUserPassw,
    getDashInfo: getDashInfo,
    editUserSettings: editUserSettings,
    test: test

};
