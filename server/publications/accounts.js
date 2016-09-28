import { Accounts, Writings } from '/imports/api/collections';

Meteor.publish('account.read', accountNum => {
    return Accounts.find({
        num: accountNum
    });
});

Meteor.publish('fiscalAccount.read', ids => {
    return Writings.find({
        _id: {
            $in: ids
        }
    });
});
