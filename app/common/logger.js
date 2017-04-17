/**
 * Created by Zhenyu on 04.04.2017.
 */
'use strict';
const bunyan = require('bunyan');
const config = require('./config');

const logger = bunyan.createLogger(getConf());

function getConf() {
    let conf = {
        name: 'cpm',
        streams: []
    };

    if (config.logging.trace.enabled && config.logging.trace.file !== '' && config.logging.trace.level !== '') {
        conf.streams.push({
            level: config.logging.trace.level,
            path: config.logging.trace.file
        });
    }


    if (config.logging.error.enabled && config.logging.error.file !== '' && config.logging.error.level !== '') {
        conf.streams.push({
            level: config.logging.error.level,
            path: config.logging.error.file
        });
    }

    return conf;
}

module.exports = logger;