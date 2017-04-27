/**
 * Created by Zhenyu on 27.04.2017.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contractSchema = new Schema({
    _id: String,
    project_id: String,
    customer: String, // auftraggeber
    cost_code: String,          // kst
    project_nr: String,  // vom auftraggeber
    sap_nr: String,
    electric_nr: String,
    gas_nr: String,
    water_nr: String,
    partner_name: String,
    contract_delivery: Date,  // contract delivery auftrag_uebergeb
    doc_delivery: Date, // documents delivery unterlage_uebergeb
    work_content: String, // arbeitsbemerkung
    contract_typ: {            // auftrag typ
        electric: Boolean,     // elektro
        water: Boolean,      // wasser
        gas: Boolean,         // gas
        telecom: Boolean,     // telekom
        light: Boolean,
        others: Boolean        // others
    },
    isBombExisted: Boolean,    // bomb, weapon kampfmittell
    estimated_value: String,      // schaetzwert (Euro)
    files_path: String,
    manager_name: String,   // bauleiter_name
    rot_b: Boolean,         // Auftrageber Telekom
    comment: String,
    doc_location: {
        person: String,
        reason: String
    },          // Unterlage bei. Ursache mapZustand
    building_work: {        // tiefbau_montage
        begin_plan: Date, // geplanter_baubegin
        plan_end: Date,  // geplanter_bauende
        worker_name: String,         // kolonnen
        working_months: Date,  // leistungsmonate MM-YYYY
        status: String,      //  4 zustände
        procent_completion: Number // the procent of completion auto_fertigstellung
    },
    ofw :{
        permission_nr: String, // meldungs_nr
        worker_name: String, // ofw kolonne
        delivery: Date, // ofw_uebergaben
        completion_at: Date,  // ofw fertig_am
        clean: Boolean,    // clean geraeumt
        acceptance :{
            applied: Date, // abn_beantragt
            granted: Date  // abn_erteilt
        },
        ofw_status: String,      // ofw_zustand
        extern_company: {
            name: String,
            price: Number // EURO
        } // OFW Sub-Unternehmen
    },
    fibu: {
        price: Number,  // betrag Euro
        ordering_month: Date,   // buchung mon MM-YYYY
        status: {type: String, enum: ['NO_CHECK', 'CHECK_ERROR', 'CHECK_SUCCESS']}  // zustand
    },
    invoice: [         // abrechnung
        {
            rechnung_nr: String,   // number
            current_value: Number,  // zeitwert, Euro
            sum: Number,  // summe, EURO
            aufmass_am: Date, // time to send Invocie
            bewert_aufmass: Date, // time to permit invocie
            guts_datum: Date, // time to get money
            status: String  // status, auto to cal
        }
    ],
    building_permission: [
        {
            typ: {type: String, enum: ['BAZ', 'VAZ', 'VBA']},
            date_doc_delivery: Date, //
            begin: Date,     // the begin time
            end: Date, // the end time
            cost: Number, // verk_kosten
            status: String // status, auto to cal
        }
    ]
});

module.exports = contractSchema;