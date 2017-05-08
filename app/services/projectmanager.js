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
            res.render('addcontract', {title:'Project Management', project_id: project.id, project_adr:project_adr,  user: req.user});
        }
    });
};

const updateProject = function (req, res, next) {
    let project = req.body;
    let project_id = req.params.id;
    logger.trace(project_id);
    project.id = project_id;
    db.editProject({id: project_id}, project);
    res.redirect('/projects');
};

module.exports = {
    getAllProjects: getAllProjects,
    addProject:addProject,
    updateProject:updateProject
};