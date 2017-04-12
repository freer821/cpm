/**
 * Created by Zhenyu on 11.04.2017.
 */
'use strict'
const logger = require('../common/logger');
const db = require('../common/database');


const handle = function (req, res, next) {
    let request = req.body;

    if (request.action === 'adduser') {
        res.render('adduser');
    }
};

const adduser = function (req, res, next) {

    let new_user = req.body;
    db.findUser(new_user, function (err, user) {
        if (err) {
            logger.error('error to call signup', err.message);
            return;
        }
        if (user) {
            req.flash('message', 'email is aready used, pls try other email!');
        } else {
            db.saveUser(new_user);
            res.render('login.html');
        }

    })

};

module.exports.handle = handle;