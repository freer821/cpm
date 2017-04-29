/**
 * Created by Zhenyu on 08.04.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    id: String, // 6 digits
    housenr: String,
    street: String,
    community: String, // gemeide
    zipcode: String,
    city: String,
    comment: String,
    files_path: String, // network file path
    linesplan_files_path: String,   // for fremdleitungsplan
    ts: Date,
    created: Date
},{ versionKey: false });

module.exports = projectSchema;