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
const projectSchema = require('./../model/project');
const contractSchema = require('./../model/contract');

const com = require('./appcom');

var cpmDB;
var User;
var Department;
var Item;
var Project;
var Contract;

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
    Project = cpmDB.model('project', projectSchema, config.mongodb.collection_project);
    Contract = cpmDB.model('contract', contractSchema, config.mongodb.collection_contract);
}

const findUser = function (condition, callback) {
    User.findOne(condition, function (err, user) {
        if (err) {
            logger.error('error to find user', err.message);
            callback(err);
        } else {
            callback(undefined, user);
        }
    });
};

const findUsers = function (callback) {
    User.find({}, function (err, users) {
        if (err) {
            logger.error('error to find user', err.message);
            callback(err);
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
            callback(err);
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
            callback(err);
        } else {
            callback(undefined, items);
        }
    });
};

const countProject = function (callback) {
    Project.count({}, function (err, count) {
        if (err) {
            logger.error('error to count projects', err.message);
            callback(err);
        } else {
            callback(undefined, count);
        }
    });
};

const editProject = function (condition, project, callback) {
    Project.update(condition, // Query
        { // Updates
            $set: project,
            $setOnInsert: {
                contract_types:{
                    electric: 0,     // elektro
                    water: 0,      // wasser
                    gas: 0,         // gas
                    telecom: 0,     // telekom
                    light: 0,
                    others: 0        // others
                },
                created: new Date()
            }
        },
        {upsert: true},
        function (err) {
            if (err) {
                logger.error('Failed to Update Project in MongoDB', project,err);
                callback(err);
            } else {
                logger.trace('add Project in MongoDB', project);
                callback(undefined);
            }
        }
    );
};


const getProjects = function (condition, callback) {
    Project.find(condition, function (err, prjects) {
        if (err) {
            logger.error('error to find projects', err.message);
            callback(err);
        } else {
            callback(undefined, prjects);
        }
    });
};

const getContracts = function (condition, callback) {
    Contract.find(condition, function (err, contracts) {
        if (err) {
            logger.error('error to find contracts', err.message);
            callback(err);
        } else {
            callback(undefined, contracts);
        }
    });
};

const editContract = function (condition, contract, callback) {
    Contract.update(condition, // Query
        { // Updates
            $set: contract,
            $setOnInsert: {
                created: new Date()
            }
        },
        {upsert: true},
        function (err) {
            if (err) {
                logger.error('Failed to Update Contract in MongoDB', contract,err);
                callback(err);
            } else {
                logger.trace('edit Contract in MongoDB', contract);
                callback(undefined);
            }
        }
    );
};

const editContractAddIntoArray = function (condition, arrayItem, callback) {
    Contract.update(condition, // Query
        { // Updates
            $push: arrayItem
        },
        {upsert: true},
        function (err) {
            if (err) {
                logger.error('Failed to Update Contract Array in MongoDB', arrayItem,err);
                callback(err);
            } else {
                logger.trace('add Contract Array in MongoDB', arrayItem);
                callback(undefined);
            }
        }
    );
};


const editContractRemoveFromArray = function (condition, arrayItem, callback) {
    Contract.update(condition, // Query
        { // Updates
            $pull: arrayItem
        },
        function (err, data) {
            if (err) {
                logger.error('Failed to remove Contract Array in MongoDB', arrayItem,err);
                callback(err);
            } else {
                logger.trace('removed Contract Array in MongoDB', arrayItem);
                callback(undefined);
            }
        }
    );
};


const countContract = function (callback) {
    Contract.count({}, function (err, count) {
        if (err) {
            logger.error('error to count projects', err.message);
            callback(err);
        } else {
            callback(undefined, count);
        }
    });
};

const updateProjectContractType = function(project_id, contract_types) {
    Project.findOne({id: project_id}, function (err, project) {
        if (contract_types.electric) {
            project.contract_types.electric +=1;
        } else {
            if (project.contract_types.electric > 0) {
                project.contract_types.electric -= 1;
            }
        }

        if (contract_types.water) {
            project.contract_types.water +=1;
        } else {
            if (project.contract_types.water > 0) {
                project.contract_types.water -= 1;
            }
        }

        if (contract_types.gas) {
            project.contract_types.gas +=1;
        } else {
            if (project.contract_types.gas > 0) {
                project.contract_types.gas -= 1;
            }
        }

        if (contract_types.telecom) {
            project.contract_types.telecom +=1;
        } else {
            if (project.contract_types.telecom > 0) {
                project.contract_types.telecom -= 1;
            }
        }

        if (contract_types.light) {
            project.contract_types.light +=1;
        } else {
            if (project.contract_types.light > 0) {
                project.contract_types.light -= 1;
            }
        }

        if (contract_types.others) {
            project.contract_types.others +=1;
        } else {
            if (project.contract_types.others > 0) {
                project.contract_types.others -= 1;
            }
        }


        project.save(function (err) {
            if(err) {
                logger.error('error to update the contract types of project', contract_types);
            }
        });

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
    delDep:delDep,
    getProjects:getProjects,
    countProject:countProject,
    editProject:editProject,
    getContracts:getContracts,
    editContract:editContract,
    editContractAddIntoArray: editContractAddIntoArray,
    editContractRemoveFromArray:editContractRemoveFromArray,
    countContract:countContract,
    updateProjectContractType:updateProjectContractType
};
