/**
 * Created by Zhenyu on 11.04.2017.
 */


const zeroPad = function(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};

module.exports = {
    zeroPad: zeroPad
};
