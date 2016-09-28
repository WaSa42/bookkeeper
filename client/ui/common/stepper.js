Template.stepper.helpers({
    isStep: function (step) {
        return parseInt(this.step) === parseInt(step);
    },
    isDone: function (step) {
        return parseInt(step) < parseInt(this.step) && 'done';
    },
    stepContent: function () {
        switch (parseInt(this.step)) {
            case 2: return Template.writingList;
            case 3: return Template.divergentWritingList;
            case 4: return 'Résultats & bilans';
            case 5: return 'Export';
            default: return Template.writingsImport;
        }
    }
});
