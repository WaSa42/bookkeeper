Template.registerHelper('isEmpty', data => {
    return _.isEmpty(data)
});

Template.registerHelper('debug', function () {
    const args = [].slice.call(arguments);
    args.pop();
    console.log(args);
});
