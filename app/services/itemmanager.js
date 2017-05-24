/**
 * Created by Zhenyu on 24.04.2017.
 */
'use strict'
const logger = require('../common/logger');
const db = require('../common/database');
var ObjectId = require('mongoose').Types.ObjectId;

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
    db.editItem({_id:item._id},item);
    res.send('ok');
};


const delItem= function(req, res, next) {
    db.delItem(req.params.id);
    res.redirect('/dashboard');
};


const editItemsStatus = function(req, res, next){
    let data = req.body;
    data.ids.forEach((id) => {
        db.editItem({_id:new ObjectId(id)},{'status':data.status});
    });
    //db.editItem({_id:{$in:ids_obj}},{'status':data.status});
    res.send('ok');
};


module.exports = {
    addItem: addItem,
    editItem:editItem,
    delItem:delItem,
    editItemsStatus:editItemsStatus
};