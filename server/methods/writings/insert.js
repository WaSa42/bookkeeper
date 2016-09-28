import { Accounts, Writings } from '/imports/api/collections';

Meteor.methods({
    insertFiscalWritings: function (writings) {
        Writings.update({
            _id: writings[0].originalWritingId
        }, {
            $set: {
                isValid: true
            }
        });

        Writings.batchInsert(writings);

        writings.forEach(writing => {
            const account = Accounts.findOne({
                num: writing.accountNum
            });

            if (!account) {
                const id = Accounts.insert({
                    num: writing.accountNum,
                    lab: writing.accountLab
                });

                const doc = Accounts.findOne(id, {fields: {num: 1}});
                doc.updateBalance();
            }
        });
    }
});
