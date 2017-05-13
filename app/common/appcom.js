/**
 * Created by Zhenyu on 11.04.2017.
 */
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

module.exports = {
    zeroPad: zeroPad,
    getNumValue:getNumValue,
    getDate: getDate
};
