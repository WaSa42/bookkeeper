import { Writings } from '/imports/api/collections';

Writings.attachSchema(new SimpleSchema({
    journalCode: {
        type: String,
        label: 'Code journal',
        max: 255
    },
    journalLab: {
        type: String,
        label: 'Libellé du journal (optionnel)',
        max: 255,
        optional: true
    },
    num: {
        type: String,
        label: 'Numéro',
        max: 255
    },
    date: {
        type: Date,
        label: 'Date',
        autoform: {
            type: "bootstrap-datepicker"
        }
    },
    accountNum: {
        type: String,
        label: 'N° de compte',
        max: 255
    },
    accountLab: {
        type: String,
        label: 'Libellé du compte (optionnel)',
        max: 255,
        optional: true
    },
    lab: {
        type: String,
        label: 'Libellé',
        max: 255
    },
    debit: {
        type: Number,
        label: 'Débit'
    },
    credit: {
        type: Number,
        label: 'Crédit'
    }
}));
