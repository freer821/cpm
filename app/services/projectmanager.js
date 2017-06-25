/**
 * Created by Zhenyu on 27.04.2017.
 */
'use strict';
const moment = require('moment');
const logger = require('../common/logger');
const config = require('../common/config');
const db = require('../common/database');
const common = require('../common/common');


const getAllProjects = function(req, res, next) {
    db.getProjects({}, function (err, pros) {
        if(err) {
            logger.error('error to find deps in db', err.message);
        } else {
            res.render('project', {title:'Project Management', subtitle: 'Overview Projects', user: req.user, projects:pros});
        }
    });
};

const addProject = function (req, res, next) {
    db.countProject(function (err, count) {
        if (err) {
            logger.error('error to add project');
        } else {
            let project = req.body;
            project.ts = new Date();
            project.id = 'H'+common.zeroPad(count, 6);
            project.files_path = config.files.root_path+project.id;
            db.editProject({id: project.id}, project);

            common.createFolder(project.files_path);
            common.createFolder(project.files_path+config.files.fremdleitungsplan_path);
            common.createFolder(project.files_path+config.files.genehmigung_path);

            common.doJSONRespond(res,{'action':'add_con','project':project},next);
        }
    });
};

const getProject = function (req, res, next) {
    db.findProject(req.params.id, function (err, project) {
        if(err) {
            logger.error('error to find project in db:', req.params.id);
            common.doJSONRespond(res,{'err':'error to find project in db: '+req.params.id}, next);
        } else {
            common.doJSONRespond(res,{'project':project}, next);
        }
    });
};

const updateProject = function (req, res, next) {
    let project = req.body;
    let project_id = req.params.id;
    project.id = project_id;
    db.editProject({id: project_id}, project);
    common.doJSONRespond(res,{'action':'refresh'},next);
};

const getContractByProjectID = function (req, res, next) {
    db.getContracts({'project_id':req.params.id}, function (err, contracts) {
        if(err) {
            logger.error('error to find contract in db', err.message);
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({'contracts':filterContractsByUser(req.user.cost_code, contracts)}));
    });
};

function filterContractsByUser(user_cost_code, constracts) {

    let cons = [];
    constracts.forEach((contract) => {
        let con = contract;
        con._doc.current_value =  calCurrentValue(contract);
        cons.push(con);
    });

    return cons;

    /*
     if (user_cost_code) {
     if (Array.isArray(user_cost_code)){
     return constracts.filter(function (constract) {
     return user_cost_code.includes(constract.cost_code);
     });
     } else {
     return constracts.filter(function (constract) {
     return user_cost_code===constract.cost_code;
     });
     }
     } else {
     return [];
     }
     */
}

function calCurrentValue(contract) {
    let current_value = 0;
    if (contract.invoice && contract.invoice.length > 0) {
        contract.invoice.forEach((invo) =>{
            current_value += invo.sum? invo.sum:0;
        });
    } else {
        if (contract.estimated_value && contract.building_work && contract.building_work.procent_completion) {
            current_value = contract.building_work.procent_completion/100*parseInt(contract.estimated_value);
        }
    }
    return current_value;
}

module.exports = {
    getAllProjects: getAllProjects,
    addProject:addProject,
    getContractByProjectID:getContractByProjectID,
    updateProject:updateProject,
    getProject:getProject
};