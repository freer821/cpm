/**
 * Created by Zhenyu on 04.04.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,
    firstname: String,
    secondname: String,
    shortname: String,
    position: String,
    addr: String,
    plz: Number,
    city: String,
    company:String,
    department: String,
    role: {type: String, enum: ['admin', 'user']},
    icon:  String,
    tel: String,
    mobil: String,
    created: Date,
    ts: Date
},{ versionKey: false });

module.exports = userSchema;