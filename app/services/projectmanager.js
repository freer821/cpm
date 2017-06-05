/**
 * Created by Zhenyu on 27.04.2017.
 */
'use strict';
const moment = require('moment');
const logger = require('../common/logger');
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
            db.editProject({id: project.id}, project);

            let project_adr = project.street+', '+project.community+', '+project.zipcode+', '+project.city;
            //res.render('addcontract', {title:'Project Management', project_id: project.id, project_adr:project_adr,  user: req.user});
            common.doJSONRespond(res,{'action':'refresh'},next);
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
        res.send(JSON.stringify({'data':filterContractsByUser(req.user.cost_code, contracts)}));
    });
};

function filterContractsByUser(user_cost_code, constracts) {
    return constracts;
    /*
    let cons = [];
    constracts.forEach((contract) => {
        let con = contract;
        con._doc.permissions_status =  common.calTotalStatusOfPermissions(contract);
        let invoices_status = common.calInvoicesStatus(contract);
        con._doc.status_finished = invoices_status.is_finished? 'finished' : 'unfinished';
        con._doc.invoices_status= invoices_status.descrip;
        cons.push(con);
    });

    return cons;

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



module.exports = {
    getAllProjects: getAllProjects,
    addProject:addProject,
    getContractByProjectID:getContractByProjectID,
    updateProject:updateProject
};