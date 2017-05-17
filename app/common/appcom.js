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

        if (status.finished_num === status.all_num) {
            status.is_finished = true;
        }

    }

    return status;

};

const calOFWStatus = function (ofw) {
  if (ofw) {
      return ofw.status;
  }

  return 'no status';
};


const getStatusOfContracts = function(contracts) {
    let contracts_status = [];
    for (var i = 0; i < contracts.length; i++) {
        let contract = contracts[i];
        let invoice_status = calInvoicesStatus(contract.invoice);
        contracts_status.push({
            id: contract.id,
            addr: 'Adresse needed',
            work_content: contract.work_content,
            cost_code: contract.cost_code,
            customer: contract.customer,
            permission_status: contract.is_building_permission_activ?calBuildingPermissionsStatus(contract.building_permission):'nicht benoetigt',
            building_status: contract.building_work? contract.building_work.status: 'no status',
            ofw_status: contract.is_ofw_activ?calOFWStatus(contract.ofw):'nicht benoetigt',
            invoice_status: invoice_status.finished_num+'/'+invoice_status.all_num,
            manager_name: contract.manager_name,
            worker_name: contract.building_work? contract.building_work.worker_name: 'unkown',
            building_begin: contract.building_work? contract.building_work.begin: 'unkonw',
            building_end: contract.building_work? contract.building_work.end: 'unkonw',
            current_value: invoice_status.current_value,
            sum_value: invoice_status.sum_value,
            comment:contract.comment,
            is_finished: invoice_status.is_finished
        });
    }
    return contracts_status;
};



module.exports = {
    zeroPad: zeroPad,
    getNumValue:getNumValue,
    getDate: getDate,
    getStatusOfContracts:getStatusOfContracts,
    fullParallel:fullParallel
};
