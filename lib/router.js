import { Journals, Writings } from '/imports/api/collections';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

Router.route('/accounts', {
    name: 'accountList',
    template: 'accountList'
});

Router.route('/', {
    name: 'home',
    template: 'home'
});

Router.route('/journals', {
    name: 'journalList',
    template: 'journalList'
});

Router.route('/journal/:code', {
    name: 'journalRead',
    template: 'journalRead',
    onBeforeAction: function () {
        const journal = Journals.findOne({code: this.params.code});
        if (journal)
            this.next();
        else
            this.render('notFound');
    },
    waitOn: function () {
        return [
            Meteor.subscribe('journal.read', this.params.code)
        ];
    },
    data: function () {
        if (this.ready()) {
            const journal = Journals.findOne({code: this.params.code});
            return {
                journal,
                writings: Writings.find({
                    journalCode: journal.code
                }).fetch()
            };
        }
    }
});

Router.route('/writings/import', {
    name: 'writingsImport',
    template: 'writingsImport',
    data: {}
});

Router.route('/writings', {
    name: 'writingList',
    template: 'writingList'
});
