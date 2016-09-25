import moment from 'moment';

Template.writingsImportPrewiew.helpers({
    getDate: (date) => {
        return moment(date, 'YYYYMMDD').format('DD MMM YYYY');
    }
});
