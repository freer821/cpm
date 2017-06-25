/**
 * Created by Zhenyu on 22.04.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const depSchema = new Schema({
    name: String,
    company: String
},{ versionKey: false });

module.exports = depSchema;