/**
 * Created by Zhenyu on 04.04.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    passw: String,
    firtname: String,
    secondname: String,
    role: {type: String, enum: ['admin', 'user']},
    ts: Date
},{ versionKey: false });

module.exports = userSchema;