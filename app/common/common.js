/**
 * Created by Zhenyu on 11.04.2017.
 */
'use strict';

const moment = require('moment');

const zeroPad = function(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};

const getNumValue = function(value){
    if (isNaN(parseFloat(value))) {
        return undefined;
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
        if (contract.building_permission) {
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
        return 'nicht benoetigt';
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
            for( var i = 0; i < invoices.length; i ++){
                let invoice = invoices[i];
                if (invoice.guts_datum) {
                    current_paid_value +=invoice.guts_datum;
                }

                if (invoice.sum) {
                    sum_value += invoice.sum;
                }
            }
        }

        if (status.current_paid_value === status.sum_value) {
            status.is_finished = true;
        }

        if (invoices.length === 1) {
            status.descrip = invoices[0].invoice_status;
        } else {
            status.descrip =current_paid_value + ' / ' + sum_value;
        }
    }

    return status;

};

module.exports = {
    zeroPad: zeroPad,
    getNumValue:getNumValue,
    getDate: getDate,
    fullParallel:fullParallel,
    doJSONRespond:doJSONRespond,
    calTotalStatusOfPermissions:calTotalStatusOfPermissions,
    calInvoicesStatus:calInvoicesStatus
};
