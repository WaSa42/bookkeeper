import { Accounts } from '/imports/api/collections';

Meteor.publish('balanceSheet.read', () => {
    return Accounts.find({
        num: /^[1-5]/
    });
});
