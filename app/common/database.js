/**
 * Created by Zhenyu on 04.04.2017.
 */
'use strict';
const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');
const moment = require('moment');
const userSchema = require('./../model/user');
const depSchema = require('./../model/department');
const itemSchema = require('./../model/item');

var cpmDB;
var User;
var Department;
var Item;

const setup = function (callback) {
    connectcpmDB();

    if (typeof callback === 'function') {
        callback(cpmDB);
    }
};

function connectcpmDB() {
    mongoose.Promise = global.Promise;
    
    let options = {
        server: {
            autoReconnect: true
        }
    };

    cpmDB = mongoose.createConnection(config.mongodb.connection, options);
    cpmDB.once('open', function() {
        logger.trace('Connected to CPM MongoDB!');
    });

    cpmDB.on('error', function (err) {
        logger.error('CPM MongoDB connection error', err);
    });

    initCPMSchema();
}

function initCPMSchema() {
    User = cpmDB.model('user', userSchema, config.mongodb.collection_user);
    Department = cpmDB.model('dep', depSchema, config.mongodb.collection_department);
    Item = cpmDB.model('item', itemSchema, config.mongodb.collection_item);
}

const findUser = function (condition, callback) {
    User.findOne(condition, function (err, user) {
        if (err) {
            logger.error('error to find user', err.message);
            callback(err)
        } else {
            callback(undefined, user);
        }
    });
};

const findUsers = function (callback) {
    User.find({}, function (err, users) {
        if (err) {
            logger.error('error to find user', err.message);
            callback(err)
        } else {
            callback(undefined, users);
        }
    });
};

const saveUser = function (user) {
    User.update({email: user.email}, // Query
        { // Updates
            $set: user,
            $setOnInsert: {
                created: new Date(),
                shortname: getShortname(user.firstname,user.secondname)
            }
        },
        {upsert: true},
        function (err) {
            if (err) {
                logger.error('Failed to save user in MongoDB', user,err);
            } else {
                logger.trace('added user in MongoDB', user);
            }
        }
    );
};


function getShortname(frt,sec) {
    let first = frt? frt.substring(0,1):'';
    let second = sec? sec.substring(0,2):'';

    return first+second;
}

const delUser = function (id) {
    User.findOneAndRemove({'_id': id}, function (err, user) {
        if (err) {
            logger.error('error to del user', err.message);
        }
        // saved!
    })
};

const findDeps = function (condition, callback) {
    Department.find(condition, function (err, deps) {
        if (err) {
            logger.error('error to find deps', err.message);
            callback(err)
        } else {
            callback(undefined, deps);
        }
    });
};


const saveDep = function (dep) {
    Department.create(dep, function (err, dept) {
        if (err) {
            logger.error('Failed to save dep in MongoDB', dep,err);
        } else {
            logger.trace('added dep in MongoDB', dep);
        }
        // saved!
    });
};

const delDep = function (id) {
    Department.findOneAndRemove({'_id': id}, function (err) {
        if (err) {
            logger.error('error to del dep', err.message);
        }
        // saved!
    })
};

const addItem = function (item) {
    Item.create(item, function (err) {
        if (err) {
            logger.error('Failed to add Item in MongoDB', item,err);
        } else {
            logger.trace('added Item in MongoDB', item);
        }
    });
};


const editItem = function (condition, item) {
    Item.update(condition, // Query
        { // Updates
            $set: item
        },
        {upsert: true},
        function (err) {
            if (err) {
                logger.error('Failed to Update Item in MongoDB', item,err);
            } else {
                logger.trace('updated Item in MongoDB', item);
            }
        }
    );
};

const delItem = function (id) {
    Item.findOneAndRemove({'_id': id}, function (err) {
        if (err) {
            logger.error('error to del item', err.message);
        }
        // saved!
    })
};


const getItems = function (condition, callback) {
    Item.find(condition, function (err, items) {
        if (err) {
            logger.error('error to find items', err.message);
            callback(err)
        } else {
            callback(undefined, items);
        }
    });
};




module.exports = {
    setup: setup,
    findUser:findUser,
    saveUser:saveUser,
    findUsers: findUsers,
    delUser:delUser,
    addItem:addItem,
    editItem:editItem,
    delItem:delItem,
    getItems: getItems,
    findDeps:findDeps,
    saveDep:saveDep,
    delDep:delDep
};