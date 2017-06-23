/**
 * Created by Zhenyu on 01.05.2017.
 */
'use strict';
const moment = require('moment');
const config = require('../common/config');
const logger = require('../common/logger');
const db = require('../common/database');
const common = require('../common/common');
var ObjectId = require('mongoose').Types.ObjectId;
const uuidV4 = require('uuid/v4');

function getContractIDPrifix(contract) {
    return moment().format('YY')+'-'+contract.cost_code.substring(contract.cost_code.length-2)+'-'+contract.project_id+'-';
}

function updateContractBasic(request, callback) {

    let contract = {
        customer: request.customer,
        contract_extern_id: request.contract_extern_id,
        cost_code: request.cost_code,          // kst
        contract_street: request.contract_street,
        project_id: request.project_id,  // vom auftraggeber
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
        comment: request.comment,
        doc_location: {
            person: request.person,
            reason: request.reason
        }
    };

    if (request.contract_id) {
        db.editContract({id: request.contract_id},contract,function (err) {
            if(err){
                callback(err);
            } else {
                db.updateContractManagerByCostCode(request.contract_id, function () {
                    callback(undefined, request.project_id);
                });
            }
        });
    } else {
        db.countContract(function (err, count) {
            if (err) {
                logger.error('error to count contract');
                count = 0;
            }

            contract.id = getContractIDPrifix(contract)+(count+1).toString();
            contract.is_ofw_activ = false;
            contract.ofw= {
                ofw_status: 'OFW nicht ben\u00f6tigt'
            };
            db.editContract({id: contract.id},contract,function (err) {
                if(err){
                    callback(err);
                } else {
                    db.updateContractManagerByCostCode(contract.id, function () {
                        callback(undefined, request.project_id);
                    });
                }
            });

            common.createFolder(config.files.root_path+contract.project_id+'/'+contract.id);
        });
    }
}


function updateContractBuilding(request, callback) {

    let contract = {
        building_work:{
            plan_begin: common.getDate(request.plan_begin),
            plan_end: common.getDate(request.plan_end),
            worker_name: request.worker_name,
            working_months: request.working_months,
            status: request.status,
            procent_completion: request.procent_completion
        }
    };
    db.editContract({id: request.contract_id},contract,function (err) {
        if(err){
            callback(err);
        } else {
            callback(undefined, request.project_id);
        }
    });


    if (request.status === '03') {
        let invoice = {
            invoice_status: '00'
        };
        db.checkAndauoUpdateContractFinancial(request.contract_id, invoice);
    }
}

function updateContractPermission(request, callback) {

    if ( request.is_building_permission_activ && request.change_permission) {
        if (request.permission_id) {
            let permission = {
                "building_permission.$.type": request.type,
                "building_permission.$.doc_delivery": common.getDate(request.doc_delivery),
                "building_permission.$.begin": common.getDate(request.begin),
                "building_permission.$.end": common.getDate(request.end),
                "building_permission.$.cost": request.cost,
                "building_permission.$.permission_status": request.permission_status
            };

            db.editContract({id: request.contract_id, building_permission: {$elemMatch: {_id : request.permission_id}}},permission,function (err) {
                if(err){
                    logger.error(err);
                }
            });
        } else {
            let permission = {
                type: request.type,
                doc_delivery: common.getDate(request.doc_delivery),
                begin: common.getDate(request.begin),
                end: common.getDate(request.end),
                cost: request.cost,
                permission_status: request.permission_status
            };

            db.editContractAddIntoArray({id: request.contract_id},{building_permission: permission},function (err) {
                if(err){
                    logger.error(err);
                }
            });
        }
    }

    let contract = {
        is_building_permission_activ: request.is_building_permission_activ
    };

    db.editContract({id: request.contract_id},contract,function (err) {
        if(err){
            callback(err);
        } else {
            callback(undefined, request.project_id);
        }
    });
}

function updateContractOFW(request, callback) {

    let acceptance, contract;


    if (request.is_ofw_activ) {
        if (request.is_acceptance_activ) {
            acceptance = {
                applied: common.getDate(request.applied),
                granted: common.getDate(request.granted)
            };
        }

        contract = {
            is_ofw_activ: request.is_ofw_activ,
            ofw:{
                permission_nr: request.permission_nr,
                worker_name: request.worker_name,
                delivery: common.getDate(request.delivery),
                completion_at: common.getDate(request.completion_at),
                clean: request.clean,
                is_acceptance_activ: request.is_acceptance_activ,
                acceptance :acceptance,
                typ:{
                    bausstr: request.bausstr,
                    fahrbahn: request.fahrbahn,
                    fussweg: request.fussweg,
                    bitu: request.bitu,
                    pflaster: request.pflaster,
                    beton: request.beton
                },
                ueberdicken: common.getNumValue(request.ueberdicken),
                ofw_status: request.ofw_status
            }
        };

    } else {
        contract = {
            is_ofw_activ: request.is_ofw_activ,
            ofw:{
                ofw_status: 'OFW nicht ben\u00f6tigt'
            }
        };
    }
    db.editContract({id: request.contract_id},contract,function (err) {
        if(err){
            callback(err);
        } else {
            callback(undefined, request.project_id);
        }
    });
}

function updateContractFinancial(request, callback) {

    if (request.invoice_id) {
        let invoice = {
            "invoice.$.rechnung_nr": request.rechnung_nr,
            "invoice.$.sum": request.sum,
            "invoice.$.aufmass_am": common.getDate(request.aufmass_am),
            "invoice.$.bewert_aufmass": common.getDate(request.bewert_aufmass),
            "invoice.$.guts_datum": common.getDate(request.guts_datum),
            "invoice.$.booking_month": request.booking_month,
            "invoice.$.correction_needed": request.correction_needed,
            "invoice.$.invoice_status": request.invoice_status
        };

        db.editContract({id: request.contract_id, invoice: {$elemMatch: {_id : request.invoice_id}}},invoice,function (err) {
            if(err){
                callback(err.message);
            } else {
                callback(undefined, request.project_id);
            }
        });  
    } else {
        let invoice = {
            rechnung_nr: request.rechnung_nr,
            current_value: request.current_value,
            sum: request.sum,
            aufmass_am: common.getDate(request.aufmass_am),
            bewert_aufmass: common.getDate(request.bewert_aufmass),
            guts_datum: common.getDate(request.guts_datum),
            booking_month: request.booking_month,
            correction_needed: request.correction_needed,
            invoice_status: request.invoice_status
        };

        db.editContractAddIntoArray({id: request.contract_id},{invoice: invoice},function (err) {
            if(err){
                callback(err.message);
            } else {
                callback(undefined, request.project_id);
            }
        });
    }
}

function updateContractFibu(request, callback) {

    let contract = {
        fibu:{
            price: request.price,
            ordering_month: common.getDate(request.ordering_month),
            status: request.status
        }
    };
    db.editContract({id: request.contract_id},contract,function (err) {
        if(err){
            callback(err);
        } else {
            callback(undefined, request.project_id);
        }
    });
}

const editContract = function (req, res, next) {
    let request = req.body;

    if (!common.isUserPermitted(req.user.cost_code, request.cost_code)) {
        res.send('user is not permitted to edit this contract!!');
        return;
    }
    if(req.params.action === 'basic') {
        updateContractBasic(request, function (err,project_id) {
            if(err){
                res.send('update operation failed!!');
            } else {
                db.updateProjectAfterContractUpdate(project_id);
                common.doJSONRespond(res,{'action':'reload','project_id':project_id},next)
            }
        });
    } else if(req.params.action === 'building') {
        updateContractBuilding(request, function (err,project_id) {
            if(err){
                res.send('update operation failed!!');
            } else {
                common.doJSONRespond(res,{'action':'reload','project_id':project_id},next)
            }
        });
    } else if(req.params.action === 'permission') {
        updateContractPermission(request, function (err, project_id) {
            if (err) {
                res.send('update operation failed!!');
            } else {
                db.updateProjectAfterContractUpdate(project_id);
                common.doJSONRespond(res,{'action':'reload','project_id':project_id},next)
            }
        });
    } else if(req.params.action === 'ofw') {
        updateContractOFW(request, function (err, project_id) {
            if (err) {
                res.send('update operation failed!!');
            } else {
                common.doJSONRespond(res,{'action':'reload','project_id':project_id},next)
            }
        });
    } else if(req.params.action === 'invoice') {
        updateContractFinancial(request, function (err, project_id) {
            if (err) {
                res.send('update operation failed!!');
            } else {
                db.updateProjectAfterContractUpdate(project_id);
                common.doJSONRespond(res,{'action':'reload','project_id':project_id},next)
            }
        });
    } else if(req.params.action === 'fibu') {
        updateContractFibu(request, function (err, project_id) {
            if (err) {
                res.send('update operation failed!!');
            } else {
                common.doJSONRespond(res,{'action':'reload','project_id':project_id},next)
            }
        });
    } else if(req.params.action === 'unlockAndlock') {
        unlockAndlockContract(request, function (err, project_id) {
            if (err) {
                res.send('unlockAndlock operation failed!!');
            } else {
                common.doJSONRespond(res,{'action':'reload','project_id':project_id},next)
            }
        });
    }
};

const unlockAndlockContract = function (request, callback) {
    let contract;

    if (request.action === 'lock') {
        contract = {
            is_contract_ative: false
        };
    } else {
        contract = {
            is_contract_ative: true
        };
    }
    db.editContract({id: request.contract_id},contract,function (err) {
        if(err){
            callback(err);
        } else {
            callback(undefined, request.project_id);
        }
    });

};

const delContract = function (req, res, next) {
    if(req.params.action === 'permission') {
        db.editContractRemoveFromArray({'id':req.params.id},{building_permission: {_id: new ObjectId(req.query.id)}}, function (err) {
            common.doJSONRespond(res,{'action':'reload','project_id':req.body.project_id},next);         
        })
    } else if(req.params.action === 'invoice') {
        db.editContractRemoveFromArray({'id':req.params.id},{invoice: {_id: new ObjectId(req.query.id)}}, function (err) {
            common.doJSONRespond(res,{'action':'reload','project_id':req.body.project_id},next);
        })
    } else {
        db.delContract(req.params.id, function(err){
            common.doJSONRespond(res,{'action':'refresh'},next);
        });
    }
};

const editContractPartial = function(req, res, next){
    let set = req.body;
    let contract_id = req.params.id;
    db.editContract({id: contract_id}, set, function (err) {
        if(err){
            res.send('err');
        } else {
            res.send('ok');
        }
    });
};

const printContract = function(req, res, next){
    let contract_id = req.params.id;
    db.getContracts({'id':contract_id}, function (err, contracts) {
        if(err) {
            logger.error('error to find contract in db', err.message);
        }
        if(contracts){
            let contract = contracts[0];

            db.getProjects({'id':contract.project_id}, function(err, projects){
                if(projects){
                    let project = projects[0];

                    let fs = require('fs');
                    let path = require('path');
                    let filepath = path.join(__dirname, '../scripts/');
                    let filename = uuidV4()+'.json';

                    let data ={
                        contract: contract,
                        project: project
                    }

                    fs.writeFile(filepath+filename, JSON.stringify(data));

                    callPythonShellScript(filepath, 'genContractTPL.py', filename, res);                    
                }        
            });
        }
    });

};

function callPythonShellScript(path, scriptFile, argsFile, res){
    let PythonShell = require('python-shell');
    console.log(argsFile);
    let options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: path,
      args: [argsFile]
    };

    PythonShell.run(scriptFile, options, function (err, results) {
      if (err) logger.error('python shell run error', err);
      // results is an array consisting of messages collected during execution
      //console.log('results: %j', results);
      res.send('/download/'+results[0]);
    });
}

module.exports = {
    editContract:editContract,
    delContract:delContract,
    editContractPartial:editContractPartial,
    printContract:printContract
};