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
            logger.error('error to add project', project);
        } else {
            let project = req.body;
            project.ts = new Date();
            project.id = 'H'+com.zeroPad(count, 6);
            db.editProject({id: project.id}, project);

            let project_adr = project.street+', '+project.community+', '+project.zipcode+', '+project.city;
            res.render('addandeditcontract', {title:'Project Management', project_id: project.id, project_adr:project_adr,  user: req.user});
        }
    });
};


module.exports = {
    getAllProjects: getAllProjects,
    addProject:addProject
};