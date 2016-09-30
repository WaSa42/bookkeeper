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

const booleanField = {
    type: Boolean,
    autoform: {
        type: 'boolean-select',
        trueLabel: 'Oui',
        falseLabel: 'Non',
        firstOption: 'Sélectionnez une réponse',
        defaultValue: false
    }
};

Challenge6Schema = new SimpleSchema({
    sumptuary: {
        ...booleanField,
        label: 'Avez-vous engagé des dépenses somptuaires ?',
    },
    sumptuaryAccountNum: {
        type: String,
        label: 'Numéro de compte',
        optional: true,
        custom: function () {
            return this.field('sumptuary').value === true && !this.value ? 'required' : false;
        }
    },
    quote: {
        ...booleanField,
        label: 'Devez-vous déclarer une quote part de résultat de société transparente ?',
    },
    quoteAmount: {
        type: Number,
        label: 'Montant',
        optional: true,
        custom: function () {
            return this.field('quote').value === true && !this.value ? 'required' : false;
        }
    },
    shares: {
        ...booleanField,
        label: 'Avez-vous reçu des dividendes de sociétés transparentes ?'
    },
    sharesAccountNum: {
        type: String,
        label: 'Numéro de compte',
        optional: true,
        custom: function () {
            return this.field('shares').value === true && !this.value ? 'required' : false;
        }
    },
    bonus: {
        ...booleanField,
        label: 'Avez-vous versé des primes sur la tête d\'un salarié ?'
    },
    bonusAccountNum: {
        type: String,
        label: 'Numéro de compte',
        optional: true,
        custom: function () {
            return this.field('bonus').value === true && !this.value ? 'required' : false;
        }
    },
    accident: {
        ...booleanField,
        label: 'Voulez-vous étaler l\'imposition +value suite à un sinistre ?'
    },
    accidentAccountNum: {
        type: String,
        label: 'Numéro de compte',
        optional: true,
        custom: function () {
            return this.field('accident').value === true && !this.value ? 'required' : false;
        }
    }
});
