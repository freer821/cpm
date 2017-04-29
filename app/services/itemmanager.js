/**
 * Created by Zhenyu on 24.04.2017.
 */
'use strict'
const logger = require('../common/logger');
const db = require('../common/database');

const addItem = function (req, res, next) {
    let item = req.body;
    item.status = 'Open';
    item.ts = new Date();
    item.user_email = req.user.email;
    db.addItem(item);
    res.redirect('/dashboard');
};


const editItem = function (req, res, next) {
    let item = req.body;

    if (item.note) {
        item.note.forEach ((note) => {
            if (! note.ts) {
                note.ts = new Date();
            }
        });
    }
    db.editItem({user_email:req.user.email},item);
    res.redirect('/dashboard');
};

const delItem= function(req, res, next) {
    db.delItem(req.params.id);
    res.redirect('/dashboard');
};




module.exports = {
    addItem: addItem,
    editItem:editItem,
    delItem:delItem
};