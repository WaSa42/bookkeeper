Template.journalListActions.onRendered(() => {
    $('[data-toggle="tooltip"]').tooltip()
});

Template.journalRead.helpers({
    groups: function () {
        const groups = [];
        const writingPerDate = _.groupBy(this.writings, 'formattedDate');

        _.each(writingPerDate, (dateWritings, formattedDate) => {
            const dateWritingsPerLab = _.groupBy(dateWritings, 'lab');

            _.each(dateWritingsPerLab, (dateLabWritings, lab) => {
                groups.push({
                    formattedDate,
                    lab,
                    writings: dateLabWritings
                });
            })
        });

        return groups;
    }
});
