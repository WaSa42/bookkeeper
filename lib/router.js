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

Router.route('/writings/import', {
    name: 'writingsImport',
    template: 'writingsImport',
    data: {}
});

Router.route('/writings', {
    name: 'writingList',
    template: 'writingList'
});
