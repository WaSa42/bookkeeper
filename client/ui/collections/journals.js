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

Template.journalGroup.helpers({
    credit: function (writing) {
        return writing.credit != 0 && writing.credit;
    },
    debit: function (writing) {
        return writing.debit != 0 && writing.debit;
    },
    alignAccountWithCredit: function (writing) {
        return writing.credit > 0 && 'text-right';
    }
});
