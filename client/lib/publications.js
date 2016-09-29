Meteor.startup(() => {
    Meteor.subscribe('divergentWritings.count');
    Meteor.subscribe('differences.list');
});
