Template.stepper.helpers({
    isStep: function (step) {
        return parseInt(this.step) === parseInt(step);
    },
    isDone: function (step) {
        return parseInt(step) < parseInt(this.step) && 'done';
    },
    stepContent: function () {
        switch (parseInt(this.step)) {
            case 2: return Template.divergentWritingList;
            case 3: return Template.balanceSheetRead;
            case 4: return 'Export';
            default: return Template.writingsImport;
        }
    }
});
