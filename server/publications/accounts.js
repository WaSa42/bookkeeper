import { Accounts } from '/imports/api/collections';

Meteor.publish('accountRead', accountNum => {
    return [
        Accounts.find({
            num: accountNum
        })
    ];
});
