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
        saveUser(user);
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
    let user = req.body;
    if (req.files && req.files.icon) {
        let icon_path = config.upload.icon+'/'+user.email;
        common.uploadUserFile(req.files.icon, icon_path, function (isOK) {
            if (isOK) {
                common.doJSONRespond(res, {'text':'User update sucess'},next);
                user.icon = icon_path+'/'+req.files.icon.name;
                saveUser(user);
            } else {
                common.doJSONRespond(res, {'text':'User update failed'},next);
            }
        });
    } else {
        saveUser(user);
        common.doJSONRespond(res, {'text':'User update sucess'},next);
    }
};

const updateCurrentUserPassw = function(req, res, next) {
    let user_passw = req.body;

    db.findUser({'email': req.user.email}, function (err, user) {
        if (err) {
            common.doJSONRespond(res, {'text':'Password update failed'},next);
        } else {
            if (user.password === user_passw.old_passw) {
                user.password = user_passw.new_passw;
                user.save();
                common.doJSONRespond(res, {'text':'Password update sucess'},next);
            } else {
                common.doJSONRespond(res, {'text':'Old Password not correct, Password update failed'},next);
            }
        }

    });

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
                    let items_emergencies_num = 0;
                    if (items) {
                        items.forEach((item) => {
                            if (item.priority === 'Emergency') {
                                items_emergencies_num++;
                            }
                        });
                    }
                    res.render('dashboard',{title:'Main', user:req.user ,items_num:items.length, items_emergencies_num:items_emergencies_num, items: items});
                }
            });            
        }
    });     
};

function saveUser(user) {
    user.ts = new Date();
    if (user.cost_code) {
        let cost_code = user.cost_code;
        user.cost_code = cost_code.toString().split(",");
    }
    db.saveUser(user);
}

module.exports = {
    adduser:adduser,
    getAllUser:getAllUser,
    delUser:delUser,
    editUser:editUser,
    getCurrentUser: getCurrentUser,
    updateCurrentUserProfile: updateCurrentUserProfile,
    updateCurrentUserPassw:updateCurrentUserPassw,
    getDashInfo: getDashInfo
};