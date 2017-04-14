/**
 * Created by Zhenyu on 04.04.2017.
 */
'use strict';
const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');
const moment = require('moment');
const userSchema = require('./../model/user');

var cpmDB;
var User;

const setup = function (callback) {
    connectcpmDB();

    if (typeof callback === 'function') {
        callback(cpmDB);
    }
};

function connectcpmDB() {
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
}

const findUser = function (user, callback) {
    User.findOne({'email': user.email}, function (err, user) {
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
    User.create(user, function (err, user) {
        if (err) {
            logger.error('error to save user', err.message);
        }
        // saved!
    })
};

module.exports = {
    setup: setup,
    findUser:findUser,
    saveUser:saveUser,
    findUsers: findUsers
};