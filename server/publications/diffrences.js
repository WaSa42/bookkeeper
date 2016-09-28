import { Differences } from '/imports/api/collections';

Meteor.publish('differences.list', () => {
    return Differences.find();
});
