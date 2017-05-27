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

const calBuildingPermissionsStatus = function(permissions, build_finished_time) {

    if (permissions) {
        return 'no prermission';
    }

    let is_tpy_vba= false, last_permission_date = moment("2000-01-01");

    for (var i = 0; i < permissions.length; i++ ) {
        let permission = permissions[i];
        if (permission.status.includes('includes') || permission.status.includes('includes') ) {
            return 'zu bestaetigen';
        }

        if (permission.type === 'VBA') {
            is_tpy_vba = true;
        }

        if (last_permission_date.isBefore(permissions.end)) {
            last_permission_date = moment(permission.end);
        }

    }


    if (is_tpy_vba) {
        return 'bestaegigt';
    }

    if (build_finished_time) {
        if (last_permission_date.isAfter(build_finished_time)) {
            return 'bitte VBA verlaengen';
        } else {
            return 'bestaegigt';
        }
    }

    return 'not defined status';


};

const calInvoicesStatus = function(invoices) {

    let status = {
        is_finished: false,
        all_num: 0,
        finished_num: 0,
        current_value:0,
        sum_value:0
    };

    if (invoices) {

        status.all_num = invoices.length;
        for( var i = 0; i < invoices.length; i ++){
            let invoice = invoices[i];
            if (invoice.guts_datum) {
                status.finished_num +=1;
            }

            if (invoice.current_value) {
                status.current_value = invoice.current_value;
            }

            if (invoice.sum) {
                status.sum_value = invoice.sum;
            }
        }

        if (status.finished_num === status.all_num &&  status.all_num > 0) {
            status.is_finished = true;
        }

    }

    return status;

};

const calOFWStatus = function (ofw) {
  if (ofw.ofw_status) {
      return ofw.ofw_status;
  }

  return 'no OFW status';
};


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

module.exports = {
    zeroPad: zeroPad,
    getNumValue:getNumValue,
    getDate: getDate,
    getStatusOfContracts:getStatusOfContracts,
    fullParallel:fullParallel,
    doJSONRespond:doJSONRespond
};
