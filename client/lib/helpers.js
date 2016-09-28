getCleanFloat = input => parseFloat(parseFloat(input.toString().replace(/\s+/g, '').replace(',', '.')).toFixed(2));

Template.registerHelper('isEmpty', data => _.isEmpty(data));
Template.registerHelper('abs', value => Math.abs(value));
Template.registerHelper('getCleanFloat', value => getCleanFloat(value));

Template.registerHelper('debug', function () {
    const args = [].slice.call(arguments);
    args.pop();
    console.log(args);
});
