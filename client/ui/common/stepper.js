import { Journals, Writings } from '/imports/api/collections';

Template.stepper.onCreated(function () {
    this.subscribe('fiscalWritings');
});

Template.stepper.helpers({
    isStep: function (step) {
        return parseInt(this.step) === parseInt(step);
    },
    isDone: function (step) {
        return parseInt(step) < parseInt(this.step) && 'done';
    },
    fiscalJournal: function () {
        return Journals.findOne({code: 'OF'});
    },
    fiscalWritings: function () {
        return Writings.find({journalCode: 'OF'}).fetch();
    }
});
