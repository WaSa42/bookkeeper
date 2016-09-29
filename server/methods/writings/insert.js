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

            let id;

            if (account) {
                id = account._id;
            } else {
                id = Accounts.insert({
                    num: writing.accountNum,
                    lab: writing.accountLab
                });
            }

            const doc = Accounts.findOne(id, {fields: {num: 1}});
            doc.updateBalance();
        });
    },
    validateAllWritings: function (typeNum, differenceTag) {
        const selector = {
            isDivergent: true,
            isValid: false,
            differenceType: typeNum
        };

        if (differenceTag) {
            selector.differenceTag = differenceTag;
        }

        const writings = Writings.find(selector).fetch();
        // TODO créer les écritures fiscales
        console.log(writings.length, 'écritures à traiter');
    }
});
