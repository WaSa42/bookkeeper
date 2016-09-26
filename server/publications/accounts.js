import { Accounts } from '/imports/api/collections';

Meteor.publish('account.read', accountNum => {
    return [
        Accounts.find({
            num: accountNum
        })
    ];
});
