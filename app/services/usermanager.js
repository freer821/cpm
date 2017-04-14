/**
 * Created by Zhenyu on 11.04.2017.
 */
'use strict'
const mkdirp = require('mkdirp');
const logger = require('../common/logger');
const db = require('../common/database');
const config = require('../common/config');


const handle = function (req, res, next) {
    if (req.query.action === 'adduser') {
        res.render('adduser');
    }
};

const adduser = function (req, res, next) {

    let new_user = req.body;
    db.findUser(new_user, function (err, user) {
        if (err) {
            logger.error('error to call signup', err.message);
        }
        if (user) {
            req.flash('message', 'email is aready used, pls try other email!');
        } else {
            if (req.files) {
                let iconfile = req.files.icon;
                mkdirp(config.upload.icon+'/'+new_user.email, function(err) {
                    if (err) {
                        logger.error('failed to create folder', err.message);
                        return;
                    }
                    iconfile.mv(config.upload.icon+'/'+new_user.email+'/'+iconfile.name, function (err) {
                        if (err) {
                            logger.error('failed to save icon ', err.message);
                            return;
                        }
                        new_user.icon = '/upload'+'/'+new_user.email+'/'+iconfile.name;
                    });
                });
            }
            db.saveUser(new_user);
            req.flash('message', 'user saved!');
        }
        res.render('useroverview');
    });
};
module.exports.handle = handle;
module.exports.adduser = adduser;