import moment from 'moment';
import Papa from 'papaparse';
import Clusterize from 'clusterize.js';

Template.writingsImport.onCreated(function () {
    this.data.cluster = null;
    this.data.showPreview = new ReactiveVar(false);
    this.data.totalRows = new ReactiveVar(0);
});

Template.writingsImport.helpers({
    previewHidden: function () {
        return !this.showPreview.get() && 'hidden';
    },
    isEmptyRows: function () {
        return this.totalRows.get() === 0;
    }
});

Template.writingsImport.events({
    'click #browse': function (event) {
        event.preventDefault();
        $('#file').click();
    },
    'change #file': function (event) {
        const files = event.target.files;

        if (files && files.length) {
            $('#file-substitute').val(_.last(event.target.value.split('\\')));

            if (this.cluster) {
                this.cluster.clear();
            }

            if (!this.showPreview.get()) {
                this.showPreview.set(true);
            }

            setTimeout(() => {
                parse(files[0], rows => {
                    this.totalRows.set(rows.length);

                    if (this.cluster) {
                        this.cluster.update(rows);
                    } else {
                        this.cluster = new Clusterize({
                            rows,
                            scrollId: 'scroll-area',
                            contentId: 'content-area',
                            no_data_text: 'Chargement...'
                        });
                    }
                });
            }, 500);
        }
    }
});

Template.writingsImportPreviewRow.helpers({
    getDate: date => {
        return date && moment(date, 'YYYYMMDD').format('DD/MM/YYYY');
    }
});

function parse(file, callback) {
    Papa.parse(file, {
        delimiter: '\t',
        skipEmptyLines: true,
        encoding: 'iso-8859-1',
        error: (err, file, input, reason) => {
            alert(reason);
        },
        complete: results => {
            if (results.errors.length) {
                console.log('parser error', results.errors);
                alert('Error');
            } else {
                const rows = results.data.map(row => Blaze.toHTMLWithData(Template.writingsImportPreviewRow, {
                    writing: row.map(column => column.trim())
                }));

                rows.shift();
                callback(rows);
            }
        }
    });
}
