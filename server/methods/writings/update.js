import { Accounts, Writings } from '/imports/api/collections';

Meteor.methods({
    updateNonDivergentWritings: function (writings) {
        const ids = _.pluck(writings, '_id');
        Writings.update({
            _id: {
                $in: ids
            }
        }, {
            $set: {
                isValid: true,
                isDivergent: false
            }
        });
    }
});
