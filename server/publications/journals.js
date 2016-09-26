import { Journals, Writings } from '/imports/api/collections';

Meteor.publish('journal.read', function (code) {
    const journal = Journals.findOne({ code });

    if (!journal) {
        return [];
    }

    return [
        Journals.find({ code }),
        Writings.find({
            journalCode: code
        }, {
            fields: {
                date: 1,
                formattedDate: 1,
                lab: 1,
                accountNum: 1,
                accountLab: 1,
                debit: 1,
                credit: 1,
                journalCode: 1,
                accountName: 1,
                num: 1
            }
        })
    ];
});
