import { Accounts, AccountNum } from '/imports/api/collections';

Meteor.publish('incomeStatement.read', () => {
    return Accounts.find({
        num: AccountNum.INCOME_STATEMENT
    });
});
