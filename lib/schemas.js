WritingsSchema = new SimpleSchema({
    accountNum: {
        type: String,
        label: 'N° de compte',
        max: 255
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
    },
    date: {
        type: Date,
        label: 'Date',
        autoform: {
            type: 'bootstrap-datepicker',
            datePickerOptions: {
                language: 'fr'
            }
        }
    }
});
