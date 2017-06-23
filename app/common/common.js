/**
 * Created by Zhenyu on 11.04.2017.
 */
'use strict';

const moment = require('moment');
const mkdirp = require('mkdirp');
const logger = require('./logger');

const zeroPad = function(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};

const getNumValue = function(value){
    if (isNaN(parseFloat(value))) {
        return 0;
    }
    return parseFloat(value);
};

const getDate = function (value) {
    if (value && moment(value, 'DD-MM-YYYY', true).isValid()) {
        return moment(value, 'DD-MM-YYYY');
    }

    return undefined;
};

const fullParallel = function (callbacks, last) {
    let count = 0;
    callbacks.forEach( (callback)  => {
        callback( function() {
            count++;
            if(count == callbacks.length) {
                last();
            }
        });
    });
};

/**
const getStatusOfContracts = function(contracts) {
    let contracts_status = [];
    for (var i = 0; i < contracts.length; i++) {
        let contract = contracts[i];
        let invoice_status = calInvoicesStatus(contract.invoice);
        contracts_status.push({
            id: contract.id,
            addr: 'Adresse ??????',
            work_content: contract.work_content,
            cost_code: contract.cost_code,
            customer: contract.customer,
            permission_status: contract.is_building_permission_activ?calBuildingPermissionsStatus(contract.building_permission):'nicht benoetigt',
            building_status: getBulidungStatus(contract.building_work.status),
            ofw_status: contract.is_ofw_activ?calOFWStatus(contract.ofw):'nicht benoetigt',
            invoice_status: invoice_status.finished_num+'/'+invoice_status.all_num,
            manager_name: contract.manager_name,
            worker_name: contract.building_work.worker_name? contract.building_work.worker_name: 'unkown',
            building_begin: contract.building_work.plan_begin? moment(contract.building_work.plan_begin).format('DD-MM-YYYY'): 'unkonw',
            building_end: contract.building_work.plan_end? moment(contract.building_work.plan_end).format('DD-MM-YYYY'): 'unkonw',
            current_value: invoice_status.current_value,
            sum_value: invoice_status.sum_value,
            comment:contract.comment,
            status_finished: invoice_status.is_finished? 'finished' : 'unfinished'
        });
    }
    return contracts_status;
};

 */

const doJSONRespond = function (res, json, next) {
    res.status(200);
    res.json(json);
    next();
};

function getBulidungStatus(status_code) {
    switch (status_code) {
        case '00':
            return 'in der Vorbereitung';
        case '01':
            return 'vorbereiten zu bauen';
        case '02':
            return 'geplant in Bau';
        case '03':
            return 'fertig gebaut, Mappe abzug';
        case '04':
            return 'Tiefbau &amp; Montage erledigt';
        default:
            return 'no building status';
    }
}

function calTotalStatusOfPermissions(contract) {
    if (contract.is_building_permission_activ) {
        let isVBAExisted = false;
        let last_permission_end = moment("2000-01-01");
        if (contract.building_permission && contract.building_permission.length > 0) {
            for (var i = 0; i < contract.building_permission.length; i++) {
                let permission = contract.building_permission[i];

                if (permission.permission_status === 'zu bestimmen' || permission.permission_status === 'zu beantragen') {
                    return 'zu bestaetigen';
                }

                if (permission.type === 'VBA') {
                    isVBAExisted = true;
                }

                if (last_permission_end.isBefore(permission.end)) {
                    last_permission_end = moment(permission.end);
                }
            }

            if (isVBAExisted) {
                return 'bestaegigt';
            }

            if (contract.building_work) {
                if (last_permission_end.isBefore(contract.building_work.plan_end)) {
                    return 'bitte VBA verlaengen';
                } else {
                    return 'bestaegigt';
                }
            }

        } else {
            return 'no permissions'
        }

    } else {
        return 'nicht ben\u00f6tigt';
    }
}

const calInvoicesStatus = function(contract) {

    let invoices = contract.invoice;
    let current_paid_value = 0, sum_value = 0;
    let status = {
        is_finished: false,
        descrip: 'no invoices'
    };

    if (invoices) {

        if (invoices.length > 0) {
            for (var i = 0; i < invoices.length; i++) {
                let invoice = invoices[i];
                if (invoice.guts_datum) {
                    current_paid_value += invoice.sum;
                }

                if (invoice.sum) {
                    sum_value += invoice.sum;
                }
            }


            if (sum_value > 0 && (current_paid_value === sum_value)) {
                status.is_finished = true;
            }
        }

        if (invoices.length === 1) {
            status.descrip = invoices[0].invoice_status;
        } else {
            status.descrip =current_paid_value + ' / ' + sum_value;
        }
    }

    return status;

};

const filterContractsForDashboard = function (contracts) {
    let overview_status = {
        new_contracts_num_in_last_days: 0,
        contracts_num_with_building_plan: 0,
        contracts_num_with_building_plan_in_last_month: 0,
        contracts_num_with_permissions: 0,
        contracts_num_with_building_plan_update: 0,
        contracts_num_with_ofw: 0,
        contracts_num_with_ofw_delivery: 0,
        contracts_num_with_ofw_check_completion: 0,
        contracts_num_with_ofw_acceptance: 0,
        contracts_num_with_vba_extend: 0
    };
};

function compare_time_point_in_future(num) {
    return moment().add(num, 'days');
}

function compare_time_point_in_past(num) {
    return moment().subtract(num, 'days');
}


function is_new_contract_in_last_days(contract) {

    if (moment(contract.contract_delivery).isAfter(compare_time_point_in_past(10))) {
        return true;
    }

    return false;
}

function is_contract_with_building_plan(contract) {
    if (contract.building_work) {
        if (moment(contract.building_work.plan_begin).isValid() || moment(contract.building_work.plan_end).isValid()) {
            return true;
        }
    }

    return false;
}

function is_contract_with_building_plan_in_last_month(contract) {
    if (contract.building_work) {
        if (moment(contract.building_work.plan_begin).isAfter(moment())&&moment(contract.building_work.plan_begin).isBefore(compare_time_point_in_future(28))) {
            return true;
        }
    }

    return false;
}

function is_contract_with_permissions(contract) {

}

function is_contract_with_building_plan_update(contract) {
    if (contract.building_work) {
        if (moment(contract.building_work.plan_end).isBefore(moment())&& contract.building_work.procent_completion < 100 ) {
            return true;
        }
    }

    return false;
}

function is_contract_with_ofw(contract) {

}

function is_contract_with_ofw_delivery(contract) {

}

function is_contract_with_ofw_check_completion(contract) {

    if (contract.is_ofw_activ && contract.ofw) {
        if (moment().isAfter(contract.ofw.completion_at) && !contract.ofw.clean) {
            return true;
        }
    }

    return false;
}

function is_contract_with_ofw_acceptance(contract) {

}

function is_contract_with_vba_extend(contract) {

    if (contract.permissions_status === 'bitte VBA verlaengen') {
        return true;
    }

    return false;
}

const isUserPermitted = function (user_cost_code_array, request_cost_code) {

    if (user_cost_code_array) {
        for (var i = 0; i < user_cost_code_array.length; i++ ) {
            let user_cost_code = user_cost_code_array[i];
            if (request_cost_code.includes(user_cost_code)) {
                return true;
            }
        }
    }

    return false;

};

function uploadUserFile(file,file_path, callback){

    mkdirp(file_path, function(err) {
        if (err) {
            logger.error('failed to create folder', err.message);
            callback(err);
        } else {
            file.mv(file_path+'/'+file.name, function (err) {
                if (err) {
                    logger.error('failed to save file ', err.message);
                    callback(err);
                } else {
                    callback();
                }
            });
        }

    });
}

function createFolder(folder_path) {
    mkdirp(folder_path, function(err) {
        if (err) {
            logger.error('error to create path: '+folder_path, err.message);
        } else {
            logger.trace('success to create path: '+folder_path);
        }
    });
}

const getSessionUser= function (user) {
    let session_user = {email:user.email, name: user.firstname + ' ' + user.secondname, role: user.role, icon: user.icon, cost_code: user.cost_code};
    return session_user;
}

module.exports = {
    zeroPad: zeroPad,
    getNumValue:getNumValue,
    getDate: getDate,
    fullParallel:fullParallel,
    doJSONRespond:doJSONRespond,
    calTotalStatusOfPermissions:calTotalStatusOfPermissions,
    calInvoicesStatus:calInvoicesStatus,
    filterContractsForDashboard:filterContractsForDashboard,
    isUserPermitted:isUserPermitted,
    uploadUserFile:uploadUserFile,
    getSessionUser:getSessionUser,
    createFolder:createFolder
};
