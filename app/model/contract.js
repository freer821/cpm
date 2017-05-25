/**
 * Created by Zhenyu on 27.04.2017.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contractSchema = new Schema({
    id: String,
    contract_street: String,
    customer: String, // auftraggeber
    cost_code: String,          // kst
    project_id: String,
    sap_nr: String,
    electric_nr: String,
    gas_nr: String,
    water_nr: String,
    partner_name: String,
    contract_delivery: Date,  // contract delivery auftrag_uebergeb
    doc_delivery: Date, // documents delivery unterlage_uebergeb
    work_content: String, // arbeitsbemerkung
    street: String,
    housenr: String,
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
        plan_begin: Date, // geplanter_baubegin
        plan_end: Date,  // geplanter_bauende
        worker_name: String,         // kolonnen
        working_months: String,  // leistungsmonate MM-YYYY
        status: String,      //  4 zustände
        procent_completion: Number // the procent of completion auto_fertigstellung
    },
    is_ofw_activ: Boolean,
    ofw :{
        permission_nr: String, // meldungs_nr
        worker_name: String, // ofw kolonne
        delivery: Date, // ofw_uebergaben
        completion_at: Date,  // ofw fertig_am
        clean: Boolean,    // clean geraeumt
        is_acceptance_activ: Boolean,
        acceptance :{
            applied: Date, // abn_beantragt
            granted: Date  // abn_erteilt
        },
        typ:{
            bausstr: Boolean,
            fahrbahn: Boolean,
            fussweg: Boolean,
            bitu: Boolean,
            pflaster: Boolean,
            beton: Boolean
        },
        ueberdicken: Number,
        ofw_status: String      // ofw_zustand
    },
    fibu: {
        price: Number,  // betrag Euro
        ordering_month: Date,   // buchung mon MM-YYYY
        status: {type: String, enum: ['NO_CHECK', 'CHECK_ERROR', 'CHECK_SUCCESS']}  // zustand
    },
    invoice: [         // abrechnung
        {
            rechnung_nr: String,   // number
            sum: Number,  // summe, EURO
            aufmass_am: Date, // time to send Invocie
            bewert_aufmass: Date, // time to permit invocie
            guts_datum: Date, // time to get money
            correction_needed: Boolean,
            booking_month: String,
            invoice_status: String  // status, auto to cal
        }
    ],
    is_building_permission_activ: Boolean,
    building_permission: [
        {
            type: {type: String, enum: ['BAZ', 'VAZ', 'VBA', 'BAZVAZ']},
            doc_delivery: Date, //
            begin: Date,     // the begin time
            end: Date, // the end time
            cost: Number, // verk_kosten
            permission_status: String // status, auto to cal
        }
    ],
    ts: Date,
    created: Date
});

module.exports = contractSchema;