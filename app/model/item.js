/**
 * Created by Zhenyu on 24.04.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    user_email: String,
    title: String,
    note: [{
        content: String,
        ts: Date
    }],
    priority: {type: String, enum: ['01', '02', '03', '04']},
    status: {type: String, enum: ['Open', 'Pause', 'Closed']},
    ts: Date
},{ versionKey: false });

module.exports = itemSchema;