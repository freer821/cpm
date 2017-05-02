/**
 * Created by Zhenyu on 01.05.2017.
 */
const logger = require('../common/logger');
const db = require('../common/database');

const addContract = function (req, res, next) {
    contract = req.body;
    // TODO
    res.redirect('/projects');
};


module.exports = {
    addContract:addContract
};