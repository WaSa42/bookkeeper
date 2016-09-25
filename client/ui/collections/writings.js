import moment from 'moment';
import Papa from 'papaparse';

Template.writingsImport.onCreated(function () {
    this.data.loading = new ReactiveVar(false);
    this.data.rows = new ReactiveVar([]);
});

Template.writingsImportPrewiew.helpers({
    getDate: date => {
        return date && moment(date, 'YYYYMMDD').format('DD/MM/YYYY');
    }
});

Template.writingsImport.events({
    'change #file': function (event) {
        const self = this;
        const files = event.target.files;

        if (files && files.length) {
            $('#file-substitute').val($(event.target).val());
            self.loading.set(true);

            Papa.parse(files[0], {
                delimiter: '\t',
                skipEmptyLines: true,
                error: (err, file, input, reason) => {
                    self.loading.set(false);
                    console.log('parser error', err, reason);
                    alert(reason);
                },
                complete: results => {
                    self.loading.set(false);
                    if (results.errors.length) {
                        console.log('parser error', results.errors);
                        alert('Error');
                    } else {
                        const rows = results.data.map(row => row.map(column => column.trim()));
                        rows.shift();
                        self.rows.set(rows);
                    }
                }
            });
        }
    },
    'click #writings-import-button, submit #writings-import-form': function (event) {
        
    }
});
