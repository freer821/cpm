/**
 * Created by Zhenyu on 22.04.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: String,
    department: [String]
},{ versionKey: false });

module.exports = companySchema;