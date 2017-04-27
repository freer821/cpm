/**
 * Created by Zhenyu on 08.04.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    _id: String, // 6 digits
    addr: {
        ort: String, // gemeide
        street: String
    },
    zipcode: String,
    city: String,
    comment: String,
    files_path: String, // network file path
    linesplan: Boolean, // fremdleitungsplan
    linesplan_files_path: String   // for fremdleitungsplan

},{ versionKey: false });

module.exports = projectSchema;