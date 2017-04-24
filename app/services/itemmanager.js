/**
 * Created by Zhenyu on 24.04.2017.
 */
'use strict'
const logger = require('../common/logger');
const db = require('../common/database');

const addItem = function (req, res, next) {
    let item = req.body;
    item.status = 'open';
    item.ts = new Date();
    item.user_email = req.user.email;
    db.addItem(item);
    res.redirect('/dashboard');
};


module.exports = {
    addItem: addItem
};