import { Accounts, Journals, Writings, Differences } from '/imports/api/collections';

Meteor.methods({
    importWritings: function (writings) {
        check(writings, Array);

        const rules = Differences.find().fetch();

        writings.forEach((writing) => {
            writing.isDivergent = _.some(rules, rule => {
                return _.some(rule.alertAccounts, alertAccount => {
                    let isDivergent;

                    switch (rule.type) {
                        case 1:
                        case 2:
                        case 3:
                            isDivergent = writing.accountNum.startsWith(alertAccount);
                                // || _.some(rule.alertLabs, alertLab => alertLab.includes(writing.lab));

                            if (isDivergent) {
                                writing.differenceId = rule._id;
                                writing.differenceType = rule.type;
                                writing.differenceTag = rule.tag;
                            }

                            return isDivergent;
                        default:
                            throw new Meteor.Error('Not implemented');
                    }
                });
            });

            writing.isValid = !writing.isDivergent;
        });

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
