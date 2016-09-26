import { Journals, Writings } from '/imports/api/collections';

Meteor.publish('journal.read', function (code) {
    const journal = Journals.findOne({code: code});

    if (!journal) {
        return [];
    }

    return [
        Journals.find({code: code}),
        Writings.find({
            journalCode: journal.code
        }, {
            fields: {
                date: 1,
                formattedDate: 1,
                lab: 1,
                accountNum: 1,
                accountLab: 1,
                debit: 1,
                credit: 1
            }
        })
    ];
});
