/**
 * Created by Zhenyu on 08.04.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constructionSchema = new Schema({
    _id: {
        typ: String,
        year: Number,
        intern_nr: Number
    }, // type+year+ intern_nr
    addr: {
        ort: String, // gemeide
        strasse: String
    },
    plz: String,
    stadt: String,
    comment: String,
    path: String, // network file path
    fremdleitungsplan: Boolean,
    auftrag:[
        {
            id: String,
            auftraggeber: String, // customer
            kst: String,          // cost
            projekt_nr: String,   // project number
            sap_nr: String,       // sap number
            gas_nr: String,       // gas number
            wasser_nr: String,    // water number
            partner_tel: String,  // partner tel
            auftrag_uebergeb: Date,  // contract delivery
            unterlage_uebergeb: Date, // documents delivery
            arbeitsbemerkung: String, // work comments
            auftrag_typ: {            // contract type
                elektro: Boolean,     // electric
                wasser: Boolean,      // water
                gas: Boolean,         // gas
                telekom: Boolean,     // telecom
                sonst: Boolean        // others
            },
            kampfmittell: Boolean,    // bomb, weapon
            schaetzwert: String,      // estimated value
            files_path: String,
            bauleiter_name: String,   // worker name
            rot_b: Boolean,
            comment: String,
            ursache: String,          // reason
            geplanter_baubegin: Date, // the begin of plan
            geplanter_bauende: Date,  // the end of plan
            kolonnen: String,         // worker
            leistungsmonate: String,  // Ordering month
            tiefbau_montage: {        // building
                zustand: String,      // status
                auto_fertigstellung: Number // the procent of completion
            },
            meldungs_nr: String, // message number
            ofw_kolonne: String, // ofw worker
            ofw_uebergaben: Date, // ofw delivery
            ofw_fertig_am: Date,  // ofw completion at
            geraeumt: Boolean,    // clean
            abn_noetig: Boolean,  // Need acceptance
            abn_beantragt: Date, // Date to apply for acceptance
            abn_erteilt: Date,  // Date to grant the acceptance
            ofw_zustand: {      // ofw status
                ofw_sub_untern: String,  //1/0 +String
                sum_subu: String,   // Sum of Sub companies
            },
            fibu: {
                betrag: String,  // price
                b_mon: String,   // Ordering month
                zustand: Boolean  // status
            },
            abrechnung: [         // invoice
                {
                    nr: String,   // number
                    zeitwert: String,  // time
                    summe: String,  // sum
                    aufmass_am: Date, // oversize
                    bewert_aufmass: Date, // oversize
                    guts_datum: Date, // goods time
                    zustand: String  // status
                }
                ],
            baz_vaz: [
                {
                    typ: String,
                    datum_bv_anzeige: Date, // time
                    verk_beginn: Date,     // the begin time
                    verk_ende: Date, // the end time
                    verk_kosten: String, // costt
                    zustand: String // status
                }
            ]
        }
    ]

},{ versionKey: false });

module.exports = constructionSchema;