/**
 * Created by Zhenyu on 27.04.2017.
 */
'use strict';
const logger = require('../common/logger');
const db = require('../common/database');
const com = require('../common/appcom');

const getAllProjects = function(req, res, next) {
    db.getProjects({}, function (err, pros) {
        if(err) {
            logger.error('error to find deps in db', err.message);
        } else if (pros) {
            res.render('project', {title:'Project Management', subtitle: 'Overview Projects', user: req.user, projects:pros});
        } else {
            res.render('project', {title:'Project Management', subtitle: 'Overview Projects', user: req.user, projects:[]});
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
            project.id = 'H'+com.zeroPad(count, 6);
            db.editProject({id: project.id}, project);

            let project_adr = project.street+', '+project.community+', '+project.zipcode+', '+project.city;
            //res.render('addcontract', {title:'Project Management', project_id: project.id, project_adr:project_adr,  user: req.user});
            res.redirect('/projects');
        }
    });
};

const updateProject = function (req, res, next) {
    let project = req.body;
    let project_id = req.params.id;
    project.id = project_id;
    db.editProject({id: project_id}, project);
    res.redirect('/projects');
};

function staticProjectContractTypes (contracts) {
    let project_types = {
        electric: false,     // elektro
        water: false,      // wasser
        gas: false,         // gas
        telecom: false,     // telekom
        light: false,
        others: false        // others
    };

    if (contracts) {
        for( var i = 0; i < contracts.length; i++) {
            let contract = contracts[i];

            if (contract.electric === true) {
                project_types.electric = true;
            }

            if (contract.water === true) {
                project_types.water = true;
            }

            if (contract.gas === true) {
                project_types.gas = true;
            }
            if (contract.telecom === true) {
                project_types.telecom = true;
            }
            if (contract.light === true) {
                project_types.light = true;
            }
            if (contract.others === true) {
                project_types.others = true;
            }
        }
    }

    return project_types;
}

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