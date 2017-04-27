/**
 * Created by Zhenyu on 27.04.2017.
 */

const logger = require('../common/logger');
const db = require('../common/database');

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
    let project = req.body;
    project.ts = new Date();
    db.addProject(project);
    res.redirect('/projects');
};


module.exports = {
    getAllProjects: getAllProjects,
    addProject:addProject
};