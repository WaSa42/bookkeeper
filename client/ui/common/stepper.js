Template.stepper.helpers({
    isDone: function (step) {
        return parseInt(step) < parseInt(this.step) && 'done';
    },
    stepContent: function () {
        switch (parseInt(this.step)) {
            case 1: return Template.writingsImport;
            case 2: return Template.writingList;
            case 3: return Template.divergentWritingList;
            case 4: return 'Résultats & bilans';
            case 5: return 'Export';
            default: return Template.writingsImport;
        }
    }
});
