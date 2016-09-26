import { Writings } from '/imports/api/collections';

Meteor.methods({
    importWritings: function (writings) {
        check(writings, Array);
        Writings.batchInsert(writings);
    }
});
