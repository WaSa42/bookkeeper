Template.stepper.helpers({
    isStep: function (step) {
        return parseInt(this.step) === parseInt(step);
    },
    isDone: function (step) {
        return parseInt(step) < parseInt(this.step) && 'done';
    }
});
