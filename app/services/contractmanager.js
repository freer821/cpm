/**
 * Created by Zhenyu on 01.05.2017.
 */
'use strict'
const moment = require('moment');
const logger = require('../common/logger');
const db = require('../common/database');

const addContract = function (req, res, next) {
    if (req.method === "GET") {
        res.render('addandeditcontract', {title:'Project Management', project_id: req.query.project_id, project_adr:req.query.project_adr,  user: req.user});
    } else {
        let request = req.body;

        if(req.params.action === 'basic') {
            updateContractBasic(request, function () {
				
            });
        } else if(req.params.action === 'building') {
            updateContractBuilding(request, function () {

            });
        } else if(req.params.action === 'permission') {
            updateContractPermission(request, function () {

            });
        } else if(req.params.action === 'ofw') {
            updateContractOFW(request, function () {

            });
        } else if(req.params.action === 'financial') {
            updateContractFinancial(request, function () {

            });
        } else if(req.params.action === 'fibu') {
            updateContractFibu(request, function () {

            });
        }
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

}

function updateContractPermission(request, callback) {

}

function updateContractOFW(request, callback) {

}

function updateContractFinancial(request, callback) {

}

function updateContractFibu(request, callback) {

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

module.exports = {
    addContract:addContract,
    getContractByProjectID:getContractByProjectID
};