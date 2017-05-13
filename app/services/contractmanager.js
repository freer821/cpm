/**
 * Created by Zhenyu on 01.05.2017.
 */
'use strict'
const moment = require('moment');
const logger = require('../common/logger');
const db = require('../common/database');
const common = require('../common/appcom');
var ObjectId = require('mongoose').Types.ObjectId;

const addContract = function (req, res, next) {
    if (req.method === "GET") {
        res.render('addcontract', {title:'Project Management', project_id: req.query.project_id, project_adr:req.query.project_adr,  user: req.user});
    } else {
        let request = req.body;
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
                contract_delivery: common.getDate(request.contract_delivery),  // contract delivery auftrag_uebergeb
                doc_delivery: common.getDate(request.doc_delivery), // documents delivery unterlage_uebergeb
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
                is_building_permission_activ: request.is_building_permission_activ,
                is_ofw_activ: request.is_ofw_activ,
                comment: request.comment,
                doc_location: {
                    person: request.person,
                    reason: request.reason
                }
            };

            db.editContract({id: contract.id},contract);

            res.redirect('/projects');
        });
    }
};

function updateContractBasic(request, callback) {

    let contract = {
        customer: request.customer,
        cost_code: request.cost_code,          // kst
        project_nr: request.project_nr,  // vom auftraggeber
        sap_nr: request.sap_nr,
        electric_nr: request.electric_nr,
        gas_nr: request.gas_nr,
        water_nr: request.water_nr,
        partner_name: request.partner_name,
        contract_delivery: common.getDate(request.contract_delivery),  // contract delivery auftrag_uebergeb
        doc_delivery: common.getDate(request.doc_delivery), // documents delivery unterlage_uebergeb
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
        is_building_permission_activ: request.is_building_permission_activ,
        is_ofw_activ: request.is_ofw_activ,
        comment: request.comment,
        doc_location: {
            person: request.person,
            reason: request.reason
        }
    };

    db.editContract({id: request.contract_id},contract);

    if (typeof callback === 'function') {
        callback();
    }
}

function updateContractBuilding(request, callback) {

    let contract = {
        building_work:{
            plan_begin: common.getDate(request.plan_begin),
            plan_end: common.getDate(request.plan_end),
            worker_name: request.worker_name,
            working_months: request.working_months,
            status: request.status
        }
    };
    db.editContract({id: request.contract_id},contract);
    if (typeof callback === 'function') {
        callback();
    }
}

function updateContractPermission(request, callback) {

    if (request.permission_id) {
        let permission = {
            "building_permission.$.type": request.type,
            "building_permission.$.doc_delivery": common.getDate(request.doc_delivery),
            "building_permission.$.begin": common.getDate(request.begin),
            "building_permission.$.end": common.getDate(request.end),
            "building_permission.$.cost": request.cost
            //todo
            //status: request.status
        };

        db.editContract({id: request.contract_id, building_permission: {$elemMatch: {_id : request.permission_id}}},permission);
    } else {
        let permission = {
            type: request.type,
            doc_delivery: common.getDate(request.doc_delivery),
            begin: common.getDate(request.begin),
            end: common.getDate(request.end),
            cost: request.cost
            //todo
            //status: request.status
        };

        db.editContractAddIntoArray({id: request.contract_id},{building_permission: permission});
    }

    if (typeof callback === 'function') {
        callback();
    }
}

function updateContractOFW(request, callback) {

    let contract = {
        ofw:{
            permission_nr: request.permission_nr,
            worker_name: request.worker_name,
            delivery: common.getDate(request.delivery),
            completion_at: common.getDate(request.completion_at),
            clean: request.clean,
            acceptance :{
                applied: common.getDate(request.applied),
                granted: common.getDate(request.granted)
            },
            typ:{
                bausstr: request.bausstr,
                fahrbahn: request.fahrbahn,
                fussweg: request.fussweg,
                bitu: request.bitu,
                pflaster: request.pflaster,
                beton: request.beton
            },
            ueberdicken: common.getNumValue(request.ueberdicken)
            //todo
            //ofw_status: request.ofw_status,
        }
    };
    db.editContract({id: request.contract_id},contract);
    if (typeof callback === 'function') {
        callback();
    }
}

function updateContractFinancial(request, callback) {

    if (request.invocie_id) {
        let invoice = {
            "invoice.$.rechnung_nr": request.rechnung_nr,
            "invoice.$.current_value": request.current_value,
            "invoice.$.sum": request.sum,
            "invoice.$.aufmass_am": common.getDate(request.aufmass_am),
            "invoice.$.bewert_aufmass": common.getDate(request.bewert_aufmass),
            "invoice.$.guts_datum": common.getDate(request.guts_datum),
            "invoice.$.status": request.status
        };

        db.editContract({id: request.contract_id, invoice: {$elemMatch: {_id : request.invocie_id}}},invoice);
    } else {
        let invoice = {
            rechnung_nr: request.rechnung_nr,
            current_value: request.current_value,
            sum: request.sum,
            aufmass_am: common.getDate(request.aufmass_am),
            bewert_aufmass: common.getDate(request.bewert_aufmass),
            guts_datum: common.getDate(request.guts_datum),
            status: request.status
        };

        db.editContractAddIntoArray({id: request.contract_id},{invoice: invoice});
    }

    if (typeof callback === 'function') {
        callback();
    }
}

function updateContractFibu(request, callback) {

    let contract = {
        fibu:{
            price: request.price,
            ordering_month: request.ordering_month,
            status: request.status
        }
    };
    db.editContract({id: request.contract_id},contract);
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
                let ret= 'update operation done!!';
                res.send(ret);
            });
        } else if(req.params.action === 'building') {
            updateContractBuilding(request, function () {
                let ret= 'update operation done!!';
                res.send(ret);
            });
        } else if(req.params.action === 'permission') {
            updateContractPermission(request, function () {
                db.getContracts({'id':request.contract_id}, function (err, contracts) {
                    if(err) {
                        logger.error('contract id not exits: ', req.params.id);
                        res.redirect('/projects');
                        return;
                    }
                    res.render('editcontract', {title:'Contract Management', project_id: request.project_id, project_adr:request.project_adr, contract: contracts[0],  user: req.user, jump_building_permission:'1'});
                }); 
            });
        } else if(req.params.action === 'ofw') {
            updateContractOFW(request, function () {
                let ret= 'update operation done!!';
                res.send(ret);
            });
        } else if(req.params.action === 'invocie') {
            updateContractFinancial(request, function () {
                db.getContracts({'id':request.contract_id}, function (err, contracts) {
                    if(err) {
                        logger.error('contract id not exits: ', req.params.id);
                        res.redirect('/projects');
                        return;
                    }
                    res.render('editcontract', {title:'Contract Management', project_id: request.project_id, project_adr:request.project_adr, contract: contracts[0],  user: req.user, jump_financial:'1'});
                }); 
            });
        } else if(req.params.action === 'fibu') {
            updateContractFibu(request, function () {
                let ret= 'update operation done!!';
                res.send(ret);
            });
        }
    }
};

const delContract = function (req, res, next) {
    if(req.params.action === 'permission') {
        db.editContractRemoveFromArray({'id':req.params.id},{building_permission: {_id: new ObjectId(req.query.id)}}, function () {
            db.getContracts({'id':req.params.id}, function (err, contracts) {
                if(err) {
                    logger.error('contract id not exits: ', req.params.id);
                    res.redirect('/projects');
                    return;
                }
                res.render('editcontract', {title:'Contract Management', project_id: req.query.project_id, project_adr:req.query.project_adr, contract: contracts[0],  user: req.user, jump_building_permission:'1'});
            });            
        })
    } else if(req.params.action === 'invoice') {
        db.editContractRemoveFromArray({'id':req.params.id},{invoice: {_id: new ObjectId(req.query.id)}}, function () {
            db.getContracts({'id':req.params.id}, function (err, contracts) {
                if(err) {
                    logger.error('contract id not exits: ', req.params.id);
                    res.redirect('/projects');
                    return;
                }
                res.render('editcontract', {title:'Contract Management', project_id: req.query.project_id, project_adr:req.query.project_adr, contract: contracts[0],  user: req.user, jump_financial:'1'});
            });  
        })
    }
};

module.exports = {
    addContract:addContract,
    editContract:editContract,
    delContract:delContract,
    getContractByProjectID:getContractByProjectID
};
