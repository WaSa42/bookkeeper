import { DIFFERENCES } from '/imports/api/differences';
import { Differences } from '/imports/api/collections';

Meteor.startup(() => {
    const count = Differences.find().count();
    console.log(count, 'rules');

    if (count !== DIFFERENCES.length) {
        Differences.remove({});

        DIFFERENCES.forEach(rule => {
            console.log('insert rule', rule.name);
            Differences.insert(rule);
        });

        console.log(Differences.find().count(), 'rule inserted');
    }
});
