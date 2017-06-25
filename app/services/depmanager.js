/**
 * Created by Zhenyu on 23.04.2017.
 */
'use strict'
const logger = require('../common/logger');
const db = require('../common/database');


const getAllDeps = function(req, res, next) {
    db.findDeps({}, function (err, deps) {
        if(err) {
            logger.error('error to find deps in db', err.message);
        } else if (deps) {
            res.render('depmanagement', {title:'Department Management', subtitle: 'Overview Departments', user: req.user, deps:deps});
        } else {
            res.render('depmanagement', {title:'Department Management', subtitle: 'Overview Departments', user: req.user, deps:[]});
        }
    });
};


const addDep = function(req, res, next) {
    let dep = req.body;
    db.saveDep(dep);
    res.redirect('/deps');
};

const delDep = function(req, res, next) {
    db.delDep(req.params.id);
    res.redirect('/deps');
};



module.exports = {
    getAllDeps:getAllDeps,
    addDep:addDep,
    delDep:delDep
};
