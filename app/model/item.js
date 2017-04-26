/**
 * Created by Zhenyu on 24.04.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    user_email: String,
    title: String,
    note: [String],
    priority: {type: String, enum: ['Emergency', 'Urgent', 'Standard', 'Normal']},
    status: {type: String, enum: ['Open', 'Pause', 'Closed']},
    ts: Date
},{ versionKey: false });

module.exports = itemSchema;