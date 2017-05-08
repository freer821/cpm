/**
 * Created by Zhenyu on 01.05.2017.
 */
'use strict'
const moment = require('moment');
const logger = require('../common/logger');
const db = require('../common/database');

const addContract = function (req, res, next) {
    if (req.method === "GET") {
        res.render('addcontract', {title:'Project Management', project_id: req.query.project_id, project_adr:req.query.project_adr,  user: req.user});
    } else {
        let request = req.body;
        updateContractBasic(request, function () {
            res.redirect('/projects');
        });
    }
};

function updateContractBasic(request, callback) {
    db.countContract(function (err, count) {
        if (err) {
            logger.error('error to count contract');
            count = 0;
        }
        let contract = {
            id: getContractID(count),
            project_id: request.project_id,
            customer: request.customer,
            cost_code: request.cost_code,          // kst
            project_nr: request.project_nr,  // vom auftraggeber
            sap_nr: request.sap_nr,
            electric_nr: request.electric_nr,
            gas_nr: request.gas_nr,
            water_nr: request.water_nr,
            partner_name: request.partner_name,
            contract_delivery: request.contract_delivery? moment(request.contract_delivery): undefined,  // contract delivery auftrag_uebergeb
            doc_delivery: request.doc_delivery? moment(request.doc_delivery): undefined, // documents delivery unterlage_uebergeb
            work_content: request.work_content, // arbeitsbemerkung
            contract_typ: {            // auftrag typ
                electric: request.is_electric,     // elektro
                water: request.is_water,      // wasser
                gas: request.is_gas,         // gas
                telecom: request.is_telecom,     // telekom
                light: request.is_light,
                others: request.is_others        // others
            },
            isBombExisted: request.isBombExisted,    // bomb, weapon kampfmittell
            estimated_value: request.estimated_value,      // schaetzwert (Euro)
            manager_name: request.manager_name,   // bauleiter_name
            rot_b: request.rot_b,         // Auftrageber Telekom
            comment: request.comment,
            doc_location: {
                person: request.person,
                reason: request.reason
            }
        };

        db.editContract({id: contract.id},contract);

        if (typeof callback === 'function') {
        	callback();
        }
    });
}

function updateContractBuilding(request, callback) {
    //todo
    let contract_id = '17-44-0001-1';

    let contract = {
        building_work:{
            plan_begin: request.plan_begin,
            plan_end: request.plan_end,
            worker_name: request.worker_name,
            working_months: request.working_months,
            status: request.status
        }
    };
    db.editContract({id: contract_id},contract);
    if (typeof callback === 'function') {
        callback();
    }
}

function updateContractPermission(request, callback) {
    //todo
    let contract_id = '17-44-0001-1';

    //todo deal with array
    let contract = {
        building_permission:[{
            type: request.type,
            doc_delivery: request.doc_delivery,
            begin: request.begin,
            end: request.end,
            cost: request.cost
            //todo
            //status: request.status
        }]
    };
    db.editContract({id: contract_id},contract);
    if (typeof callback === 'function') {
        callback();
    }
}

function updateContractOFW(request, callback) {
    //todo
    let contract_id = '17-44-0001-1';

    let contract = {
        ofw:{
            permission_nr: request.permission_nr,
            worker_name: request.worker_name,
            delivery: request.delivery,
            completion_at: request.completion_at,
            clean: request.clean,
            acceptance :{
                applied: request.applied,
                granted: request.granted
            },
            //todo
            //ofw_status: request.ofw_status,
            extern_company: {
                name: request.name,
                price: request.price
            }
        }
    };
    db.editContract({id: contract_id},contract);
    if (typeof callback === 'function') {
        callback();
    }
}

function updateContractFinancial(request, callback) {
    //todo
    let contract_id = '17-44-0001-1';

    //todo deal with array
    let contract = {
        invoice:[{
            rechnung_nr: request.rechnung_nr,
            current_value: request.current_value,
            sum: request.sum,
            aufmass_am: request.aufmass_am,
            bewert_aufmass: request.bewert_aufmass,
            guts_datum: request.guts_datum,
            status: request.status
        }]
    };
    db.editContract({id: contract_id},contract);
    if (typeof callback === 'function') {
        callback();
    }
}

function updateContractFibu(request, callback) {
    //todo
    let contract_id = '17-44-0001-1';

    let contract = {
        fibu:{
            price: request.price,
            ordering_month: request.ordering_month,
            status: request.status
        }
    };
    db.editContract({id: contract_id},contract);
    if (typeof callback === 'function') {
        callback();
    }
}

function getContractID(count) {
    // TODO
    return '17-44-0001-' + (count+1).toString();
}

const getContractByProjectID = function (req, res, next) {
	let project_id = req.query.projectid;+
    db.getContracts({'project_id':project_id}, function (err, contracts) {
	    if(err) {
	        logger.error('error to find contract in db', err.message);
	    }
	    res.setHeader('Content-Type', 'application/json');
	    res.send(JSON.stringify({'data':contracts}));
	});
};

const editContract = function (req, res, next) {
    if (req.method === "GET") {
        db.getContracts({'id':req.params.id}, function (err, contracts) {
            if(err) {
                logger.error('contract id not exits: ', req.params.id);
                res.redirect('/projects');
                return;
            }
            res.render('editcontract', {title:'Contract Management', project_id: req.query.project_id, project_adr:req.query.project_adr, contract: contracts[0],  user: req.user});
        });
    } else {
        let request = req.body;

        if(req.params.action === 'basic') {
            updateContractBasic(request, function () {
                res.redirect('/projects');
            });
        } else if(req.params.action === 'building') {
            updateContractBuilding(request, function () {
                res.redirect('/projects');
            });
        } else if(req.params.action === 'permission') {
            updateContractPermission(request, function () {
                res.redirect('/projects');
            });
        } else if(req.params.action === 'ofw') {
            updateContractOFW(request, function () {
                res.redirect('/projects');
            });
        } else if(req.params.action === 'invocie') {
            updateContractFinancial(request, function () {
                res.redirect('/projects');
            });
        } else if(req.params.action === 'fibu') {
            updateContractFibu(request, function () {
                res.redirect('/projects');
            });
        }
    }
};

module.exports = {
    addContract:addContract,
    editContract:editContract,
    getContractByProjectID:getContractByProjectID
};
