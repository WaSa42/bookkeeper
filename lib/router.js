Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

Router.route('/', {
    name: 'home',
    template: 'home'
});

Router.route('/accounts', {
    name: 'accountList',
    template: 'accountList'
});

Router.route('/writings/import', {
    name: 'writingsImport',
    template: 'writingsImport'
});
