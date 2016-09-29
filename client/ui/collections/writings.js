import moment from 'moment';
import Papa from 'papaparse';
import Clusterize from 'clusterize.js';
import { Differences, Writings } from '/imports/api/collections';
import { DIFFERENCE_TYPES } from '/imports/api/differences';

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
                        type: 'question',
                        width: '500px',
                        showCancelButton: true,
                        title: `Importer ${result.total} éléments`,
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
    this.data.selection = new ReactiveVar(null);
});

Template.divergentWritingList.helpers({
    selector: function (differenceType) {
        const selector = {
            isDivergent: true,
            isValid: false,
            differenceType
        };

        if (this.selection.get()) {
            selector.differenceTag = this.selection.get().tag;
        }

        return selector;
    }
});

Template.divergentWritingList.events({
    'click .nav-tabs-li': function (event, template) {
        template.data.selection.set(null);
    }
});

Template.globalWritingsActions.helpers({
    rules: function () {
        return Differences.find({
            type: this.typeNum
        }).fetch();
    },
    emptySelectionSelected: function () {
        const template = Template.instance();
        return template && template.data && template.data.export && template.data.export.get() ? 'default' : 'success';
    },
    selected: function () {
        const template = Template.instance();
        const selection = template && template.data && template.data.export && template.data.export.get();
        return selection && selection.tag === this.tag ? 'success' : 'default';
    },
    type: function () {
        const selection = this.export && this.export.get();

        return selection
            ? selection.name
            : DIFFERENCE_TYPES[this.typeNum];
    },
    allowValidateAll: function () {
        return this.typeNum == 1;
    }
});

function askConfirmation(callback) {
    swal({
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        title: 'Êtes-vous sûr ?',
        confirmButtonText: 'Oui, valider !',
        cancelButtonText: 'Non, revérifier'
    }).then(callback);
}

function sendSelection(data, extra = {}) {
    const selection = data.export.get();
    const tag = selection ? selection.tag : null;

    Meteor.call('validateAllWritings', data.typeNum, tag, extra, err => {
        if (err) {
            toastr.error(err.reason);
        } else {
            swal({
                type: 'success',
                text: 'Opération effectuée.'
            });
        }
    });
}

Template.globalWritingsActions.events({
    'click .select': function (event, template) {
        template.data.export.set(this);
    },
    'click .cancel-selection': function (event, template) {
        template.data.export.set(null);
    },
    'click #validate-all': function (event, template) {
        switch (template.data.typeNum) {
            case 1:
            case 2:
                askConfirmation(() => {
                    sendSelection(template.data);
                });
                break;
            case 3:
                askAmount(amount => {
                    askConfirmation(() => {
                        sendSelection(template.data, {
                            amount
                        });
                    });
                });
                break;
            default:
                throw new Error('Not implemented');
        }
    }
});

Template.divergentWritingList1Actions.events({
    'click .validate': function (event, template) {
        const writings = getWritings(template.data.writing);

        swal({
            type: 'warning',
            width: '500px',
            showCancelButton: true,
            reverseButtons: true,
            title: 'Êtes-vous sûr ?',
            confirmButtonText: 'Oui, valider !',
            cancelButtonText: 'Non, revérifier',
            html: Blaze.toHTMLWithData(Template.journalGroupSwal, {
                formattedDate: template.data.writing.formattedDate,
                writings,
                lab: template.data.writing.lab
            })
        }).then(function () {
            insertWritings(writings);
        });
    },
    'click .non-divergent': function (event, template) {
        updateNonDivergentWriting(template.data.writing);
    }
});

function insertWritings(writings) {
    Meteor.call('insertFiscalWritings', writings, err => {
        if (err) {
            toastr.error(err.reason);
        } else {
            swal(
                'Validé !',
                'Opération effectuée.',
                'success'
            );
        }
    });
}

function askAmount(callback) {
    swal.setDefaults({
        confirmButtonText: 'Suivant',
        cancelButtonText: 'Annuler',
        showCancelButton: true,
        reverseButtons: true,
        animation: false,
        progressSteps: ['1', '2']
    });

    swal({
        title: '1. Saisir le montant',
        input: 'number',
        inputValidator: function (value) {
            return new Promise(function (resolve, reject) {
                if (value) {
                    resolve();
                } else {
                    reject('Montant invalide !');
                }
            });
        }
    }).then(function (amount) {
        swal.resetDefaults();
        callback(getCleanFloat(amount));
    }, function () {
        swal.resetDefaults();
    });
}

Template.divergentWritingList3Actions.events({
    'click .validate': function (event, template) {
        askAmount(amount => {
            const writings = getWritings(template.data.writing);

            writings[0].debit = amount;
            writings[1].credit = amount;

            swal({
                type: 'info',
                width: '500px',
                showCancelButton: true,
                reverseButtons: true,
                animation: false,
                title: '2. Êtes-vous sûr ?',
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
        });
    },
    'click .non-divergent': function (event, template) {
        updateNonDivergentWriting(template.data.writing);
    }
});

function updateNonDivergentWriting(writing) {
    swal({
        type: 'warning',
        width: '500px',
        showCancelButton: true,
        reverseButtons: true,
        title: 'Êtes-vous sûr ?',
        confirmButtonText: 'Oui, retirer !',
        cancelButtonText: 'Non, revérifier',
        confirmButtonColor: '#d33',
        html: 'La divergence sera non applicable, par conséquent retirée de la liste.'
    }).then(function () {
        Meteor.call('updateNonDivergentWritings', [writing], err => {
            if (err) {
                toastr.error(err.reason);
            } else {
                swal(
                    'Non appliqué !',
                    'L\'écriture a bien été enregistrée comme non divergente.',
                    'success'
                );
            }
        });
    });
}

Template.divergentWritingList4Actions.events({
    'click .process': function (event, template) {
        const difference = Differences.findOne(template.data.writing.differenceId);

        if (difference.questions && difference.questions.length) {
            askQuestions(difference, template.data.writing);
        } else {
            askConfirmation(() => {
                handleWriting(difference, template.data.writing);
            });
        }
    }
});

function askQuestions(difference, writing) {
    const question = difference.questions.shift();

    swal({
        type: 'info',
        showCancelButton: true,
        reverseButtons: true,
        animation: false,
        title: question.text,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
    }).then(() => {
        handleWriting(difference, writing);
    }, () => {
        updateNonDivergentWriting(writing);
    });
}

function handleWriting(difference, writing) {
    if (difference.manualAmount) {
        askAmount(amount => {
            const writings = getWritings(writing);

            writings[0].accountNum = amount > 0
                ? difference.debitAccount.positive
                : difference.debitAccount.negative;

            writings[1].accountNum = amount > 0
                ? difference.creditAccount.positive
                : difference.creditAccount.negative;

            writings.forEach(w => {
                if (w.debit !== 0) w.debit = amount;
                if (w.credit !== 0) w.credit = amount;
            });

            insertWritings(writings);
        });
    } else {
        const writings = getWritings(writing);
        insertWritings(writings);
    }
}
