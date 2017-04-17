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
        street: String
    },
    zipcode: String,
    city: String,
    comment: String,
    path: String, // network file path
    foreignlineplan: Boolean, // fremdleitungsplan
    contract:[       // auftrag
        {
            id: String,
            customer: String, // auftraggeber
            cost: String,          // kst
            project_nr: String,
            sap_nr: String,
            gas_nr: String,
            water_nr: String,
            partner_tel: String,
            contract_delivery: Date,  // contract delivery auftrag_uebergeb
            doc_delivery: Date, // documents delivery unterlage_uebergeb
            work_comment: String, // arbeitsbemerkung
            contract_typ: {            // auftrag typ
                electric: Boolean,     // elektro
                water: Boolean,      // wasser
                gas: Boolean,         // gas
                telecom: Boolean,     // telekom
                others: Boolean        // others
            },
            isBomb: Boolean,    // bomb, weapon kampfmittell
            estimated_value: String,      // schaetzwert
            files_path: String,
            chef_name: String,   // bauleiter_name
            rot_b: Boolean,
            comment: String,
            reason: String,          // ursache
            build_begin_plan: Date, // geplanter_baubegin
            build_end_plan: Date,  // geplanter_bauende
            worker: String,         // kolonnen
            working_months: String,  // leistungsmonate
            undergroud_building: {        // tiefbau_montage
                status: String,      // zustand
                procent_completion: Number // the procent of completion auto_fertigstellung
            },
            messages_nr: String, // meldungs_nr
            ofw_worker: String, // ofw kolonne
            ofw_delivery: Date, // ofw_uebergaben
            ofw_completion_at: Date,  // ofw fertig_am
            clean: Boolean,    // clean geraeumt
            acceptance_needed: Boolean,  // Need acceptance abn_noetig
            acceptance_apply: Date, // abn_beantragt
            acceptance_granted: Date,  // abn_erteilt
            ofw_status: {      // ofw_zustand
                ofw_sub_untern: String,  //1/0 +String
                sum_subu: String,   // Sum of Sub companies
            },
            fibu: {
                price: String,  // betrag
                ordering_month: String,   // buchung mon
                status: Boolean  // zustand
            },
            invoice: [         // abrechnung
                {
                    nr: String,   // number
                    time_value: String,  // zeitwert
                    sum: String,  // summe
                    aufmass_am: Date, // oversize
                    bewert_aufmass: Date, // oversize
                    guts_datum: Date, // goods time
                    status: String  // status
                }
                ],
            baz_vaz: [
                {
                    typ: String,
                    date_bv_anzeige: Date, // datum_bv_anzeige
                    verk_begin: Date,     // the begin time
                    verk_end: Date, // the end time
                    verk_cost: String, // verk_kosten
                    status: String // status
                }
            ]
        }
    ]

},{ versionKey: false });

module.exports = constructionSchema;