getCleanFloat = input => parseFloat(parseFloat(input.toString().replace(/\s+/g, '').replace(',', '.')).toFixed(2));

Template.registerHelper('isEmpty', data => _.isEmpty(data));
Template.registerHelper('abs', value => Math.abs(value));
Template.registerHelper('getCleanFloat', value => getCleanFloat(value));

Template.registerHelper('debug', function () {
    const args = [].slice.call(arguments);
    args.pop();
    console.log(args);
});

Handlebars.registerHelper("switch", function(value, options) {
    this._switch_value_ = value;
    var html = options.fn(this); // Process the body of the switch block
    delete this._switch_value_;
    return html;
});

Handlebars.registerHelper("case", function(value, options) {
    if (value == this._switch_value_) {
        return options.fn(this);
    }
});
