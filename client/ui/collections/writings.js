import moment from 'moment';
import Papa from 'papaparse';
import Clusterize from 'clusterize.js';
import { Differences, Writings } from '/imports/api/collections';

Template.writingsImport.onCreated(function () {
    if (!this.data) {
        this.data = {};
    }

    this.data.cluster = null;
    this.data.writings = null;
    this.data.submitting = false;
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
                parse(files[0], result => {
                    this.totalRows.set(result.total);
                    this.writings = result.writings;

                    if (this.cluster) {
                        this.cluster.update(result.rows);
                    } else {
                        this.cluster = new Clusterize({
                            rows: result.rows,
                            scrollId: 'scroll-area',
                            contentId: 'content-area',
                            no_data_text: 'Chargement...'
                        });
                    }

                    swal({
                        type: 'info',
                        width: '500px',
                        showCancelButton: true,
                        title: 'Importer directement ?',
                        confirmButtonText: 'Oui, importer !',
                        cancelButtonText: 'Non, prévisualiser',
                        text: 'Vous pouvez importer directement votre FEC ou le prévisualisez auparavant.'
                    }).then(function () {
                        $('#writings-import-form').submit();
                    });
                });
            }, 500);
        }
    },
    'submit #writings-import-form': function (event, template) {
        event.preventDefault();
        const loading = $('#writings-import-loading').show();
        if (template.data.submitting) {
            return false;
        }

        template.data.submitting = true;

        if (template.data.writings) {
            Meteor.call('importWritings', template.data.writings, err => {
                template.data.submitting = false;

                if (err) {
                    toastr.error('Une erreur s\'est produite lors de l\'importation de votre fichier.', 'Oops!');
                } else {
                    toastr.success('Écritures importées avec succès !');
                    if (Router.current().route.getName() == 'writingsImport') Router.go('divergentWritingList');
                    else Router.go('stepper', {step: '2'});
                }

                loading.hide();
            });
        }
    }
});

Template.writingsImportPreviewRow.helpers({
    formatDate: date => {
        return date && moment(date).format('DD/MM/YYYY');
    }
});

Template.writingListActions.onRendered(() => {
    $('[data-toggle="tooltip"]').tooltip()
});

function parse(file, callback) {
    const loading = $('.loading').show();
    Papa.parse(file, {
        delimiter: '\t',
        skipEmptyLines: true,
        encoding: 'iso-8859-1', // TODO: detect encoding?
        error: (err, file, input, reason) => {
            toastr.error(reason);
        },
        complete: results => {
            loading.hide();
            if (results.errors.length) {
                console.log('parser error', results.errors);
                results.errors.forEach(error => {
                    toastr.error(error.message);
                });
            } else {
                const writings = [];
                results.data.shift();

                results.data.forEach((row, y) => {
                    row.forEach((column, x) => {
                        results.data[y][x] = results.data[y][x].trim();
                    });

                    const getDate = input => input
                        ? moment(input, 'YYYYMMDD').toDate()
                        : null;

                    const getFormattedDate = input => input
                        ? moment(input, 'YYYYMMDD').format('DD/MM/YYYY')
                        : null;
                    
                    writings.push({
                        journalCode: results.data[y][0],
                        journalLab: results.data[y][1],
                        num: results.data[y][2],
                        date: getDate(results.data[y][3]),
                        formattedDate: getFormattedDate(results.data[y][3]),
                        accountNum: results.data[y][4],
                        accountLab: results.data[y][5],
                        accountName: `${results.data[y][4]} ${results.data[y][5]}`,
                        accountAuxNum: results.data[y][6],
                        accountAuxLab: results.data[y][7],
                        pieceRef: results.data[y][8],
                        pieceDate: getDate(results.data[y][9]),
                        lab: results.data[y][10],
                        debit: getCleanFloat(results.data[y][11]),
                        credit: getCleanFloat(results.data[y][12]),
                        let: results.data[y][13],
                        dateLet: getDate(results.data[y][14]),
                        validDate: getDate(results.data[y][15]),
                        amountCurrency: results.data[y][16],
                        iCurrency: results.data[y][17]
                    });
                });

                callback({
                    total: writings.length,
                    writings,
                    rows: writings.map(writing => Blaze.toHTMLWithData(Template.writingsImportPreviewRow, {
                        writing
                    }))
                });
            }
        }
    });
}

Template.writingCreate.helpers({
    writing: function () {
        return Writings;
    }
});

Template.divergentWritingList.onCreated(function () {
    this.subscribe('differences.list');
});

Template.divergentWritingList.helpers({
    selector: function () {
        return {
            isDivergent: true,
            isValid: false
        };
    }
});

Template.divergentWritingListActions.events({
    'click .validate': function (event, template) {
        const difference = Differences.findOne(template.data.writing.differenceId);

        const getLabel = (accountNum, writing) => {
            return accountNum === 'F19'
                ? 'DIVERGENCES DÉFINITIVES'
                : `${writing.lab}, AJUSTEMENT FISCAL`;
        };

        const now = moment();

        const debitFiscalWriting = {
            accountNum: difference.debitAccount,
            accountLab: getLabel(difference.debitAccount, template.data.writing),
            debit: template.data.writing.debit || template.data.writing.credit,
            credit: 0,
            originalWritingId: template.data.writing._id,
            date: now.toDate(),
            formattedDate: now.format('DD/MM/YYYY')
        };

        const creditFiscalWriting = {
            accountNum: difference.creditAccount,
            accountLab: getLabel(difference.creditAccount, template.data.writing),
            credit: template.data.writing.credit || template.data.writing.debit,
            debit: 0,
            originalWritingId: template.data.writing._id
        };

        const writings = [
            debitFiscalWriting,
            creditFiscalWriting
        ];

        swal({
            type: 'info',
            width: '500px',
            showCancelButton: true,
            title: 'Êtes-vous sûr ?',
            confirmButtonText: 'Oui, valider !',
            cancelButtonText: 'Non, revérifier',
            html: Blaze.toHTMLWithData(Template.journalGroupSwal, {
                formattedDate: template.data.writing.formattedDate,
                writings,
                lab: template.data.writing.lab
            })
        }).then(function () {
            Meteor.call('insertFiscalWritings', writings, err => {
                if (err) {
                    toastr.error(err.reason);
                } else {
                    swal(
                        'Validé !',
                        'L\'écriture a bien été enregistrée.',
                        'success'
                    );
                }
            });
        });
    }
});

Template.divergentWritingListActions.onRendered(() => {
    $('[data-toggle="tooltip"]').tooltip()
});
