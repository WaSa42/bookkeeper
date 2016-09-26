import { Accounts } from '/imports/api/collections';

Meteor.publish('incomeStatement.read', () => {
    return Accounts.find({
        num: /^[6-7]/
    });
});
