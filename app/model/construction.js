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
            auftraggeber: String,
            kst: String,
            projekt_nr: String,
            sap_nr: String,
            gas_nr: String,
            wasser_nr: String,
            partner_tel: String,
            auftrag_uebergeb: Date,
            unterlage_uebergeb: Date,
            arbeitsbemerkung: String,
            auftrag_typ: {
                elektro: Boolean,
                wasser: Boolean,
                gas: Boolean,
                telekom: Boolean,
                sonst: Boolean
            },
            geplanter_baubegin: Date,
            geplanter_bauende: Date,
            kolonnen: String,
            leistungsmonate: String,
            tiefbau_montage: {
                zustand: String,
                auto_fertigstellung: Number // procent
            },
            meldungs_nr: String,
            ofw_kolonne: String,
            ofw_uebergaben: Date,
            ofw_fertig_am: Date,
            geraeumt: Boolean,
            abn_noetig: Boolean,
            abn_beantragt: Date,
            abn_erteilt: Date,
            ofw_zustand: {
                ofw_sub_untern: String,  //1/0 +String
                sum_subu: String,
            },
            fibu: {
                betrag: String,
                b_mon: String,
                zustand: Boolean
            },
            abrechnung: [
                {
                    nr: String,
                    zeitwert: String,
                    summe: String,
                    aufmass_am: Date,
                    bewert_aufmass: Date,
                    guts_datum: Date,
                    zustand: String
                }
                ],
            baz_vaz: [
                {
                    typ: String,
                    datum_bv_anzeige: Date,
                    verk_beginn: Date,
                    verk_ende: Date,
                    verk_kosten: String,
                    zustand: String
                }
            ]
        }
    ]

},{ versionKey: false });

module.exports = constructionSchema;