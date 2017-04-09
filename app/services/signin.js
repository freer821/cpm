/**
 * Created by Zhenyu on 03.04.2017.
 */
'use strict'
const logger = require('../common/logger');
const db = require('../common/database');

const handle = function (req, res, next) {

    let tmp_user = req.body;
    db.findUser(tmp_user, function (err, user) {
        if (err) {
            logger.error('error to call signup', err.message);
            return;
        }
        if (user) {
            req.flash('message', 'email is aready used, pls try other email!');
        } else {
            db.saveUser(tmp_user);
            res.render('login.html');
        }

    })

};

module.exports.handle = handle;