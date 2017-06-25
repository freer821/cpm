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
    ts: Date,
    items: [
        {
            title: String,
            note: [String],
            priority: {type: String, enum: ['Emergency', 'Urgent', 'Standard', 'Normal']},
            status: {type: String, enum: ['open', 'pause', 'closed']},
        }
    ],
    cost_code:[String],
    ui_settings:{
        in_letzten_10: Boolean,
        zum_bauplan: Boolean,
        geplant: Boolean,
        baust: Boolean,
        ofw_n: Boolean,
        ofw_f: Boolean,
        vba_zu: Boolean,
    }
},{ versionKey: false });

module.exports = userSchema;