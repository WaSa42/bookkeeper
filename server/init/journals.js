import { Journals } from '/imports/api/collections';

Meteor.startup(() => {
    const journal = Journals.findOne({
        code: 'OF'
    });

    if (!journal) {
        Journals.insert({
            code: 'OF',
            lab: 'Opérations fiscales'
        });
    }
});
