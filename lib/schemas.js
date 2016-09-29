WritingsSchema = new SimpleSchema({
    accountNum: {
        type: String,
        label: 'N° de compte :',
        max: 255,
        autoform: {
            placeholder: 'F6711'
        }
    },
    lab: {
        type: String,
        label: 'Libellé :',
        max: 255,
        autoform: {
            placeholder: 'AMENDES 4, AJUSTEMENT FISCAL'
        }
    },
    debit: {
        type: Number,
        label: 'Débit :',
        autoform: {
            placeholder: '0'
        }
    },
    credit: {
        type: Number,
        label: 'Crédit :',
        autoform: {
            placeholder: '153'
        }
    },
    date: {
        type: Date,
        label: 'Date :',
        autoform: {
            placeholder: '06/03/2016',
            type: 'bootstrap-datepicker',
            datePickerOptions: {
                language: 'fr'
            }
        }
    }
});
