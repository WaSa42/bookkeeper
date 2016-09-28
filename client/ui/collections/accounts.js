import { Writings } from '/imports/api/collections';

Template.accountListActions.onRendered(() => {
    $('[data-toggle="tooltip"]').tooltip();
});

Template.accountRead.onCreated(function () {
    this.autorun(() => {
        const writingsIds = _.pluck(Writings.find().fetch(), 'originalWritingId');
        this.subscribe('fiscalAccount.read', writingsIds)
    });
});

Template.accountReadActions.helpers({
    fiscal: writing => writing.originalWritingId,
    originalWriting: writing => Writings.findOne(writing.originalWritingId),
    writingPopover: writing => Blaze.toHTMLWithData(Template.writingPopover, writing)
});

Template.accountReadActions.onRendered(function () {
    this.autorun(() => {
        setTimeout(() => {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover({
                html: true
            });
        }, 1000);
    });
});

Template.accountReadActions.onDestroyed(function () {
    this.autorun(() => {
        $('[data-toggle="popover"]').popover('destroy');
    });
});
