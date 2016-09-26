import { Accounts, Journals, Writings } from '/imports/api/collections';

Meteor.methods({
    importWritings: function (writings) {
        check(writings, Array);

        Writings.batchInsert(writings);

        // Accounts
        const allAccountsNums = _.uniq(writings.map(writing => writing.accountNum));
        const savedAccounts = Accounts.find({
            num: {
                $in: allAccountsNums
            }
        }, {
            fields: {
                num: 1
            }
        }).fetch();

        const savedAccountsNums = _.pluck(savedAccounts, 'num');
        const newAccountsNums = _.difference(allAccountsNums, savedAccountsNums);

        const newAccountsValues = newAccountsNums.map(newAccountNum => ({
            num: newAccountNum,
            lab: _.findWhere(writings, {
                accountNum: newAccountNum
            }).accountLab
        }));

        Accounts.batchInsert(newAccountsValues);

        // Journals
        const allJournalsCodes = _.uniq(writings.map(writing => writing.journalCode));
        const savedJournals = Journals.find({
            code: {
                $in: allJournalsCodes
            }
        }, {
            fields: {
                code: 1
            }
        }).fetch();

        const savedJournalsCodes = _.pluck(savedJournals, 'code');
        const newJournalsCodes = _.difference(allJournalsCodes, savedJournalsCodes);

        const newJournalsValues = newJournalsCodes.map(newJournalCode => ({
            code: newJournalCode,
            lab: _.findWhere(writings, {
                journalCode: newJournalCode
            }).journalLab
        }));

        Journals.batchInsert(newJournalsValues);
        
        // Balances
        Accounts.find({}, {fields: {num: 1}}).fetch().forEach(account => account.updateBalance());
    }
});
