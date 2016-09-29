import { Writings, Journals } from '/imports/api/collections';

Meteor.publish('divergentWritings.count', function() {
    Counts.publish(this, 'divergentWritings', Writings.find({
        isDivergent: true,
        isValid: false
    }));
});

Meteor.publish('fiscalWritings', function() {
    return [
        Writings.find({journalCode: 'OF'}),
        Journals.find({code: 'OF'})
    ]
});
