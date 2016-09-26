import { Accounts, Journals, Writings } from '/imports/api/collections';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

Router.route('/accounts', {
    name: 'accountList',
    template: 'accountList'
});

Router.route('/account/:num', {
    name: 'accountRead',
    template: 'accountRead',
    onBeforeAction: function () {
        const account = Accounts.findOne({
            num: this.params.num
        });

        if (account) this.next();
        else this.render('notFound');
    },
    waitOn: function () {
        return [
            Meteor.subscribe('account.read', this.params.num)
        ];
    },
    data: function () {
        if (this.ready()) {
            return {
                account: Accounts.findOne({
                    num: this.params.num
                }),
                selector: {
                    accountNum: this.params.num
                }
            };
        }
    }
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
        const journal = Journals.findOne({
            code: this.params.code
        });

        if (journal) this.next();
        else this.render('notFound');
    },
    waitOn: function () {
        return [
            Meteor.subscribe('journal.read', this.params.code)
        ];
    },
    data: function () {
        if (this.ready()) {
            return {
                journal: Journals.findOne({
                    code: this.params.code
                }),
                writings: Writings.find({
                    journalCode: this.params.code
                }, {
                    sort: {
                        date: 1,
                        accountName: 1,
                        num: 1
                    }
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

Router.route('/balance-sheet', {
    name: 'balanceSheetRead',
    template: 'balanceSheetRead',
    waitOn: function () {
        return [
            Meteor.subscribe('balanceSheet.read')
        ];
    },
    data: function () {
        if (this.ready()) {
            return {
                accounts: Accounts.find().fetch()
            };
        }
    }
});

Router.route('/income-statement', {
    name: 'incomeStatementRead',
    template: 'incomeStatementRead',
    waitOn: function () {
        return [
            Meteor.subscribe('incomeStatement.read')
        ];
    },
    data: function () {
        if (this.ready()) {
            return {
                accounts: Accounts.find().fetch()
            };
        }
    }
});
