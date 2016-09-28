import { Writings } from '/imports/api/collections';

Meteor.publish('divergentWritings.count', function() {
    Counts.publish(this, 'divergentWritings', Writings.find({
        isDivergent: true,
        isValid: false
    }));
});
