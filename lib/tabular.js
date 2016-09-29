import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';

import { Accounts, Writings, Journals, Differences } from '../imports/api/collections';

if (Meteor.isClient) {
    Template.tabular.onCreated(function () {
        $.extend(true, $.fn.dataTable.defaults, {
            language: {
                decimal: TAPi18n.__('tableDef.decimal'),
                emptyTable: TAPi18n.__('tableDef.emptyTable'),
                info: TAPi18n.__('tableDef.info'),
                infoEmpty: TAPi18n.__('tableDef.infoEmpty'),
                infoFiltered: TAPi18n.__('tableDef.infoFiltered'),
                infoPostFix: TAPi18n.__('tableDef.infoPostFix'),
                thousands: TAPi18n.__('tableDef.thousands'),
                lengthMenu: TAPi18n.__('tableDef.lengthMenu'),
                loadingRecords: TAPi18n.__('tableDef.loadingRecords'),
                processing: TAPi18n.__('tableDef.processing'),
                search: TAPi18n.__('tableDef.search'),
                zeroRecords: TAPi18n.__('tableDef.zeroRecords'),
                paginate: {
                    first: TAPi18n.__('tableDef.paginate.first'),
                    last: TAPi18n.__('tableDef.paginate.last'),
                    next: TAPi18n.__('tableDef.paginate.next'),
                    previous: TAPi18n.__('tableDef.paginate.previous')
                },
                aria: {
                    sortAscending: TAPi18n.__('tableDef.aria.sortAscending'),
                    sortDescending: TAPi18n.__('tableDef.aria.sortDescending')
                }
            }
        });
    });
}

const commonTabularOptions = {
    responsive: true,
    autoWidth: false,
    stateSave: true
};

const commonDivergencesExtreFields = ['formattedDate', 'journalCode', 'differenceId', 'differenceType', 'num', 'lab', 'originalWritingId'];
const commonDivergencesColumns = [{
        data: 'accountNum',
        title: 'N° de compte'
    }, {
        data: 'date',
        title: 'Date',
        render: (val, type, doc) => doc.formattedDate
    }, {
        data: 'journalCode',
        title: 'Code journal'
    }, {
        data: 'lab',
        title: 'Libellé'
    }, {
        data: 'debit',
        title: 'Débit'
    }, {
        data: 'credit',
        title: 'Crédit'
    }
];

new Tabular.Table({
    ...commonTabularOptions,
    name: 'Accounts',
    collection: Accounts,
    columns: [
        {
            data: 'num',
            title: '#'
        }, {
            data: 'lab',
            title: 'Libellé'
        }, {
            data: 'balance',
            title: 'Solde',
            render: (val, type, doc) => doc.getBalanceLabel()
        }, {
            title: 'Actions',
            tmpl: Meteor.isClient && Template.accountListActions,
            tmplContext: account => ({
                account
            })
        }
    ]
});

new Tabular.Table({
    ...commonTabularOptions,
    name: 'FiscalAccounts',
    collection: Accounts,
    columns: [
        {
            data: 'num',
            title: '#'
        }, {
            data: 'lab',
            title: 'Libellé'
        }, {
            data: 'balance',
            title: 'Solde',
            render: (val, type, doc) => doc.getBalanceLabel()
        }, {
            title: 'Actions',
            tmpl: Meteor.isClient && Template.accountListActions,
            tmplContext: account => ({
                account
            })
        }
    ]
});

new Tabular.Table({
    ...commonTabularOptions,
    name: 'Journals',
    collection: Journals,
    columns: [
        {data: 'code', title: '#'},
        {data: 'lab', title: 'Libellé'},
        {
            title: 'Actions',
            tmpl: Meteor.isClient && Template.journalListActions,
            tmplContext: function (rowData) {
                return {
                    journal: rowData
                };
            }
        }
    ]
});

new Tabular.Table({
    ...commonTabularOptions,
    name: 'Writings',
    collection: Writings,
    columns: [{
            data: 'accountNum',
            title: 'N° de compte'
        }, {
            data: 'date',
            title: 'Date',
            render: (val, type, doc) => doc.formattedDate
        }, {
            data: 'journalCode',
            title: 'Code journal'
        }, {
            data: 'lab',
            title: 'Libellé'
        }, {
            data: 'debit',
            title: 'Débit'
        }, {
            data: 'credit',
            title: 'Crédit'
        }, {
            title: 'Actions',
            tmpl: Meteor.isClient && Template.writingListActions,
            tmplContext: writing => ({
                writing
            })
        }
    ],
    extraFields: commonDivergencesExtreFields
});

new Tabular.Table({
    ...commonTabularOptions,
    name: 'Account',
    collection: Writings,
    columns: [
        {
            data: 'date',
            title: 'Date',
            render: (val, type, doc) => doc.formattedDate
        }, {
            data: 'debit',
            title: 'Débit',
            render: val => val === 0 ? '' : val
        }, {
            data: 'credit',
            title: 'Crédit',
            render: val => val === 0 ? '' : val
        }, {
            title: 'Actions',
            tmpl: Meteor.isClient && Template.accountReadActions,
            tmplContext: writing => ({
                writing
            })
        }
    ],
    extraFields: commonDivergencesExtreFields
});

new Tabular.Table({
    ...commonTabularOptions,
    name: 'DivergentWritings1',
    collection: Writings,
    columns: [
        ...commonDivergencesColumns,
        {
            title: 'Actions',
            tmpl: Meteor.isClient && Template.divergentWritingList1Actions,
            tmplContext: writing => ({
                writing
            })
        }
    ],
    extraFields: commonDivergencesExtreFields
});

new Tabular.Table({
    ...commonTabularOptions,
    name: 'DivergentWritings2',
    collection: Writings,
    columns: [
        ...commonDivergencesColumns,
        {
            title: 'Actions',
            tmpl: Meteor.isClient && Template.divergentWritingList1Actions,
            tmplContext: writing => ({
                writing
            })
        }
    ],
    extraFields: commonDivergencesExtreFields
});

new Tabular.Table({
    ...commonTabularOptions,
    name: 'DivergentWritings3',
    collection: Writings,
    columns: [
        ...commonDivergencesColumns,
        {
            title: 'Actions',
            tmpl: Meteor.isClient && Template.divergentWritingList3Actions,
            tmplContext: writing => ({
                writing
            })
        }
    ],
    extraFields: commonDivergencesExtreFields
});

new Tabular.Table({
    ...commonTabularOptions,
    name: 'DivergentWritings4',
    collection: Writings,
    columns: [
        ...commonDivergencesColumns,
        {
            title: 'Actions',
            tmpl: Meteor.isClient && Template.divergentWritingList4Actions,
            tmplContext: writing => ({
                writing
            })
        }
    ],
    extraFields: commonDivergencesExtreFields
});

new Tabular.Table({
    ...commonTabularOptions,
    name: 'DivergentWritings5',
    collection: Writings,
    columns: [
        ...commonDivergencesColumns,
        {
            title: 'Actions',
            tmpl: Meteor.isClient && Template.divergentWritingList5Actions,
            tmplContext: writing => ({
                writing
            })
        }
    ],
    extraFields: commonDivergencesExtreFields
});
