if (Meteor.isClient) {
    Meteor.startup(function () {
        Session.set("showLoadingIndicator", true);

        TAPi18n.setLanguage('fr')
            .done(() => Session.set("showLoadingIndicator", false))
            .fail((e) => console.log(e));
    });
}
